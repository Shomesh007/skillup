-- Additive Skillup catalog. No Lotus tables, Auth settings or existing jobs are changed.
create schema if not exists skillup_private;
revoke all on schema skillup_private from public, anon, authenticated;
grant usage on schema skillup_private to service_role;

create table public.skillup_job_sources (
 id text primary key, company text not null, provider text not null, board text not null,
 careers_url text not null check(careers_url like 'https://%'), enabled boolean not null default true,
 coverage text not null default 'India postings from official board',
 last_attempt_at timestamptz, last_success_at timestamptz,
 last_status text not null default 'pending' check(last_status in ('pending','running','ok','failed')),
 last_count integer not null default 0, last_error text,
 lease_id uuid, lease_until timestamptz
);
create table public.skillup_jobs (
 id text primary key, source_id text not null references public.skillup_job_sources(id),
 payload jsonb not null, active boolean not null default true,
 first_seen_at timestamptz not null default now(), last_seen_at timestamptz not null default now(),
 closed_at timestamptz
);
create index skillup_jobs_active_source on public.skillup_jobs(source_id,id) where active;
create table public.skillup_job_runs (
 id uuid primary key, source_id text not null references public.skillup_job_sources(id),
 started_at timestamptz not null default now(), finished_at timestamptz,
 status text not null check(status in ('running','ok','failed')), job_count integer, error text
);
create index skillup_job_runs_source_started on public.skillup_job_runs(source_id,started_at desc);
alter table public.skillup_job_sources enable row level security;
alter table public.skillup_jobs enable row level security;
alter table public.skillup_job_runs enable row level security;
revoke all on public.skillup_job_sources,public.skillup_jobs,public.skillup_job_runs from public,anon,authenticated;
grant select on public.skillup_job_sources,public.skillup_jobs to anon,authenticated;
grant all on public.skillup_job_sources,public.skillup_jobs,public.skillup_job_runs to service_role;
create policy skillup_sources_public_read on public.skillup_job_sources for select to anon,authenticated using(enabled);
create policy skillup_jobs_public_read on public.skillup_jobs for select to anon,authenticated
 using(active and exists(select 1 from public.skillup_job_sources source where source.id=source_id and source.enabled));

-- Generated inside the database, never committed, printed, or sent to the browser.
do $$begin
 if not exists(select 1 from vault.secrets where name='skillup_collector_token') then
  perform vault.create_secret(encode(extensions.gen_random_bytes(32),'hex'),'skillup_collector_token','Skillup collector-only authentication');
 end if;
end$$;
create function skillup_private.check_collector_token(p_token text) returns boolean
 language sql stable security definer set search_path=''
 as $$select length(p_token)=64 and exists(select 1 from vault.decrypted_secrets where name='skillup_collector_token' and decrypted_secret=p_token)$$;
revoke all on function skillup_private.check_collector_token(text) from public,anon,authenticated;
grant execute on function skillup_private.check_collector_token(text) to service_role;
create function public.skillup_authorize_refresh(p_token text) returns boolean
 language sql stable security invoker set search_path=''
 as $$select skillup_private.check_collector_token(p_token)$$;
revoke all on function public.skillup_authorize_refresh(text) from public,anon,authenticated;
grant execute on function public.skillup_authorize_refresh(text) to service_role;

create function public.skillup_begin_refresh(p_source_id text) returns uuid
 language plpgsql security invoker set search_path='' as $$
declare source public.skillup_job_sources%rowtype; run_id uuid;
begin
 select * into source from public.skillup_job_sources where id=p_source_id and enabled for update;
 if not found then raise exception 'Unknown or disabled source'; end if;
 if source.lease_until>now() then return null; end if;
 if source.lease_id is not null then
  update public.skillup_job_runs set status='failed',finished_at=now(),error='Previous collector lease expired' where id=source.lease_id and status='running';
 end if;
 run_id:=gen_random_uuid();
 insert into public.skillup_job_runs(id,source_id,status) values(run_id,p_source_id,'running');
 update public.skillup_job_sources set lease_id=run_id,lease_until=now()+interval '3 minutes',last_attempt_at=now(),last_status='running',last_error=null where id=p_source_id;
 return run_id;
end$$;
revoke all on function public.skillup_begin_refresh(text) from public,anon,authenticated;
grant execute on function public.skillup_begin_refresh(text) to service_role;

create function public.skillup_finish_refresh(p_source_id text,p_run_id uuid,p_jobs jsonb,p_error text default null) returns integer
 language plpgsql security invoker set search_path='' as $$
declare source public.skillup_job_sources%rowtype; count_jobs integer;
begin
 select * into source from public.skillup_job_sources where id=p_source_id for update;
 if not found or source.lease_id is distinct from p_run_id then raise exception 'Collector lease no longer belongs to this run'; end if;
 if p_error is not null then
  update public.skillup_job_runs set status='failed',finished_at=now(),error=left(p_error,300) where id=p_run_id;
  update public.skillup_job_sources set last_status='failed',last_error=left(p_error,300),lease_id=null,lease_until=null where id=p_source_id;
  return source.last_count;
 end if;
 if jsonb_typeof(p_jobs) is distinct from 'array' then raise exception 'Expected complete jobs array'; end if;
 count_jobs:=jsonb_array_length(p_jobs);
 if count_jobs>5000 then raise exception 'Source limit exceeded'; end if;
 if (select count(distinct job->>'id') from jsonb_array_elements(p_jobs) job)<>count_jobs then raise exception 'Missing or duplicate job IDs'; end if;
 if exists(select 1 from jsonb_array_elements(p_jobs) job where
   job->>'sourceProvider' is distinct from source.provider or job->>'sourceBoard' is distinct from source.board
   or job->>'company' is distinct from source.company
   or not starts_with(coalesce(job->>'id',''),p_source_id||':')
   or coalesce(job->>'sourceUrl','') not like 'https://%'
   or length(coalesce(job->>'title',''))=0
   or not ((job->'sourceCountries') ?| array['IN','IND','India','india'] or coalesce(job->>'location','') ~* '\mIndia\M')
 ) then raise exception 'Job provenance validation failed'; end if;
 insert into public.skillup_jobs(id,source_id,payload,active,last_seen_at,closed_at)
 select job->>'id',p_source_id,job,true,now(),null from jsonb_array_elements(p_jobs) job
 on conflict(id) do update set payload=excluded.payload,active=true,last_seen_at=excluded.last_seen_at,closed_at=null
 where public.skillup_jobs.source_id=excluded.source_id;
 update public.skillup_jobs existing set active=false,closed_at=now()
 where existing.source_id=p_source_id and existing.active
 and not exists(select 1 from jsonb_array_elements(p_jobs) job where job->>'id'=existing.id);
 update public.skillup_job_runs set status='ok',finished_at=now(),job_count=count_jobs where id=p_run_id;
 update public.skillup_job_sources set last_status='ok',last_success_at=now(),last_count=count_jobs,last_error=null,lease_id=null,lease_until=null where id=p_source_id;
 return count_jobs;
end$$;
revoke all on function public.skillup_finish_refresh(text,uuid,jsonb,text) from public,anon,authenticated;
grant execute on function public.skillup_finish_refresh(text,uuid,jsonb,text) to service_role;

create function skillup_private.dispatch_job_refresh(p_failed_only boolean default false) returns integer
 language plpgsql security definer set search_path='' as $$
declare source_record record; token text; dispatched integer:=0;
begin
 select decrypted_secret into token from vault.decrypted_secrets where name='skillup_collector_token';
 if token is null then raise exception 'Collector credential missing'; end if;
 update public.skillup_job_runs run set status='failed',finished_at=now(),error='Collector timed out before completion'
 from public.skillup_job_sources source where source.lease_id=run.id and source.lease_until<now() and run.status='running';
 update public.skillup_job_sources set last_status='failed',last_error='Collector timed out before completion',lease_id=null,lease_until=null where lease_until<now();
 for source_record in select id from public.skillup_job_sources where enabled and (lease_until is null or lease_until<now()) and (not p_failed_only or last_status in ('failed','pending')) loop
  perform net.http_post(
   url:='https://ljbysmgzqohvlkcdctyj.supabase.co/functions/v1/skillup-jobs-refresh',
   headers:=jsonb_build_object('Content-Type','application/json','X-Skillup-Collector-Token',token),
   body:=jsonb_build_object('sourceId',source_record.id),timeout_milliseconds:=120000
  );
  dispatched:=dispatched+1;
 end loop;
 return dispatched;
end$$;
revoke all on function skillup_private.dispatch_job_refresh(boolean) from public,anon,authenticated,service_role;
-- Scheduler activation is applied separately, after a successful end-to-end run.
