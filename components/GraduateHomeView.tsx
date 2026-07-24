import React from 'react';
import { GraduateSetupProfile } from './GraduateSetupView';
import DecisionCoachCard from './DecisionCoachCard';

interface Props {
  profile: GraduateSetupProfile | null;
  onOpenRoleTargeter: () => void;
  onOpenShortlistFixer: () => void;
  onOpenJobs: () => void;
  onOpenResume: () => void;
  onOpenInterview: () => void;
  onOpenCoaching: () => void;
  onChangeProfile: () => void;
}

const labels = {
  situation: {
    recent: 'Recently graduated',
    active: 'Actively applying',
    gap: 'Have a gap',
    experience: 'Have internship/projects',
  },
  target: {
    developer: 'Developer roles',
    testing: 'Testing / QA roles',
    data: 'Data / AI roles',
    cloud: 'Cloud / DevOps roles',
    support: 'Support / Analyst roles',
    unsure: 'Not sure yet',
  },
  readiness: {
    resume: 'Need resume first',
    skills: 'Need skills/projects',
    jobs: 'Need job openings',
    prep: 'Need interview prep',
    'no-calls': 'Applying but no calls',
  },
};

const getLabel = (map: Record<string, string>, key?: string) => (key && map[key]) || 'Not selected';

const GraduateHomeView: React.FC<Props> = ({ profile, onOpenRoleTargeter, onOpenShortlistFixer, onOpenJobs, onOpenResume, onOpenInterview, onOpenCoaching, onChangeProfile }) => {
  const situation = getLabel(labels.situation, profile?.situation);
  const target = getLabel(labels.target, profile?.target);
  const readiness = getLabel(labels.readiness, profile?.readiness);

  const actions = [
    { label: 'Role Targeter', title: 'Find my target role', desc: 'Pick realistic fresher roles and avoid random applications.', icon: 'adjust', action: onOpenRoleTargeter, accent: 'text-neon-amber', border: 'border-neon-amber/35', tag: 'Focus' },
    { label: 'Shortlist Fixer', title: 'Fix shortlist chances', desc: 'Diagnose resume, projects, keywords, LinkedIn, and application mistakes.', icon: 'fact_check', action: onOpenShortlistFixer, accent: 'text-neon-green', border: 'border-neon-green/35', tag: readiness },
    { label: 'Apply Today', title: 'Find matching jobs', desc: 'Browse fresher and entry-level jobs with clean role titles.', icon: 'search', action: onOpenJobs, accent: 'text-neon-cyan', border: 'border-neon-cyan/35', tag: 'Openings' },
    { label: 'Interview Path', title: 'Prepare interviews', desc: 'Practice aptitude, HR, technical basics, and role-specific rounds.', icon: 'terminal', action: onOpenInterview, accent: 'text-cyan-300', border: 'border-cyan-300/35', tag: 'Prep' },
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-6 pt-4 pb-32 lg:p-8 lg:pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-neon-amber/20 bg-[linear-gradient(145deg,rgba(255,170,0,0.12),rgba(10,16,31,0.9)_45%,rgba(0,240,255,0.08))] p-5 shadow-2xl shadow-black/30 lg:p-8">
        <div className="absolute right-[-4rem] top-[-4rem] h-56 w-56 rounded-full bg-neon-amber/10 blur-3xl"></div>
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-amber/20 bg-black/25 px-3 py-1.5">
              <span className="material-symbols-outlined text-sm text-neon-amber">workspace_premium</span>
              <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-amber">Graduate job cockpit</span>
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-[0.95] text-white lg:text-6xl">Apply with a target, not panic.</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">Choose a realistic fresher role, fix shortlisting blockers, apply consistently, and prepare for the rounds that actually happen.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-gray-500">Current job map</span>
              <button onClick={onChangeProfile} className="text-[10px] font-mono uppercase tracking-widest text-neon-amber hover:text-white">Edit</button>
            </div>
            <div className="space-y-3">
              <MapRow icon="person_search" label="Status" value={situation} />
              <MapRow icon="adjust" label="Target" value={target} />
              <MapRow icon="bolt" label="Need" value={readiness} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <DecisionCoachCard
          accent="amber"
          eyebrow="Need a job-search sanity check?"
          desc="Book a 1-on-1 session to choose a target role, fix shortlisting blockers, and decide what to apply for first."
          onOpenCoaching={onOpenCoaching}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-neon-green/20 bg-neon-green/10 p-5">
          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-neon-green shadow-[0_0_10px_rgba(10,255,0,1)]"></span>
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-neon-green">Best next move</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Fix the shortlist gap first.</h2>
            <p className="mt-3 text-xs font-mono leading-relaxed text-gray-400">If calls are low, applying more is not enough. Check targeting, resume proof, keywords, and project strength.</p>
            <button onClick={onOpenShortlistFixer} className="mt-5 inline-flex items-center gap-2 rounded-full border border-neon-green/30 bg-black/20 px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-neon-green transition-colors hover:bg-neon-green/10">
              Run diagnosis
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-[0.18em] text-white">Graduate flow</h2>
            <span className="text-[10px] font-mono text-gray-500">Target {'>'} Fix {'>'} Apply {'>'} Prep</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['Role', 'Profile', 'Jobs', 'Rounds'].map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                <span className="mb-3 block font-mono text-[10px] text-neon-amber">0{index + 1}</span>
                <span className="block text-[10px] font-semibold leading-tight text-white lg:text-xs">{step}</span>
              </div>
            ))}
          </div>
          <button onClick={onOpenResume} className="mt-4 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-left transition-colors hover:border-neon-amber/30 hover:bg-neon-amber/10">
            <span>
              <span className="block text-sm font-bold text-white">Resume is the first filter</span>
              <span className="block text-[10px] font-mono text-gray-500">Improve it before scaling applications.</span>
            </span>
            <span className="material-symbols-outlined text-neon-amber">badge</span>
          </button>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-neon-amber/40 to-transparent"></span>
          <h2 className="text-[10px] font-mono uppercase tracking-[0.28em] text-gray-400">Choose your next move</h2>
          <span className="h-px flex-1 bg-gradient-to-l from-neon-amber/40 to-transparent"></span>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {actions.map((item) => (
            <button key={item.label} onClick={item.action} className={`group min-h-52 overflow-hidden rounded-[1.75rem] border ${item.border} bg-black/25 p-5 text-left transition-all hover:-translate-y-1 hover:bg-white/[0.05] active:scale-[0.98]`}>
              <div className="mb-5 flex items-start justify-between">
                <span className={`material-symbols-outlined text-4xl ${item.accent}`}>{item.icon}</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-gray-500">{item.tag}</span>
              </div>
              <div className={`mb-2 text-[10px] font-mono uppercase tracking-[0.24em] ${item.accent}`}>{item.label}</div>
              <h3 className="text-xl font-bold leading-tight text-white">{item.title}</h3>
              <p className="mt-3 text-xs font-mono leading-relaxed text-gray-500">{item.desc}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

const MapRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-3">
    <span className="material-symbols-outlined text-xl text-neon-amber">{icon}</span>
    <span className="min-w-0">
      <span className="block text-[9px] font-mono uppercase tracking-widest text-gray-500">{label}</span>
      <span className="block truncate text-sm font-semibold text-white">{value}</span>
    </span>
  </div>
);

export default GraduateHomeView;
