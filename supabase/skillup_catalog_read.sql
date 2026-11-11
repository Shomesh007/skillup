-- One statement gives readers a consistent snapshot, beyond PostgREST's row-page cap.
create or replace function public.skillup_read_job_catalog() returns jsonb
 language sql stable security invoker set search_path='' as $$
select jsonb_build_object(
 'jobs',coalesce((select jsonb_agg(job.payload order by job.id) from public.skillup_jobs job where job.active and ((job.payload->'sourceCountries') ?| array['IN','IND','India','india'] or coalesce(job.payload->>'location','') ~* '\mIndia\M')),'[]'::jsonb),
 'sources',coalesce((select jsonb_agg(jsonb_build_object(
  'id',source.id,'company',source.company,'provider',source.provider,'board',source.board,
  'careersUrl',source.careers_url,'attemptedAt',source.last_attempt_at,'fetchedAt',source.last_success_at,
  'status',source.last_status,'count',source.last_count,'error',source.last_error,'coverage',source.coverage
 ) order by source.company) from public.skillup_job_sources source where source.enabled),'[]'::jsonb),
 'retrievedAt',now()
)$$;
revoke all on function public.skillup_read_job_catalog() from public;
grant execute on function public.skillup_read_job_catalog() to anon,authenticated,service_role;
