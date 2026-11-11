# Skillup feature research and implementation roadmap

Researched 11 November 2026. This is a product/engineering synthesis, not evidence that every proposed service is already connected. Status labels distinguish shipped local functionality from the next implementation. The original 19-module count is retained so the work can be compared with the first audit.

## Product finding

All 19 modules can have a useful deterministic core. The main missing capability is a connected workflow: a goal should select a tool; selected roles should supply requirements; evidence should inform a plan and resume; each application should preserve its own preparation and document version. A language model is optional for explanation and phrasing. It cannot supply missing job freshness, evidence, authentication, coaching availability or verified outcomes.

The shared model should connect Profile → Journey → Skill evidence → Project plan → Resume version → Application → Interview practice → Outcome. Use stable IDs, explicit dates, source provenance, explainable rules, typed state and regression tests. Avoid opaque “career fit” or “ATS pass” percentages.

## Feature-by-feature decisions

| # | Feature | Useful core without AI | Research-informed next improvement and acceptance evidence | This change |
|---|---|---|---|---|
| 1 | Onboarding | Explicit goal routing and selected-field defaults | Every exposed goal has a destination; changing goals preserves existing work. Show what was selected and why the destination fits. [S1] | Implemented shared routing for all three paths; jobs/skills/resume/interview go to distinct tools. Added student skills/jobs/resume choices and a switcher job-search choice. |
| 2 | Overview | Derive next action from goal, incomplete work and dates | One source of truth for the next action; report actual tasks/drafts/applications, never decorative progress. | Next-action routing now uses the same journey resolver as onboarding. Existing saved progress remains. Due-date agenda is next. |
| 3 | Resume studio | Structured content, variants, stable ordering, completeness rules, exports | Tailor factual evidence to a role; keep a legible reading order. Check missing fields and placeholders; preserve master and previous versions. No universal ATS score. [S2–S4] | Added independent versions, backup import/export, section and entry ordering, font/density controls, content review, skill coverage, reading-order inspection and editable DOCX export. |
| 4 | Interview practice | Question selection, timers, STAR scaffolds, explicit self-review, spaced revisit queue | Let users retrieve an answer before reading notes; collect their own examples and follow-up questions. Spacing is useful; no specific interval is universally optimal. [S5,S6] | Added editable next-review dates and Review due filter. Existing timer, drafts and manual self-review remain. Three days is an adjustable default, not an optimized prediction. |
| 5 | Application workspace | Per-opening checklist, notes, outreach draft, manual status | Keep the source, selected resume version, application date and next action together. Export a user-readable history. [S7] | Existing role-scoped workspace remains; application-to-version association and follow-up history are next. |
| 6 | Role library | Canonical skills, explicit alternatives/conjunctions, filters and comparison | Separate interest, exposure, independent skill and evidence. Missing evidence is unknown, not incompetence. O*NET is a structured reference, not an Indian salary source. [S8] | Added shared skill aliases and robust token boundaries. HTML/CSS now requires both; framework slash groups remain alternatives. Evidence levels are next. |
| 7 | Student explorer | Role exploration with low-cost trials | Offer small representative work samples before a large learning commitment. Use occupational tasks, not invented personality labels. [S8,S9] | Onboarding now supplies the selected role family. Curated role-specific trial rubrics are next. |
| 8 | Project plan | Capacity-based schedule, task dependencies, completion and evidence | Calculate effort from explicit task estimates; show spillover and missed-date rescheduling. Assess work against a rubric rather than awarding competence for checking a box. [S9] | Selected field now opens the right plan, including a new cloud/DevOps plan. Existing completion/evidence is preserved. Dependency-aware rescheduling is next. |
| 9 | Graduate role targeter | Requirement coverage and constraints | Let users weight location, experience, work type and tools. Explain both matches and exclusions. No hiring likelihood from a tool count. [S8] | Uses shared alias matching and onboarding role family. Weighted constraints/evidence are next. |
| 10 | Shortlist review | Parse explicit requirements, link resume evidence, count funnel events | Check supported patterns and manual requirements, show unmatched text, and distinguish missing evidence from missing skill. Rates must use actual cohorts and dates; correlation cannot identify why calls stopped. [S2–S4,S7] | Existing seven-rule review remains; new shared matching is used in the resume studio. A unified evidence/requirement table should replace the separate limited dictionaries. |
| 11 | Switch plan | Compare existing evidence with target requirements | Preserve actual prior titles. Identify transferable tasks and a realistic bridge project, with time/financial constraints entered by the user. [S8,S9] | Onboarding now selects translation, practice, project plan or job search by blocker; field context is preserved. Constraint budgeting is next. |
| 12 | Experience draft | Action + scope + tools + outcome assembled from user facts | Use actual contributions and supported results. Track which evidence supports each bullet and which job requirement it addresses. [S2,S5] | Existing structured draft/transfer remains. Version-aware transfer and evidence links are next; a model may suggest phrasing only. |
| 13 | Company directory | Search, compare, bookmark, source records | Store canonical company identity, official career URL and field-level source timestamps. Never infer hiring from a company's presence. [S7,S10] | Existing reference directory remains. Canonical IDs, source timestamps and official-feed onboarding are next. |
| 14 | Company profile | Source-backed facts and preparation links | Distinguish company-wide information from team/opening requirements. Store time and provenance; unknown compensation stays unknown. [S7,S10] | Existing profiles explicitly label reference content. Field-level provenance and opening-specific preparation are next. |
| 15 | Job board | Structured filtering, source IDs, deduplication, manual pipeline | Use official published feeds where available, retain original IDs and closed/expired state, and record fetched_at separately from posted_at. Similar titles do not prove identical openings. [S10–S12] | Selected-field query now initializes on job-search onboarding. Existing 401-record/196-group snapshot and source variants remain; it is not a live feed. |
| 16 | Career guidance | A decision tree, saved reflection and links to relevant tools | Route an explicit task into the right workflow and preserve entered context. Optional free-text assistance should propose an intent and let the user confirm it; no invented answers. [S1,S8] | Existing saved guidance remains. Shared journey resolver is the foundation; full guided decision trees are next. |
| 17 | Coaching | Intake, availability rules, timezones, bookings and cancellation state | A real coach roster/calendar is an operational integration. A checklist cannot stand in for booked availability. OAuth/server credentials and idempotent booking updates are required. [S13] | Local preparation brief only. Real calendar, coach administration and booking workflow remain unconnected. |
| 18 | Preparation examples / stories | Curated scenarios; consent, evidence and moderation for testimonials | Label authored examples clearly. Verification needs source evidence and human review; never synthesize salary or hire-rate claims. | Existing examples remain explicitly authored; no invented outcome metrics. Real submission, consent and moderation are next. |
| 19 | Accounts and persistence | Auth/session lifecycle, ownership, revision conflicts, export and recovery | Isolate Skillup from Lotus data, enforce owner-only RLS and explicit shared-device behavior. Sensitive drafts need an intentional storage/retention model. [S14,S15] | Guest local storage remains. lotus-buzzer is selected, not connected; no remote migrations or Auth settings changed. |

## Deterministic engines to build once

1. **Journey resolver** — inputs: career level, goal, role family, constraints. Outputs: destination, reason, initial filters/track. A single resolver drives onboarding and overview. Implemented and tested.
2. **Skill normalizer** — aliases map to canonical terms; boundary-aware extraction separates Java/JavaScript and C#/C++. Requirements declare alternatives vs conjunctions. Implemented for role matching and resume coverage; migrate the older shortlist dictionary next.
3. **Evidence graph** — requirement IDs link to user-owned project/work artifacts and supporting passages. Support states: absent, claimed, evidenced, reviewed. A checkbox does not imply verified competence. Next.
4. **Schedule engine** — weekly capacity, unavailable dates, task dependencies, estimated hours, completion and remaining work. Derive dates, detect overload and permit rescheduling without losing evidence. Current planner is a starting point; dependency-aware scheduling is next.
5. **Resume model/export** — one versioned data model produces preview, plain text and DOCX in the same section/entry order. JSON imports validate shape and create a separate copy. Implemented and tested.
6. **Application state machine** — stable source opening ID, version_id, status history, applied_at, next_action_at, source URL and notes. Grouped duplicate-looking records remain separate source IDs. Next.
7. **Practice scheduler** — explicit review dates, attempt history and self-assessed clarity. Calculate due items, not “interview success probability.” Editable dates/due queue implemented; attempt-history UI is next.

No algorithm should silently add missing resume skills, change a previous title, invent an achievement, or claim current job availability from an import.

## Delivery sequence and acceptance gates

### Delivered in this change
- Push the previous verified redesign to original upstream main.
- Correct goal-to-tool routing and field-specific defaults; carry the goal into the destination.
- Upgrade the resume workflow and actual document export; preserve master isolation.
- Shared skill token/alias logic, cloud project track, practice revisit queue.
- Add regression tests for routing, matching, resume validation/order and actual DOCX content.
- Apply compatible dependency updates; npm's audit report changed from 18 reported vulnerabilities to zero. This is an audit result, not a security certification.

### Next foundation: cloud and durable records
Use additive `skillup_*` tables in lotus-buzzer, never replace Lotus memberships/profiles. Add account/session/recovery flows and owner-only access; test user A cannot read or update user B. Define local-to-cloud migration explicitly and prevent one signed-in account from inheriting another person's shared-device drafts. Add revision/conflict handling and exports before calling sync complete. No AI is required.

### Next career/job workflow
Normalize source content; add evidence levels and editable hard constraints; implement a source-ID job importer with last-fetched/closed state; connect application status/history/follow-ups to resume versions. Use provider APIs for selected company boards. NCS is relevant to India but this research does not establish permission or API availability for bulk importing its records.

### Next content/live operations
Add coach roster/calendar integration, safe booking retries/cancellations, and story submissions with consent and moderation. Live conversational assistance can come after the deterministic workflows are reliable; keep suggestions separate from persisted facts and actions.

## Measurement and tests

Measure time to first useful artifact (saved target, project evidence, complete resume or tracked application), goal-to-tool completion, draft recovery and real repeat use. Do not optimize for card clicks or a fabricated score. Compare onboarding goals in separate cohorts and count only observed events. Test storage failures, malformed imports, switching variants, long content, source-ID duplicates, empty source fields, timezone boundaries, permission isolation and 320px navigation. Ensure DOCX/PDF/TXT order matches the actual editor. A PDF-render review is still needed for the browser Print/Save-as-PDF flow.

## Sources and limits

[S1] Nielsen Norman Group, contextual help/onboarding: https://www.nngroup.com/articles/onboarding-tutorials/ . Supports task-relevant, progressively disclosed help. The specific routing model is our product design inference.

[S2] Harvard Mignone Center, resume guide: https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/ . Search-indexed primary-source material advises tailoring, factual language and action verbs; direct fetch was rate-limited. Its sample guidance is also available at https://cdn-careerservices.fas.harvard.edu/wp-content/uploads/sites/161/2025/09/HES-Resume-samples-combined.pdf . Do not copy sample candidates into the app.

[S3] Greenhouse, unsuccessful resume parsing: https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse . Describes parser/formatting failures; it does not establish a universal ATS algorithm or pass score.

[S4] docx official Packer API: https://docx.js.org/api/classes/index.Packer.html . Documents browser Blob export for actual OOXML files.

[S5] UK National Careers Service, STAR: https://nationalcareers.service.gov.uk/careers-advice/interview-advice/the-star-method . Supports structuring actual examples with context, responsibility, action and outcome/learning.

[S6] Carpenter, Pan & Butler (2022), spacing/retrieval review: https://www.nature.com/articles/s44159-022-00089-1 . Supports spaced practice as a learning strategy; our three-day default is a transparent product choice, not a result derived from this paper.

[S7] Stanford Career Education, job-search action plan: https://careered.stanford.edu/sites/g/files/sbiybj22801/files/media/file/job_search_action_plan_handout.pdf . Planning reference; pipeline structure is an implementation proposal.

[S8] O*NET database and official API: https://www.onetcenter.org/database.html and https://services.onetcenter.org/ . Structured occupational data and skill requirements; US-specific content requires adaptation and provenance before Indian market use. No credentials or imported dataset were provisioned in this work.

[S9] Skills England, software developer occupational standard: https://skillsengland.education.gov.uk/occupations/OCC0116-v1-1?view=qualifications . A reference for observable work/knowledge/skills; not an accreditation claim for our plans.

[S10] Google Search Central, job-posting data: https://developers.google.com/search/docs/appearance/structured-data/job-posting . Useful structured fields/expiry guidance; it is not a job-feed license or a requirement that this private workspace publish schema markup.

[S11] Greenhouse Job Board API: https://docs.greenhouse.io/job-board.html . Published-job GET data and provider identifiers; selecting and configuring company boards remains future work.

[S12] Lever official Postings API: https://github.com/lever/postings-api . Another provider integration option, not a service already connected here.

[S13] Cal.com API v2: https://cal.com/docs/api-reference/v2/introduction . Booking infrastructure reference. Secrets belong on a server; no booking integration was installed.

[S14] Supabase row security: https://supabase.com/docs/guides/database/postgres/row-level-security . Owner authorization and lifecycle tests are still required for the selected backend.

[S15] OWASP HTML5 security guidance: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html . Browser storage must not be mistaken for a confidential cloud account; client-side injection can expose local data.

India-specific source reviewed: National Career Service https://ncs.gov.in/ provides job search, career and counselling resources. This is a source/reference option, not a statement that Skillup is affiliated with NCS.

Final finish-review correction: resume save failures are now explicit, with retry/backup recovery and protection against switching away from an unsaved variant. Version creation rolls back a newly written document if its library metadata cannot be persisted. Twelve domain tests include blocked-storage and rollback cases. GitHub CI runs tests, typecheck and build.

Failed writes now also survive internal tool navigation in a tab-level recovery cache. A global recovery notice remains mounted on public and workspace routes, offers a recovery export, and warns before closing/reloading while unsaved work remains. A regression test covers remount recovery.
