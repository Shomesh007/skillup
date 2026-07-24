import React, { useState } from 'react';
import DecisionCoachCard from './DecisionCoachCard';

interface Translation {
  id: string;
  title: string;
  icon: string;
  before: string;
  after: string;
  proof: string[];
  interview: string;
}

const translations: Translation[] = [
  {
    id: 'tickets',
    title: 'Ticket handling -> QA/product thinking',
    icon: 'confirmation_number',
    before: 'Handled customer tickets and escalated issues.',
    after: 'Analyzed recurring user issues, reproduced defects, documented scenarios, and coordinated fixes with product/engineering teams.',
    proof: ['Bug report samples', 'Root cause notes', 'Regression checklist'],
    interview: 'Tell a story where you found a repeated issue and helped prevent it from happening again.',
  },
  {
    id: 'reports',
    title: 'Reports -> Data analysis',
    icon: 'bar_chart',
    before: 'Prepared daily and weekly reports.',
    after: 'Cleaned operational data, tracked trends, created dashboards, and highlighted actions for business decisions.',
    proof: ['SQL/Excel dashboard', 'Trend insight writeup', 'Before-after metric'],
    interview: 'Explain one report where your insight changed a decision or saved time.',
  },
  {
    id: 'incidents',
    title: 'Incidents -> DevOps/cloud readiness',
    icon: 'emergency_home',
    before: 'Monitored issues and informed teams.',
    after: 'Tracked incidents, read logs, followed escalation workflows, and supported uptime by coordinating technical response.',
    proof: ['Incident report', 'Linux/networking notes', 'Monitoring checklist'],
    interview: 'Describe an incident, how you triaged it, and what you learned about reliability.',
  },
  {
    id: 'manual-test',
    title: 'Manual testing -> Automation/SDET',
    icon: 'bug_report',
    before: 'Executed manual test cases.',
    after: 'Designed test scenarios, identified regression areas, and automated repeatable checks using UI/API testing tools.',
    proof: ['Playwright repo', 'Postman collection', 'CI test screenshot'],
    interview: 'Explain why you automated a flow and what failures it catches.',
  },
];

interface Props {
  onOpenCoaching: () => void;
}

const SwitcherTranslatorView: React.FC<Props> = ({ onOpenCoaching }) => {
  const [activeId, setActiveId] = useState(translations[0].id);
  const active = translations.find((item) => item.id === activeId) || translations[0];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-5 pb-32 lg:p-8 lg:pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-neon-green/20 bg-[linear-gradient(145deg,rgba(10,255,0,0.1),rgba(10,16,31,0.9)_48%,rgba(139,92,246,0.12))] p-5 lg:p-8">
        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-green/20 bg-black/25 px-3 py-1">
            <span className="material-symbols-outlined text-sm text-neon-green">translate</span>
            <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-green">Translate experience</span>
          </div>
          <h1 className="text-3xl font-bold leading-none text-white lg:text-6xl">Make your old work sound useful for the new role.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">Switchers do not need to erase their past. They need to rewrite it as proof the new hiring team understands.</p>
        </div>
      </section>

      <section className="mt-5">
        <DecisionCoachCard
          accent="green"
          eyebrow="Need your experience rewritten?"
          desc="Book a 1-on-1 session to translate your past work into target-role resume bullets and interview stories."
          onOpenCoaching={onOpenCoaching}
        />
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="grid gap-3">
          {translations.map((item) => (
            <button key={item.id} onClick={() => setActiveId(item.id)} className={`rounded-3xl border p-4 text-left transition-all hover:-translate-y-1 ${item.id === activeId ? 'border-neon-green/40 bg-neon-green/10' : 'border-white/10 bg-black/25'}`}>
              <span className="material-symbols-outlined text-3xl text-neon-green">{item.icon}</span>
              <h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-xs font-mono leading-relaxed text-gray-500">{item.before}</p>
            </button>
          ))}
        </div>

        <article className="rounded-[1.75rem] border border-neon-green/20 bg-black/25 p-4 lg:p-5">
          <div className="mb-5">
            <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-neon-green">Translation template</span>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-white">{active.title}</h2>
          </div>
          <div className="grid gap-3">
            <CompareBox label="Weak version" value={active.before} muted />
            <CompareBox label="Stronger resume version" value={active.after} />
          </div>
          <div className="mt-4 rounded-2xl border border-neon-violet/20 bg-neon-violet/10 p-4">
            <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.24em] text-neon-violet">Interview story</div>
            <p className="text-sm font-bold leading-relaxed text-white">{active.interview}</p>
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-3 text-[10px] font-mono uppercase tracking-widest text-gray-500">Proof to attach</div>
            <div className="flex flex-wrap gap-2">
              {active.proof.map((item) => <span key={item} className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[10px] font-mono text-gray-300">{item}</span>)}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

const CompareBox: React.FC<{ label: string; value: string; muted?: boolean }> = ({ label, value, muted }) => (
  <div className={`rounded-2xl border p-4 ${muted ? 'border-white/10 bg-white/[0.03]' : 'border-neon-green/20 bg-neon-green/10'}`}>
    <div className={`mb-2 text-[10px] font-mono uppercase tracking-[0.24em] ${muted ? 'text-gray-500' : 'text-neon-green'}`}>{label}</div>
    <p className="text-sm font-semibold leading-relaxed text-white">{value}</p>
  </div>
);

export default SwitcherTranslatorView;
