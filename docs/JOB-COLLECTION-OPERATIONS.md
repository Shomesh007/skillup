# India job collection

This is an operator reference. Collection logs, source counts, research coverage and scheduler details are not part of the public interface.

## Running service

The shared catalog is hosted in the existing **lotus-buzzer** Supabase project (`ljbysmgzqohvlkcdctyj`). Additive `skillup_*` tables and functions keep this data separate from Lotus. Existing Lotus tables, Auth settings, functions and scheduled tasks are unchanged.

Supabase Cron calls `skillup_private.dispatch_job_refresh(false)` at `30 1 * * *` UTC: **7:00 a.m. Asia/Kolkata**. A failed-source retry runs at `30 2 * * *`: **8:00 a.m. Asia/Kolkata**. These scheduled collectors use HTTP requests, HTML parsing and validation. They make no model calls and do not require an open Codex chat. Normal Supabase availability and usage limits still apply.

The Edge Function `skillup-jobs-refresh` checks a collector-only token held in Vault. It uses the server's service-role credential to call restricted refresh RPCs. No collector token or service-role credential belongs in frontend code. The checked-in project URL and publishable key are public browser configuration; RLS permits catalog reads only.

## Sources and boundaries

- Infosys: official India lateral and fresher search API, source IDs 1 and 21. Expired records are excluded.
- Accenture: official India search endpoint, latest 50 results per each of seven South Indian cities. This is a bounded window, not all Accenture vacancies.
- Wipro: official careers search, first 25 results per South Indian city, sorted by recent postings. This is also a bounded window.
- Appian and Capco: public Greenhouse boards; Poshmark: public Ashby board; ValGenesis: public Lever board with pagination; Zuora: official public careers HTML.
- TCS, HCLTech, Cognizant, Capgemini, Tech Mahindra and LTM: public LinkedIn search cards from the past week. Require both an exact employer name and an allowlisted company slug, an explicit India location and a recent source date. Only the public first page is collected. These are portal discovery listings, not complete employer inventories.

Collectors do not sign in, submit applications, use applicant data, solve challenges or bypass blocks. A blocked or unrecognizable response is a failed refresh, not evidence that the company has no vacancies. LinkedIn availability and markup can change.

All jobs require explicit India country metadata or an India location. The app starts with South India, including India-eligible remote roles; All India broadens the filter. Remote alone never establishes India eligibility. Experience, salary and work mode remain unspecified unless supplied by the source. Provider update dates are not presented as posting dates.

## Integrity and failure handling

Each source has a three-minute lease to prevent overlapping runs. Validate the full result before committing a source snapshot. Successful snapshots upsert matching IDs and retire entries absent from that source's current window. A retired entry may have left a bounded collection window; this does not prove the employer closed it. Failed refreshes retain the previous successful jobs and retrieval date. Saved applications and notes remain accessible after a listing leaves the current catalog.

The browser reads a single consistent catalog RPC, with periodic background reads while visible. A valid empty response is authoritative. On network failure, retain the previous catalog or use the small bundled India-only sample. Public pages show a short actionable notice rather than raw source failures or backend logs.

## Local verification and maintenance

```sh
npm run jobs:collect
npm run jobs:fallback
npm run jobs:verify
npm test
npm run typecheck
npm run build
```

`jobs:collect` updates the versioned local snapshot; it does not deploy the frontend or write to the hosted database. Failed local sources preserve their earlier successful records and make the command fail visibly. Keep source registry IDs consistent between code and `skillup_job_sources` when enabling a new source.

Run `node --import tsx scripts/package-collector.ts` to package the shared collectors for deployment. Deploy with entrypoint `index.ts`, import map `deno.json` and `verify_jwt: false`; custom token validation inside the function is required. The import map pins linkedom. Apply the SQL setup only to a new Skillup namespace; the initial schema file is not an idempotent upgrade migration. Do not rerun it against the existing live tables.

Operators can inspect `skillup_job_sources` and `skillup_job_runs` in Supabase. Only an authorized database operator should call the private dispatch function. Verify unauthorized refresh requests return 401, anonymous writes and refresh RPC execution are denied, and every returned job passes the India filter.
