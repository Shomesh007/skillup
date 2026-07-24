import React, { useState } from 'react';
import DecisionCoachCard from './DecisionCoachCard';

interface FixArea {
  id: string;
  title: string;
  icon: string;
  score: string;
  symptom: string;
  fixes: string[];
  quickWin: string;
}

const fixAreas: FixArea[] = [
  {
    id: 'targeting',
    title: 'Wrong role targeting',
    icon: 'adjust',
    score: 'High impact',
    symptom: 'You apply to many roles but your resume does not match the title.',
    fixes: ['Pick 1 primary role and 1 backup role', 'Use exact title keywords', 'Avoid senior or 3+ year roles'],
    quickWin: 'Search with "fresher", "entry level", "graduate trainee", and your target title.',
  },
  {
    id: 'resume',
    title: 'Resume not shortlist-ready',
    icon: 'badge',
    score: 'Critical',
    symptom: 'Your resume lists skills but does not prove outcomes.',
    fixes: ['Add project impact bullets', 'Put target keywords near top', 'Remove unrelated filler'],
    quickWin: 'Rewrite one project bullet with action, tool, and result.',
  },
  {
    id: 'proof',
    title: 'Weak project proof',
    icon: 'deployed_code',
    score: 'High impact',
    symptom: 'Recruiters cannot verify what you built or tested.',
    fixes: ['Add GitHub links', 'Write clean README files', 'Deploy or attach screenshots'],
    quickWin: 'Make one project repo public with setup steps and screenshots.',
  },
  {
    id: 'linkedin',
    title: 'LinkedIn/GitHub gap',
    icon: 'hub',
    score: 'Medium',
    symptom: 'Your online profile does not support your resume.',
    fixes: ['Match headline with target role', 'Pin best projects', 'Add skills and certificates cleanly'],
    quickWin: 'Change headline to target role plus top 2 skills.',
  },
  {
    id: 'volume',
    title: 'Low application quality',
    icon: 'send',
    score: 'Medium',
    symptom: 'You apply randomly or too rarely to create enough chances.',
    fixes: ['Apply daily in batches', 'Track company, role, and status', 'Ask for referrals after matching role'],
    quickWin: 'Create a 30-company target list this week.',
  },
];

interface Props {
  onOpenCoaching: () => void;
}

const GraduateShortlistFixerView: React.FC<Props> = ({ onOpenCoaching }) => {
  const [activeId, setActiveId] = useState(fixAreas[1].id);
  const active = fixAreas.find((area) => area.id === activeId) || fixAreas[0];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-5 pb-32 lg:p-8 lg:pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-neon-green/20 bg-[linear-gradient(145deg,rgba(10,255,0,0.11),rgba(10,16,31,0.9)_46%,rgba(255,170,0,0.08))] p-5 lg:p-8">
        <div className="absolute right-[-4rem] top-[-4rem] h-56 w-56 rounded-full bg-neon-green/10 blur-3xl"></div>
        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-green/20 bg-black/25 px-3 py-1">
            <span className="material-symbols-outlined text-sm text-neon-green">fact_check</span>
            <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-green">Shortlist diagnosis</span>
          </div>
          <h1 className="text-3xl font-bold leading-none text-white lg:text-6xl">Find why calls are not coming.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">Most graduates do not need more panic. They need the exact blocker: role targeting, resume proof, project visibility, profile trust, or application quality.</p>
        </div>
      </section>

      <section className="mt-5">
        <DecisionCoachCard
          accent="green"
          eyebrow="Not sure what is blocking calls?"
          desc="Book a 1-on-1 session to review your resume, target roles, projects, and application strategy."
          onOpenCoaching={onOpenCoaching}
        />
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-3">
          {fixAreas.map((area) => (
            <button key={area.id} onClick={() => setActiveId(area.id)} className={`rounded-3xl border p-4 text-left transition-all hover:-translate-y-1 ${area.id === activeId ? 'border-neon-green/40 bg-neon-green/10' : 'border-white/10 bg-black/25'}`}>
              <div className="flex items-start justify-between gap-3">
                <span className="material-symbols-outlined text-3xl text-neon-green">{area.icon}</span>
                <span className="rounded-full border border-white/10 px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-gray-500">{area.score}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-white">{area.title}</h3>
              <p className="mt-2 text-xs font-mono leading-relaxed text-gray-500">{area.symptom}</p>
            </button>
          ))}
        </div>

        <article className="rounded-[1.75rem] border border-neon-green/20 bg-black/25 p-4 lg:p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-neon-green">Active blocker</span>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-white">{active.title}</h2>
            </div>
            <span className="material-symbols-outlined text-4xl text-neon-green">{active.icon}</span>
          </div>
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-gray-300">{active.symptom}</p>
          <div className="mt-4 rounded-2xl border border-neon-amber/20 bg-neon-amber/10 p-4">
            <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.24em] text-neon-amber">Quick win today</div>
            <p className="text-sm font-bold leading-relaxed text-white">{active.quickWin}</p>
          </div>
          <div className="mt-4 space-y-3">
            {active.fixes.map((fix, index) => (
              <div key={fix} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neon-green/10 text-[10px] font-mono text-neon-green">0{index + 1}</span>
                <span className="text-sm font-semibold leading-snug text-white">{fix}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default GraduateShortlistFixerView;
