-- Supabase pg_cron uses UTC/GMT. India is UTC+05:30 year-round.
-- These names belong only to Skillup; existing Lotus schedules remain untouched.
select cron.schedule('skillup-jobs-daily','30 1 * * *',
 $$select skillup_private.dispatch_job_refresh(false);$$);
select cron.schedule('skillup-jobs-retry-failed','30 2 * * *',
 $$select skillup_private.dispatch_job_refresh(true);$$);
