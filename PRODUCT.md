# Skillup product context

A career-planning and job-preparation app for Indian students, graduates seeking their first job, and people changing careers. The user rejected the previous internal UI as basic, text-heavy, repetitive and generic. The landing page establishes a cool-white/electric-blue/coral identity with authored 3D career artwork; internal tools should operate as precise workspaces rather than repeating the landing-page format.

Primary outcomes: choose a target role using actual skills; build a practical plan; review an application against evidence; create a complete resume; practise answers; find and save distinct opportunities. Avoid claiming AI analysis, live hiring data, verified outcomes, or cloud persistence when the underlying service is absent.

Backend selected: existing lotus-buzzer Supabase project. It contains an unrelated live Lotus app; Skillup records must use isolated skillup-prefixed tables and owner-only access. No existing Lotus tables or auth configuration may be casually replaced.

Local preview at http://localhost:3000, React + TypeScript + Vite. All three career paths remain supported. Desktop and narrow mobile layouts must be verified. No source, project data, credentials or history cleanup without approval.
