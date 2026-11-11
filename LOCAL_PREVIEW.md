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

The user selected Supabase lotus-buzzer (ljbysmgzqohvlkcdctyj). Its existing Lotus data was inspected read-only. Skillup cloud auth and persistence are not connected, and no remote table or Auth setting was changed. See database/skillup-backend-plan.md for the additive namespace plan.

The optional existing-account adapter reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Provider and service-role secrets must never use a VITE_ prefix or enter client code. Live career chat requires a server endpoint in VITE_CAREER_CHAT_URL accepting POST {messages:[{role,content}]} and returning {reply:string}. No endpoint is configured. Coaching calendars/bookings and verified testimonial submissions do not exist.

## Verification

- npm run typecheck passed.
- npm run build passed. A large lazy job-data chunk warning remains; the job data is bundled reference content.
- Browser checks covered role matching/comparison, review findings, grouped source entries, saved jobs/status handoff, application notes, resume editing/undo/clipboard/download, interview timer/review, project completion/evidence and experience-to-resume transfer.
- The actual downloaded sample resume was inspected and contains the entered content.
- Browser OS Print/Save as PDF and live external account/AI/booking services were not end-to-end tested.

Visual guidance researched: https://github.com/pbakaus/impeccable and https://github.com/LeoStehlik/no-slop-ui . Their design references informed the work; no external slop-detector certification is claimed.
