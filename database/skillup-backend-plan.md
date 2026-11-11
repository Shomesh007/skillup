# Skillup functional rework

Backend target selected by the user: Supabase `lotus-buzzer`, project reference `ljbysmgzqohvlkcdctyj`.

## Inspection

The project is active and healthy. Its public schema already contains Lotus memberships and profiles with row-level security enabled. No remote schema or application data was changed during this inspection.

## Isolation

Use new `public.skillup_*` tables for Skillup-owned records. Do not repurpose `public.profiles`, Lotus memberships, or the existing Lotus schemas. Shared Supabase Auth identities should be referenced by user ID; Skillup authorization must use explicit ownership checks, not user-editable metadata or the mere presence of a JWT.

## Foundation backlog

1. Complete account flows: registration, sign-in, password recovery, sign-out and session restoration.
2. Add Skillup profiles/workspaces with owner-only row-level security and cloud persistence.
3. Persist resume documents, interview answers, bookmarks, plans/tasks and application records as user-owned data.
4. Move reference content behind a coherent data service and record content provenance/freshness.
5. Add server-side AI integration, verified story moderation and coaching booking workflows after the core records and access model work.

Every remote change must be additive within the Skillup namespace, checked against the existing schema, and verified before the related UI is described as a working live feature.

Current feature audit and implementation gaps are recorded in the task output `FEATURE-AUDIT-AND-REWORK.txt`.
