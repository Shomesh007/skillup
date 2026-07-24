import React, { useState } from 'react';

export interface SwitcherSetupProfile {
  current: string;
  target: string;
  blocker: string;
}

interface Props {
  onComplete: (profile: SwitcherSetupProfile) => void;
  onBack: () => void;
}

interface Choice {
  id: string;
  label: string;
  desc: string;
  icon: string;
}

const currentOptions = [
  { id: 'support', label: 'Support / Operations', desc: 'I work with users, tickets, incidents, or operations.', icon: 'support_agent' },
  { id: 'non-it', label: 'Non-IT role', desc: 'I want to move into IT from another domain.', icon: 'swap_horiz' },
  { id: 'qa', label: 'Testing / QA', desc: 'I test products and want a better role or automation path.', icon: 'bug_report' },
  { id: 'developer', label: 'Developer role', desc: 'I code now but want a better stack, company, or salary.', icon: 'code' },
  { id: 'analyst', label: 'Analyst / Data-adjacent', desc: 'I work with reports, Excel, dashboards, or business data.', icon: 'query_stats' },
];

const targetOptions = [
  { id: 'dev', label: 'Move into development', desc: 'Frontend, backend, full stack, or software engineer.', icon: 'developer_mode' },
  { id: 'automation', label: 'Move into automation / SDET', desc: 'From manual QA/support into automation testing.', icon: 'precision_manufacturing' },
  { id: 'data', label: 'Move into data roles', desc: 'Data analyst, BI analyst, or analytics engineer.', icon: 'bar_chart' },
  { id: 'cloud', label: 'Move into cloud / DevOps', desc: 'Cloud support, DevOps, SRE, or platform roles.', icon: 'cloud_sync' },
  { id: 'better-job', label: 'Same role, better company', desc: 'I want stronger pay, brand, stability, or growth.', icon: 'trending_up' },
];

const blockerOptions = [
  { id: 'proof', label: 'No proof for new role', desc: 'My experience does not show the target skills yet.', icon: 'deployed_code' },
  { id: 'resume', label: 'Resume does not translate', desc: 'My current work sounds unrelated to the target job.', icon: 'badge' },
  { id: 'time', label: 'Low time after work', desc: 'I need a plan that fits nights and weekends.', icon: 'schedule' },
  { id: 'confidence', label: 'Not sure if switch is realistic', desc: 'I need a safer path with less guesswork.', icon: 'psychology' },
  { id: 'interviews', label: 'Interview gap', desc: 'I can apply, but I need role-specific prep.', icon: 'terminal' },
];

const steps = [
  { marker: '01', eyebrow: 'Current base', title: 'What work are you switching from?', desc: 'Your current experience is not waste. We will translate it into the new target role.', field: 'current' as const, options: currentOptions },
  { marker: '02', eyebrow: 'Switch direction', title: 'Where do you want to move next?', desc: 'Switchers need a realistic bridge role, not a random dream title with no proof.', field: 'target' as const, options: targetOptions },
  { marker: '03', eyebrow: 'Main constraint', title: 'What is blocking the switch most?', desc: 'This decides whether your plan should focus on proof, resume translation, time, confidence, or interviews.', field: 'blocker' as const, options: blockerOptions },
];

const getChoice = (options: Choice[], id: string) => options.find((item) => item.id === id) || options[0];

const SwitcherSetupView: React.FC<Props> = ({ onComplete, onBack }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<SwitcherSetupProfile>({
    current: currentOptions[0].id,
    target: targetOptions[1].id,
    blocker: blockerOptions[1].id,
  });

  const isReview = stepIndex === steps.length;
  const activeStep = steps[Math.min(stepIndex, steps.length - 1)];
  const selectedValue = profile[activeStep.field];
  const selectedCurrent = getChoice(currentOptions, profile.current);
  const selectedTarget = getChoice(targetOptions, profile.target);
  const selectedBlocker = getChoice(blockerOptions, profile.blocker);

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((current) => current - 1);
      return;
    }
    onBack();
  };

  const goNext = () => {
    if (isReview) {
      onComplete(profile);
      return;
    }
    setStepIndex((current) => Math.min(current + 1, steps.length));
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-6 pt-10 pb-28 lg:p-8 lg:pb-10">
      <div className="mx-auto flex min-h-full max-w-5xl flex-col">
        <div className="mb-5 flex items-center justify-between">
          <button onClick={goBack} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.22em] text-gray-300 transition-colors hover:border-neon-violet/40 hover:text-neon-violet">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            {stepIndex === 0 ? 'Change stage' : 'Back'}
          </button>
          <span className="rounded-full border border-neon-violet/20 bg-neon-violet/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-neon-violet">{isReview ? 'Review' : `${activeStep.marker} / 03`}</span>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className={`h-1.5 rounded-full transition-all ${item <= stepIndex ? 'bg-neon-violet shadow-[0_0_10px_rgba(139,92,246,0.75)]' : 'bg-white/10'}`}></div>
          ))}
        </div>

        <section className="relative flex-1 overflow-hidden rounded-[2.25rem] border border-neon-violet/20 bg-[radial-gradient(circle_at_18%_0%,rgba(139,92,246,0.18),transparent_32%),linear-gradient(135deg,rgba(10,16,31,0.94),rgba(3,8,18,0.78))] p-5 shadow-2xl shadow-black/30 lg:p-8">
          <div className="absolute right-[-7rem] top-[-7rem] h-72 w-72 rounded-full border border-neon-violet/20 bg-neon-violet/5 blur-sm"></div>
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px]"></div>
          {!isReview ? (
            <div className="relative z-10 grid min-h-[540px] gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-violet/20 bg-neon-violet/10 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-violet shadow-[0_0_10px_rgba(139,92,246,1)]"></span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-violet">{activeStep.eyebrow}</span>
                </div>
                <h1 className="text-4xl font-bold leading-[0.95] text-white lg:text-6xl">{activeStep.title}</h1>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-400">{activeStep.desc}</p>
                <div className="mt-8 hidden rounded-3xl border border-white/10 bg-black/25 p-4 lg:block">
                  <div className="mb-3 text-[10px] font-mono uppercase tracking-[0.22em] text-gray-500">Switch signal</div>
                  <div className="space-y-2">
                    <SummaryRow label="From" value={selectedCurrent.label} active={activeStep.field === 'current'} />
                    <SummaryRow label="To" value={selectedTarget.label} active={activeStep.field === 'target'} />
                    <SummaryRow label="Blocker" value={selectedBlocker.label} active={activeStep.field === 'blocker'} />
                  </div>
                </div>
              </div>
              <div className={`grid gap-3 ${activeStep.options.length > 4 ? 'lg:grid-cols-2' : ''}`}>
                {activeStep.options.map((item) => (
                  <ChoiceButton key={item.id} item={item} active={selectedValue === item.id} onClick={() => setProfile((current) => ({ ...current, [activeStep.field]: item.id }))} />
                ))}
              </div>
            </div>
          ) : (
            <ReviewScreen current={selectedCurrent} target={selectedTarget} blocker={selectedBlocker} />
          )}
        </section>

        <button onClick={goNext} className="group relative mt-5 flex items-center justify-between overflow-hidden rounded-3xl border border-neon-violet/40 bg-neon-violet/10 px-5 py-5 text-left transition-all hover:-translate-y-1 hover:bg-neon-violet/15 active:scale-[0.99]">
          <span>
            <span className="block text-[10px] font-mono uppercase tracking-[0.24em] text-neon-violet">{isReview ? 'Generate switch plan' : 'Continue setup'}</span>
            <span className="mt-1 block text-xl font-bold text-white">{isReview ? 'Start my transition' : 'Next question'}</span>
          </span>
          <span className="material-symbols-outlined text-3xl text-neon-violet transition-transform group-hover:translate-x-1">{isReview ? 'move_up' : 'arrow_forward'}</span>
        </button>
      </div>
    </div>
  );
};

const SummaryRow: React.FC<{ label: string; value: string; active: boolean }> = ({ label, value, active }) => (
  <div className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 ${active ? 'border-neon-violet/30 bg-neon-violet/10' : 'border-white/5 bg-white/[0.03]'}`}>
    <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500">{label}</span>
    <span className={`truncate text-xs font-semibold ${active ? 'text-neon-violet' : 'text-white'}`}>{value}</span>
  </div>
);

const ChoiceButton: React.FC<{ item: Choice; active: boolean; onClick: () => void }> = ({ item, active, onClick }) => (
  <button onClick={onClick} className={`group min-h-28 rounded-3xl border p-4 text-left transition-all hover:-translate-y-1 active:scale-[0.98] lg:min-h-32 ${active ? 'border-neon-violet/50 bg-neon-violet/10 shadow-[inset_0_0_28px_rgba(139,92,246,0.08)]' : 'border-white/10 bg-black/25 hover:border-white/20 hover:bg-white/[0.05]'}`}>
    <div className="mb-3 flex items-center justify-between">
      <span className={`material-symbols-outlined text-3xl ${active ? 'text-neon-violet' : 'text-gray-500 group-hover:text-neon-violet'}`}>{item.icon}</span>
      <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-neon-violet shadow-[0_0_10px_rgba(139,92,246,1)]' : 'bg-white/10'}`}></span>
    </div>
    <h3 className="text-base font-bold text-white">{item.label}</h3>
    <p className="mt-2 text-xs font-mono leading-relaxed text-gray-500">{item.desc}</p>
  </button>
);

const ReviewScreen: React.FC<{ current: Choice; target: Choice; blocker: Choice }> = ({ current, target, blocker }) => (
  <div className="relative z-10 grid min-h-[540px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
    <div>
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-violet/20 bg-neon-violet/10 px-3 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-neon-violet shadow-[0_0_10px_rgba(139,92,246,1)]"></span>
        <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-violet">Ready to migrate</span>
      </div>
      <h1 className="text-4xl font-bold leading-[0.95] text-white lg:text-6xl">Your switch plan is ready.</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-400">We will focus on a realistic pivot, translate your existing work, close proof gaps, and prepare for switcher interviews.</p>
    </div>
    <div className="space-y-3">
      <ReviewCard marker="01" item={current} label="Current base" />
      <ReviewCard marker="02" item={target} label="Target move" />
      <ReviewCard marker="03" item={blocker} label="Main blocker" />
    </div>
  </div>
);

const ReviewCard: React.FC<{ marker: string; item: Choice; label: string }> = ({ marker, item, label }) => (
  <div className="rounded-3xl border border-neon-violet/20 bg-black/25 p-4">
    <div className="mb-3 flex items-center justify-between">
      <span className="text-[10px] font-mono text-neon-violet">{marker}</span>
      <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-gray-500">{label}</span>
    </div>
    <div className="flex items-start gap-4">
      <span className="material-symbols-outlined text-4xl text-neon-violet">{item.icon}</span>
      <span>
        <span className="block text-lg font-bold text-white">{item.label}</span>
        <span className="mt-1 block text-xs font-mono leading-relaxed text-gray-500">{item.desc}</span>
      </span>
    </div>
  </div>
);

export default SwitcherSetupView;
