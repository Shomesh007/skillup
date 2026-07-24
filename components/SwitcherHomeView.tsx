import React from 'react';
import { SwitcherSetupProfile } from './SwitcherSetupView';
import DecisionCoachCard from './DecisionCoachCard';

interface Props {
  profile: SwitcherSetupProfile | null;
  onOpenTargeter: () => void;
  onOpenTranslator: () => void;
  onOpenJobs: () => void;
  onOpenResume: () => void;
  onOpenInterview: () => void;
  onOpenCoaching: () => void;
  onChangeProfile: () => void;
}

const labels = {
  current: { support: 'Support / Operations', 'non-it': 'Non-IT role', qa: 'Testing / QA', developer: 'Developer role', analyst: 'Analyst / Data-adjacent' },
  target: { dev: 'Move into development', automation: 'Move into automation / SDET', data: 'Move into data roles', cloud: 'Move into cloud / DevOps', 'better-job': 'Same role, better company' },
  blocker: { proof: 'No proof for new role', resume: 'Resume does not translate', time: 'Low time after work', confidence: 'Not sure if realistic', interviews: 'Interview gap' },
};

const getLabel = (map: Record<string, string>, key?: string) => (key && map[key]) || 'Not selected';

const SwitcherHomeView: React.FC<Props> = ({ profile, onOpenTargeter, onOpenTranslator, onOpenJobs, onOpenResume, onOpenInterview, onOpenCoaching, onChangeProfile }) => {
  const current = getLabel(labels.current, profile?.current);
  const target = getLabel(labels.target, profile?.target);
  const blocker = getLabel(labels.blocker, profile?.blocker);

  const actions = [
    { label: 'Switch Targeter', title: 'Choose my pivot path', desc: 'Compare realistic bridge roles, risk, proof needed, and target keywords.', icon: 'conversion_path', action: onOpenTargeter, accent: 'text-neon-violet', border: 'border-neon-violet/35', tag: 'Pivot' },
    { label: 'Experience Translator', title: 'Translate my experience', desc: 'Turn current work into target-role resume bullets, project proof, and interview stories.', icon: 'translate', action: onOpenTranslator, accent: 'text-neon-green', border: 'border-neon-green/35', tag: blocker },
    { label: 'Switch-friendly jobs', title: 'Find matching jobs', desc: 'Look for roles where your previous experience can still count.', icon: 'search', action: onOpenJobs, accent: 'text-neon-cyan', border: 'border-neon-cyan/35', tag: 'Openings' },
    { label: 'Interview Bridge', title: 'Prepare switcher interviews', desc: 'Practice why-switch, role basics, project defense, and experience stories.', icon: 'terminal', action: onOpenInterview, accent: 'text-cyan-300', border: 'border-cyan-300/35', tag: 'Prep' },
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-6 pt-4 pb-32 lg:p-8 lg:pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-neon-violet/20 bg-[linear-gradient(145deg,rgba(139,92,246,0.15),rgba(10,16,31,0.9)_45%,rgba(0,240,255,0.07))] p-5 shadow-2xl shadow-black/30 lg:p-8">
        <div className="absolute right-[-4rem] top-[-4rem] h-56 w-56 rounded-full bg-neon-violet/10 blur-3xl"></div>
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-violet/20 bg-black/25 px-3 py-1.5">
              <span className="material-symbols-outlined text-sm text-neon-violet">move_up</span>
              <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-violet">Career migration console</span>
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-[0.95] text-white lg:text-6xl">Switch without starting from zero.</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">Use your existing work as leverage, pick a practical bridge role, build missing proof, and explain the switch clearly.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-gray-500">Current switch map</span>
              <button onClick={onChangeProfile} className="text-[10px] font-mono uppercase tracking-widest text-neon-violet hover:text-white">Edit</button>
            </div>
            <div className="space-y-3">
              <MapRow icon="work_history" label="From" value={current} />
              <MapRow icon="conversion_path" label="To" value={target} />
              <MapRow icon="priority_high" label="Blocker" value={blocker} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <DecisionCoachCard
          accent="violet"
          eyebrow="Switching roles feels risky?"
          desc="Use a 1-on-1 session to compare pivot paths, translate your current experience, and choose a switch plan that is realistic."
          onOpenCoaching={onOpenCoaching}
        />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-neon-green/20 bg-neon-green/10 p-5">
          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-neon-green shadow-[0_0_10px_rgba(10,255,0,1)]"></span>
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-neon-green">Best first move</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Translate before applying.</h2>
            <p className="mt-3 text-xs font-mono leading-relaxed text-gray-400">Most switchers look junior because their past work is not framed for the target role. Fix that first.</p>
            <button onClick={onOpenTranslator} className="mt-5 inline-flex items-center gap-2 rounded-full border border-neon-green/30 bg-black/20 px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-neon-green transition-colors hover:bg-neon-green/10">
              Translate experience
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-[0.18em] text-white">Switcher flow</h2>
            <span className="text-[10px] font-mono text-gray-500">Map {'>'} Translate {'>'} Proof {'>'} Apply</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['Pivot', 'Stories', 'Proof', 'Rounds'].map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                <span className="mb-3 block font-mono text-[10px] text-neon-violet">0{index + 1}</span>
                <span className="block text-[10px] font-semibold leading-tight text-white lg:text-xs">{step}</span>
              </div>
            ))}
          </div>
          <button onClick={onOpenResume} className="mt-4 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-left transition-colors hover:border-neon-violet/30 hover:bg-neon-violet/10">
            <span>
              <span className="block text-sm font-bold text-white">Resume must explain the bridge</span>
              <span className="block text-[10px] font-mono text-gray-500">Show transferable proof, not a disconnected history.</span>
            </span>
            <span className="material-symbols-outlined text-neon-violet">badge</span>
          </button>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-neon-violet/40 to-transparent"></span>
          <h2 className="text-[10px] font-mono uppercase tracking-[0.28em] text-gray-400">Choose your next move</h2>
          <span className="h-px flex-1 bg-gradient-to-l from-neon-violet/40 to-transparent"></span>
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
    <span className="material-symbols-outlined text-xl text-neon-violet">{icon}</span>
    <span className="min-w-0">
      <span className="block text-[9px] font-mono uppercase tracking-widest text-gray-500">{label}</span>
      <span className="block truncate text-sm font-semibold text-white">{value}</span>
    </span>
  </div>
);

export default SwitcherHomeView;
