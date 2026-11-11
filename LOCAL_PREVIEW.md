# Current Skillup development preview

Run `npm ci`, then `npm run dev`. Open http://localhost:3000. No push or production deployment was performed.

## Current interface

The public pages retain the custom blue career artwork. Internal pages use compact task workspaces with explicit inputs, source context and saved results. `workspace.css` owns the workbench system; `PRODUCT.md` and `DESIGN.md` record the product and visual direction. Icons are inline SVGs and do not depend on an external icon font.

## Working on this device

- Three onboarding paths and a saved overview.
- A 76-role reference catalog with entered-skill matching, two-role comparison, learning routes and a saved target.
- Project plans with capacity-based week allocation, start dates, task completion and evidence notes.
- Resume/job text review with seven visible, rule-based checks, evidence and a revision checklist. It is not an ATS or hiring prediction.
- Experience drafting from the user's actual action, scope, tools and outcome; add the result to resume experience.
- Full resume contact, summary, experience, projects, education and skills editing; preview, remove/undo, clipboard, text download and browser Print/Save as PDF.
- Job filters, saved roles and manual application tracking. The 401 imported records form 196 groups; original source entries remain selectable.
- Per-application preparation checklists, notes, editable outreach and shared status.
- Interview drafts, timer, frameworks and self-review.
- Company search and bookmarks, preparation examples, saved guidance notes and coaching briefs.

State is saved in this browser's local storage, not in a user-owned cloud account. Clearing browser data removes it. Bundled listings, company details, learning routes and authored examples are reference material.

## Responsive behavior

Phone navigation wraps instead of hiding sections in horizontal strips. Browser checks covered 17 route families at 320, 360, 390, 768, 901 and 1024px, plus earlier 390px checks of all 21 reachable route types. Populated 320px resume previews also wrap long titles, contact details and dates. These checks inspect rendered component bounds and hidden horizontal panels as well as document width.

## Integration limits

The user selected Supabase lotus-buzzer (ljbysmgzqohvlkcdctyj). An additive Skillup job catalog is now live, with scheduled deterministic collectors and anonymous read-only catalog access. Existing Lotus tables and Auth settings remain unchanged. Personal workspace drafts still live on the device. See docs/JOB-COLLECTION-OPERATIONS.md for the deployed job service.

The optional existing-account adapter reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Provider and service-role secrets must never use a VITE_ prefix or enter client code. Live career chat requires a server endpoint in VITE_CAREER_CHAT_URL accepting POST {messages:[{role,content}]} and returning {reply:string}. No endpoint is configured. Coaching calendars/bookings and verified testimonial submissions do not exist.

## Verification

- npm run typecheck passed.
- npm run build passed. A large lazy job-data chunk warning remains; the job data is bundled reference content.
- Browser checks covered role matching/comparison, review findings, grouped source entries, saved jobs/status handoff, application notes, resume editing/undo/clipboard/download, interview timer/review, project completion/evidence and experience-to-resume transfer.
- The actual downloaded sample resume was inspected and contains the entered content.
- Browser OS Print/Save as PDF and live external account/AI/booking services were not end-to-end tested.

Visual guidance researched: https://github.com/pbakaus/impeccable and https://github.com/LeoStehlik/no-slop-ui . Their design references informed the work; no external slop-detector certification is claimed.

## November 11 functional upgrade

See docs/FEATURE-RESEARCH.md for the source-backed matrix covering all 19 product modules and the remaining implementation sequence.

Onboarding now routes directly to the selected task and carries role-family or project-track defaults. The same resolver drives overview suggestions. Job searches and role-family filters retain user edits.

Resume studio supports a master and independent named versions, validated JSON imports/backups, section and entry ordering, font/density options, content checks, job skill-term comparison, a plain-text reading-order inspector, text export, real editable DOCX export and browser Print/PDF. Word and text exports use the same ordered content model. Imported backups create a separate copy. Drafts still live on this device.

Interview practice adds editable next-review dates and a Review due filter. The three-day default is an adjustable reminder, not a claim about optimal learning.

Run npm test for the domain regression suite, npm run typecheck, and npm run build. Twelve tests cover routing, aliases and boundaries, empty entries, section order, backup validation, evidence checks and actual Word OOXML content. Compatible dependency updates resolved the 18 npm advisories reported during this work; npm audit then reported zero. This is not a security certification. The large lazy imported job-data chunk remains a build warning.

Resume persistence now reports rejected storage writes, offers retry/backup recovery, protects unsaved version switches, and avoids marking an incomplete version as saved. The test suite includes metadata-write rollback. GitHub checks run tests, typecheck and production build on main pushes and pull requests.

Failed writes remain in an app-level recovery cache across internal navigation, with an always-mounted warning/export option and close/reload protection. Returning to a tool restores its unsaved draft; successful retry clears its recovery entry.

## Public interface cleanup and current mobile verification

Removed collection schedules, retrieval logs, backend connection labels, research coverage filters, research audit records and review dates from public pages. Company profiles retain source-backed FAQs and application links. Guidance and coaching focus on next actions. Draft storage and feature limitations remain clear. Selecting a mobile job closes its filters.

Rendered checks on 11 workspace pages at 390px, 12 workspace pages at 768px, and narrow 320px checks across the workspace, account, onboarding, student and career-switcher routes found no document overflow or clipped main content. Expanded TCS FAQs, job filtering/search/details, resume preview and workspace tabs, and goal-to-resume onboarding were exercised. All 28 domain tests, type checking and production build passed. External applications and the browser print dialog were not submitted during this pass.
