import React, { useState } from 'react';
import DecisionCoachCard from './DecisionCoachCard';

interface Pivot {
  title: string;
  from: string;
  bridge: string;
  proof: string[];
  keywords: string[];
  risk: 'Low risk' | 'Medium risk' | 'High effort';
}

const pivots: Pivot[] = [
  { title: 'Support -> QA Tester', from: 'Support / operations', bridge: 'You already understand users, bugs, tickets, and product behavior.', proof: ['Bug report samples', 'Test case portfolio', 'SDLC basics'], keywords: ['manual tester', 'qa analyst', 'software tester'], risk: 'Low risk' },
  { title: 'Manual QA -> Automation Tester', from: 'Testing / QA', bridge: 'Your testing knowledge becomes stronger when paired with scripts and CI.', proof: ['Playwright/Selenium repo', 'Postman tests', 'CI test run'], keywords: ['automation tester', 'sdet', 'qa automation'], risk: 'Medium risk' },
  { title: 'Support -> Cloud Support', from: 'Support / operations', bridge: 'Troubleshooting experience maps well to cloud incidents and customer issues.', proof: ['Linux basics', 'Networking notes', 'AWS/Azure labs'], keywords: ['cloud support associate', 'technical support cloud', 'cloud engineer'], risk: 'Medium risk' },
  { title: 'Analyst -> Data Analyst', from: 'Reports / operations / Excel', bridge: 'Existing reporting work can become analytics proof with SQL and dashboards.', proof: ['SQL queries', 'Power BI dashboard', 'Insight report'], keywords: ['data analyst', 'business analyst', 'mis analyst'], risk: 'Low risk' },
  { title: 'Non-IT -> Frontend Developer', from: 'Non-IT role', bridge: 'A visible portfolio can compensate if your past work is unrelated.', proof: ['2 deployed React projects', 'GitHub readmes', 'UI case study'], keywords: ['frontend developer', 'react developer', 'junior developer'], risk: 'High effort' },
  { title: 'Developer -> Better Product Role', from: 'Developer role', bridge: 'You need stronger project impact, system ownership, and interview stories.', proof: ['Impact bullets', 'System design basics', 'Code samples'], keywords: ['software engineer', 'backend engineer', 'product engineer'], risk: 'Medium risk' },
];

interface Props {
  onOpenCoaching: () => void;
}

const SwitcherTargeterView: React.FC<Props> = ({ onOpenCoaching }) => {
  const [selectedTitle, setSelectedTitle] = useState(pivots[0].title);
  const selected = pivots.find((pivot) => pivot.title === selectedTitle) || pivots[0];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-5 pb-32 lg:p-8 lg:pb-8">
      <section className="rounded-[2rem] border border-neon-violet/20 bg-[linear-gradient(145deg,rgba(139,92,246,0.14),rgba(10,16,31,0.9)_48%,rgba(0,0,0,0.35))] p-5 lg:p-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-violet/20 bg-black/25 px-3 py-1">
          <span className="material-symbols-outlined text-sm text-neon-violet">conversion_path</span>
          <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-violet">Pick the bridge</span>
        </div>
        <h1 className="text-3xl font-bold leading-none text-white lg:text-6xl">Choose a switch path with leverage.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">The best switch is not always the flashiest role. It is the role where your old experience reduces the risk of hiring you.</p>
      </section>

      <section className="mt-5">
        <DecisionCoachCard
          accent="violet"
          eyebrow="Need help choosing a safe pivot?"
          desc="A 1-on-1 session can help compare role risk, proof gaps, and the best bridge path from your current work."
          onOpenCoaching={onOpenCoaching}
        />
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4">
          <h2 className="mb-4 text-sm font-mono uppercase tracking-[0.18em] text-white">Bridge paths</h2>
          <div className="space-y-2">
            {pivots.map((pivot) => (
              <button key={pivot.title} onClick={() => setSelectedTitle(pivot.title)} className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition-all ${selected.title === pivot.title ? 'border-neon-violet/40 bg-neon-violet/10' : 'border-white/5 bg-black/20'}`}>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-white">{pivot.title}</span>
                  <span className="block truncate text-[10px] font-mono text-gray-500">{pivot.from}</span>
                </span>
                <span className="shrink-0 rounded-full border border-white/10 px-2 py-1 text-[9px] font-mono text-gray-500">{pivot.risk}</span>
              </button>
            ))}
          </div>
        </div>

        <article className="rounded-[1.75rem] border border-neon-violet/20 bg-black/25 p-4 lg:p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-neon-violet">Selected switch path</span>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-white">{selected.title}</h2>
            </div>
            <span className="rounded-full border border-neon-violet/30 bg-neon-violet/10 px-3 py-1 text-[10px] font-mono text-neon-violet">{selected.risk}</span>
          </div>
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-gray-300">{selected.bridge}</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <ChipPanel title="Proof needed" items={selected.proof} icon="verified" />
            <ChipPanel title="Search keywords" items={selected.keywords} icon="search" />
          </div>
        </article>
      </section>
    </div>
  );
};

const ChipPanel: React.FC<{ title: string; items: string[]; icon: string }> = ({ title, items, icon }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
    <div className="mb-3 flex items-center gap-2">
      <span className="material-symbols-outlined text-lg text-neon-violet">{icon}</span>
      <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">{title}</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => <span key={item} className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[10px] font-mono text-gray-300">{item}</span>)}
    </div>
  </div>
);

export default SwitcherTargeterView;
