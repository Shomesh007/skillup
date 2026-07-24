import React from 'react';
import { StudentSetupProfile } from './StudentSetupView';

interface Props {
  profile: StudentSetupProfile | null;
  onOpenRoleExplorer: () => void;
  onOpenTrackBuilder: () => void;
  onOpenJobs: () => void;
  onOpenResume: () => void;
  onOpenInterview: () => void;
  onChangeProfile: () => void;
}

const labelMaps = {
  stage: {
    'first-year': '1st / 2nd Year',
    'pre-final': 'Pre-final Year',
    'final-year': 'Final Year',
  },
  goal: {
    explore: 'Explore IT Roles',
    internship: 'Get Internship Ready',
    placement: 'Crack Placements',
  },
  interest: {
    software: 'Software Development',
    testing: 'Testing and QA',
    data: 'Data and AI',
    infra: 'Cloud and Security',
  },
};

const getLabel = (map: Record<string, string>, key?: string) => (key && map[key]) || 'Not selected';

const StudentHomeView: React.FC<Props> = ({
  profile,
  onOpenRoleExplorer,
  onOpenTrackBuilder,
  onOpenJobs,
  onOpenResume,
  onOpenInterview,
  onChangeProfile,
}) => {
  const stage = getLabel(labelMaps.stage, profile?.stage);
  const goal = getLabel(labelMaps.goal, profile?.goal);
  const interest = getLabel(labelMaps.interest, profile?.interest);

  const missions = [
    {
      label: 'Career Explorer',
      title: 'Explore IT careers',
      desc: 'Understand exact job titles, role families, skills, tools, projects, and internship keywords.',
      icon: 'account_tree',
      action: onOpenRoleExplorer,
      accent: 'text-neon-cyan',
      border: 'border-neon-cyan/35',
      tag: 'Start here',
    },
    {
      label: 'Build Sprint',
      title: 'Build my first track',
      desc: 'Choose one path and get a practical project, weekly plan, tools, and resume proof.',
      icon: 'route',
      action: onOpenTrackBuilder,
      accent: 'text-neon-green',
      border: 'border-neon-green/35',
      tag: interest,
    },
    {
      label: 'Internship Radar',
      title: 'Find student-friendly jobs',
      desc: 'Browse openings and internships while keeping every title clean and correctly distinguished.',
      icon: 'radar',
      action: onOpenJobs,
      accent: 'text-neon-amber',
      border: 'border-neon-amber/35',
      tag: 'Open roles',
    },
    {
      label: 'Resume Starter',
      title: 'Create proof, not filler',
      desc: 'Use resume templates that help students show projects, skills, achievements, and internships.',
      icon: 'badge',
      action: onOpenResume,
      accent: 'text-cyan-300',
      border: 'border-cyan-300/35',
      tag: 'ATS ready',
    },
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-6 pt-4 pb-32 lg:p-8 lg:pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(0,240,255,0.11),rgba(10,16,31,0.86)_42%,rgba(19,91,236,0.16))] p-5 shadow-2xl shadow-black/30 lg:p-8">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:42px_42px]"></div>
        <div className="absolute right-4 top-4 h-28 w-28 rounded-full border border-neon-cyan/20"></div>
        <div className="absolute right-12 top-12 h-12 w-12 rounded-full bg-neon-cyan/10 blur-xl"></div>

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-cyan/20 bg-black/25 px-3 py-1.5">
              <span className="material-symbols-outlined text-sm text-neon-cyan">school</span>
              <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-cyan">Student workspace</span>
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-[0.95] text-white lg:text-6xl">
              Your career starts before the job search.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
              We will help you choose a clear IT direction, build proof through projects, prepare for internships, and understand exact job titles without making everything generic.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-gray-500">Current student map</span>
              <button onClick={onChangeProfile} className="text-[10px] font-mono uppercase tracking-widest text-neon-cyan hover:text-white">
                Edit
              </button>
            </div>
            <div className="space-y-3">
              <MapRow icon="event_note" label="Stage" value={stage} />
              <MapRow icon="flag" label="Goal" value={goal} />
              <MapRow icon="hub" label="Direction" value={interest} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-neon-green/20 bg-neon-green/10 p-5">
          <div className="absolute right-[-3rem] top-[-3rem] h-32 w-32 rounded-full bg-neon-green/10 blur-2xl"></div>
          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-neon-green shadow-[0_0_10px_rgba(10,255,0,1)]"></span>
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-neon-green">This week</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Build one visible proof.</h2>
            <p className="mt-3 text-xs font-mono leading-relaxed text-gray-400">
              Pick a role direction, create one small project, and connect it to a resume bullet. That is the fastest way to stop feeling lost.
            </p>
            <button
              onClick={onOpenTrackBuilder}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-neon-green/30 bg-black/20 px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-neon-green transition-colors hover:bg-neon-green/10"
            >
              Choose track
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-[0.18em] text-white">Student flow</h2>
            <span className="text-[10px] font-mono text-gray-500">Explore {'>'} Build {'>'} Apply {'>'} Prep</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['Explore titles', 'Build project', 'Fix resume', 'Practice'].map((step, index) => (
              <div key={step} className="relative rounded-2xl border border-white/10 bg-black/25 p-3">
                <span className="mb-3 block font-mono text-[10px] text-neon-cyan">0{index + 1}</span>
                <span className="block text-[10px] font-semibold leading-tight text-white lg:text-xs">{step}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onOpenInterview}
            className="mt-4 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-left transition-colors hover:border-neon-cyan/30 hover:bg-neon-cyan/10"
          >
            <span>
              <span className="block text-sm font-bold text-white">Practice early, not at the end</span>
              <span className="block text-[10px] font-mono text-gray-500">Interview prep can start after your first track choice.</span>
            </span>
            <span className="material-symbols-outlined text-neon-cyan">terminal</span>
          </button>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-neon-cyan/40 to-transparent"></span>
          <h2 className="text-[10px] font-mono uppercase tracking-[0.28em] text-gray-400">Choose your next move</h2>
          <span className="h-px flex-1 bg-gradient-to-l from-neon-cyan/40 to-transparent"></span>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {missions.map((mission) => (
            <button
              key={mission.label}
              onClick={mission.action}
              className={`group min-h-56 overflow-hidden rounded-[1.75rem] border ${mission.border} bg-black/25 p-5 text-left transition-all hover:-translate-y-1 hover:bg-white/[0.05] active:scale-[0.98]`}
            >
              <div className="mb-6 flex items-start justify-between">
                <span className={`material-symbols-outlined text-4xl ${mission.accent} transition-transform group-hover:-rotate-6`}>
                  {mission.icon}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-gray-500">
                  {mission.tag}
                </span>
              </div>
              <div className={`mb-2 text-[10px] font-mono uppercase tracking-[0.24em] ${mission.accent}`}>{mission.label}</div>
              <h3 className="text-xl font-bold leading-tight text-white">{mission.title}</h3>
              <p className="mt-3 text-xs font-mono leading-relaxed text-gray-500">{mission.desc}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

const MapRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-3">
    <span className="material-symbols-outlined text-xl text-neon-cyan">{icon}</span>
    <span className="min-w-0">
      <span className="block text-[9px] font-mono uppercase tracking-widest text-gray-500">{label}</span>
      <span className="block truncate text-sm font-semibold text-white">{value}</span>
    </span>
  </div>
);

export default StudentHomeView;
