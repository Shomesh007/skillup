import React, { useState } from 'react';

interface TargetRole {
  title: string;
  fit: string;
  proof: string[];
  keywords: string[];
  applyTo: string;
  avoid: string;
  difficulty: 'Easy entry' | 'Balanced' | 'Competitive';
}

const roles: TargetRole[] = [
  { title: 'Graduate Engineer Trainee', fit: 'Best when you are flexible across development, testing, support, or operations.', proof: ['Strong basics', 'Any 2 projects', 'Aptitude prep'], keywords: ['GET', 'graduate trainee', 'campus hiring'], applyTo: 'Service companies, product support teams, large enterprises.', avoid: 'Do not use one generic resume for every GET role.', difficulty: 'Easy entry' },
  { title: 'Junior Frontend Developer', fit: 'Best if your projects look polished and are deployed.', proof: ['React UI', 'Responsive layout', 'GitHub plus live link'], keywords: ['junior frontend', 'react fresher', 'frontend intern'], applyTo: 'Startups, agencies, SaaS teams, product companies.', avoid: 'Do not show only screenshots; share live demos.', difficulty: 'Balanced' },
  { title: 'Fresher Software Engineer', fit: 'Best if you have DSA basics and one complete software project.', proof: ['DSA basics', 'Full stack project', 'Clean README'], keywords: ['software engineer fresher', 'entry level developer', 'associate software engineer'], applyTo: 'Product companies, startups, service companies.', avoid: 'Do not target only top companies at first.', difficulty: 'Competitive' },
  { title: 'QA Tester Fresher', fit: 'Best if you are detail-oriented and can document bugs clearly.', proof: ['Test cases', 'Bug reports', 'SDLC basics'], keywords: ['qa fresher', 'manual tester', 'software tester fresher'], applyTo: 'Product teams, QA service companies, startups.', avoid: 'Do not write only "manual testing" without examples.', difficulty: 'Easy entry' },
  { title: 'Automation Tester Fresher', fit: 'Best if you can code basic test scripts.', proof: ['Playwright/Selenium', 'Postman', 'GitHub test repo'], keywords: ['automation tester fresher', 'sdet intern', 'qa automation'], applyTo: 'QA teams, fintech, SaaS, automation-focused companies.', avoid: 'Do not claim automation without a runnable repo.', difficulty: 'Balanced' },
  { title: 'Data Analyst Fresher', fit: 'Best if you can explain dashboards and business insights.', proof: ['SQL', 'Excel/Power BI', 'Insight report'], keywords: ['data analyst fresher', 'business analyst fresher', 'mis analyst'], applyTo: 'Analytics teams, operations teams, finance, edtech.', avoid: 'Do not show charts without written insights.', difficulty: 'Balanced' },
  { title: 'Technical Support Engineer', fit: 'Best if communication is strong and you can troubleshoot calmly.', proof: ['SQL basics', 'Logs basics', 'Support playbook'], keywords: ['technical support engineer fresher', 'application support', 'support analyst'], applyTo: 'SaaS companies, product support, cloud support teams.', avoid: 'Do not treat support as non-technical; show debugging ability.', difficulty: 'Easy entry' },
];

const GraduateRoleTargeterView: React.FC = () => {
  const [selectedTitle, setSelectedTitle] = useState(roles[3].title);
  const selected = roles.find((role) => role.title === selectedTitle) || roles[0];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-5 pb-32 lg:p-8 lg:pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-neon-amber/20 bg-[linear-gradient(145deg,rgba(255,170,0,0.12),rgba(10,16,31,0.9)_46%,rgba(0,0,0,0.35))] p-5 lg:p-8">
        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-amber/20 bg-black/25 px-3 py-1">
            <span className="material-symbols-outlined text-sm text-neon-amber">adjust</span>
            <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-amber">Target before applying</span>
          </div>
          <h1 className="text-3xl font-bold leading-none text-white lg:text-6xl">Find a fresher role you can actually win.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">Choose a target role based on proof, keywords, and hiring reality. The goal is fewer random applications and better shortlist odds.</p>
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4">
          <h2 className="mb-4 text-sm font-mono uppercase tracking-[0.18em] text-white">Fresher targets</h2>
          <div className="space-y-2">
            {roles.map((role) => (
              <button key={role.title} onClick={() => setSelectedTitle(role.title)} className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition-all ${selected.title === role.title ? 'border-neon-amber/40 bg-neon-amber/10' : 'border-white/5 bg-black/20'}`}>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-white">{role.title}</span>
                  <span className="block truncate text-[10px] font-mono text-gray-500">{role.fit}</span>
                </span>
                <span className="shrink-0 rounded-full border border-white/10 px-2 py-1 text-[9px] font-mono text-gray-500">{role.difficulty}</span>
              </button>
            ))}
          </div>
        </div>

        <article className="rounded-[1.75rem] border border-neon-amber/20 bg-black/25 p-4 lg:p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-neon-amber">Selected target</span>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-white">{selected.title}</h2>
            </div>
            <span className="rounded-full border border-neon-amber/30 bg-neon-amber/10 px-3 py-1 text-[10px] font-mono text-neon-amber">{selected.difficulty}</span>
          </div>
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-gray-300">{selected.fit}</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <ChipPanel title="Proof needed" items={selected.proof} icon="verified" />
            <ChipPanel title="Search keywords" items={selected.keywords} icon="search" />
          </div>
          <div className="mt-4 space-y-3">
            <InfoRow icon="business_center" label="Apply to" value={selected.applyTo} />
            <InfoRow icon="block" label="Avoid" value={selected.avoid} />
          </div>
        </article>
      </section>
    </div>
  );
};

const ChipPanel: React.FC<{ title: string; items: string[]; icon: string }> = ({ title, items, icon }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
    <div className="mb-3 flex items-center gap-2">
      <span className="material-symbols-outlined text-lg text-neon-amber">{icon}</span>
      <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">{title}</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => <span key={item} className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[10px] font-mono text-gray-300">{item}</span>)}
    </div>
  </div>
);

const InfoRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
    <span className="material-symbols-outlined text-xl text-neon-green">{icon}</span>
    <span>
      <span className="block text-[9px] font-mono uppercase tracking-widest text-gray-500">{label}</span>
      <span className="mt-1 block text-sm font-semibold leading-snug text-white">{value}</span>
    </span>
  </div>
);

export default GraduateRoleTargeterView;
