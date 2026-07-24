import React, { useState } from 'react';
import DecisionCoachCard from './DecisionCoachCard';

export interface GraduateSetupProfile {
  situation: string;
  target: string;
  readiness: string;
}

interface Props {
  onComplete: (profile: GraduateSetupProfile) => void;
  onBack: () => void;
  onOpenCoaching: () => void;
}

interface Choice {
  id: string;
  label: string;
  desc: string;
  icon: string;
}

const situationOptions = [
  { id: 'recent', label: 'Recently graduated', desc: 'I am ready to start applying seriously.', icon: 'workspace_premium' },
  { id: 'active', label: 'Actively applying', desc: 'I am applying now and need better results.', icon: 'send' },
  { id: 'gap', label: 'Have a gap', desc: 'I need a realistic comeback plan and confidence.', icon: 'schedule' },
  { id: 'experience', label: 'Have internship/projects', desc: 'I need to convert my proof into interviews.', icon: 'verified' },
];

const targetOptions = [
  { id: 'developer', label: 'Developer roles', desc: 'Software engineer, frontend, backend, full stack.', icon: 'code' },
  { id: 'testing', label: 'Testing / QA roles', desc: 'Manual QA, automation tester, SDET, API tester.', icon: 'bug_report' },
  { id: 'data', label: 'Data / AI roles', desc: 'Data analyst, BI analyst, AI/ML fresher roles.', icon: 'query_stats' },
  { id: 'cloud', label: 'Cloud / DevOps roles', desc: 'Cloud support, DevOps beginner, SRE trainee.', icon: 'cloud_done' },
  { id: 'support', label: 'Support / Analyst roles', desc: 'Technical support, app support, business analyst.', icon: 'support_agent' },
  { id: 'unsure', label: 'Not sure yet', desc: 'Help me choose a realistic first target.', icon: 'explore' },
];

const readinessOptions = [
  { id: 'resume', label: 'Need resume first', desc: 'My profile is not ready to send yet.', icon: 'badge' },
  { id: 'skills', label: 'Need skills/projects', desc: 'I need stronger proof before applying.', icon: 'construction' },
  { id: 'jobs', label: 'Need job openings', desc: 'I need a cleaner way to find right jobs.', icon: 'search' },
  { id: 'prep', label: 'Need interview prep', desc: 'I am getting calls but need to perform better.', icon: 'terminal' },
  { id: 'no-calls', label: 'Applying but no calls', desc: 'I need to fix what is blocking shortlisting.', icon: 'report' },
];

const steps = [
  { marker: '01', eyebrow: 'Graduate status', title: 'Where are you right now?', desc: 'This tells us whether your plan should focus on applying, fixing profile gaps, or converting existing proof.', field: 'situation' as const, options: situationOptions },
  { marker: '02', eyebrow: 'Target role', title: 'What IT job are you targeting first?', desc: 'Graduates get better results when they pick a realistic first target instead of applying everywhere.', field: 'target' as const, options: targetOptions },
  { marker: '03', eyebrow: 'Readiness check', title: 'What do you need most right now?', desc: 'Your dashboard will prioritize the next action that most improves your shortlisting chances.', field: 'readiness' as const, options: readinessOptions },
];

const getChoice = (options: Choice[], id: string) => options.find((item) => item.id === id) || options[0];

const GraduateSetupView: React.FC<Props> = ({ onComplete, onBack, onOpenCoaching }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<GraduateSetupProfile>({
    situation: situationOptions[1].id,
    target: targetOptions[5].id,
    readiness: readinessOptions[4].id,
  });

  const isReview = stepIndex === steps.length;
  const activeStep = steps[Math.min(stepIndex, steps.length - 1)];
  const selectedValue = profile[activeStep.field];
  const selectedSituation = getChoice(situationOptions, profile.situation);
  const selectedTarget = getChoice(targetOptions, profile.target);
  const selectedReadiness = getChoice(readinessOptions, profile.readiness);

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
          <button onClick={goBack} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.22em] text-gray-300 transition-colors hover:border-neon-amber/40 hover:text-neon-amber">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            {stepIndex === 0 ? 'Change stage' : 'Back'}
          </button>
          <span className="rounded-full border border-neon-amber/20 bg-neon-amber/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-neon-amber">
            {isReview ? 'Review' : `${activeStep.marker} / 03`}
          </span>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className={`h-1.5 rounded-full transition-all ${item <= stepIndex ? 'bg-neon-amber shadow-[0_0_10px_rgba(255,170,0,0.7)]' : 'bg-white/10'}`}></div>
          ))}
        </div>

        <section className="relative flex-1 overflow-hidden rounded-[2.25rem] border border-neon-amber/20 bg-[radial-gradient(circle_at_18%_0%,rgba(255,170,0,0.16),transparent_32%),linear-gradient(135deg,rgba(10,16,31,0.94),rgba(3,8,18,0.78))] p-5 shadow-2xl shadow-black/30 lg:p-8">
          <div className="absolute right-[-7rem] top-[-7rem] h-72 w-72 rounded-full border border-neon-amber/20 bg-neon-amber/5 blur-sm"></div>
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-neon-amber/50 to-transparent"></div>
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px]"></div>

          {!isReview ? (
            <div className="relative z-10 grid min-h-[540px] gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-amber/20 bg-neon-amber/10 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-amber shadow-[0_0_10px_rgba(255,170,0,1)]"></span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-amber">{activeStep.eyebrow}</span>
                </div>
                <h1 className="text-4xl font-bold leading-[0.95] text-white lg:text-6xl">{activeStep.title}</h1>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-400">{activeStep.desc}</p>
                <div className="mt-8 hidden rounded-3xl border border-white/10 bg-black/25 p-4 lg:block">
                  <div className="mb-3 text-[10px] font-mono uppercase tracking-[0.22em] text-gray-500">Graduate signal</div>
                  <div className="space-y-2">
                    <SummaryRow label="Status" value={selectedSituation.label} active={activeStep.field === 'situation'} />
                    <SummaryRow label="Target" value={selectedTarget.label} active={activeStep.field === 'target'} />
                    <SummaryRow label="Need" value={selectedReadiness.label} active={activeStep.field === 'readiness'} />
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
            <ReviewScreen situation={selectedSituation} target={selectedTarget} readiness={selectedReadiness} onOpenCoaching={onOpenCoaching} />
          )}
        </section>

        <button onClick={goNext} className="group relative mt-5 flex items-center justify-between overflow-hidden rounded-3xl border border-neon-amber/40 bg-neon-amber/10 px-5 py-5 text-left transition-all hover:-translate-y-1 hover:bg-neon-amber/15 active:scale-[0.99]">
          <span className="relative">
            <span className="block text-[10px] font-mono uppercase tracking-[0.24em] text-neon-amber">{isReview ? 'Generate job cockpit' : 'Continue setup'}</span>
            <span className="mt-1 block text-xl font-bold text-white">{isReview ? 'Start applying smarter' : 'Next question'}</span>
          </span>
          <span className="material-symbols-outlined relative text-3xl text-neon-amber transition-transform group-hover:translate-x-1">{isReview ? 'rocket_launch' : 'arrow_forward'}</span>
        </button>
      </div>
    </div>
  );
};

const SummaryRow: React.FC<{ label: string; value: string; active: boolean }> = ({ label, value, active }) => (
  <div className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 ${active ? 'border-neon-amber/30 bg-neon-amber/10' : 'border-white/5 bg-white/[0.03]'}`}>
    <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500">{label}</span>
    <span className={`truncate text-xs font-semibold ${active ? 'text-neon-amber' : 'text-white'}`}>{value}</span>
  </div>
);

const ChoiceButton: React.FC<{ item: Choice; active: boolean; onClick: () => void }> = ({ item, active, onClick }) => (
  <button onClick={onClick} className={`group min-h-28 rounded-3xl border p-4 text-left transition-all hover:-translate-y-1 active:scale-[0.98] lg:min-h-32 ${active ? 'border-neon-amber/50 bg-neon-amber/10 shadow-[inset_0_0_28px_rgba(255,170,0,0.08)]' : 'border-white/10 bg-black/25 hover:border-white/20 hover:bg-white/[0.05]'}`}>
    <div className="mb-3 flex items-center justify-between">
      <span className={`material-symbols-outlined text-3xl ${active ? 'text-neon-amber' : 'text-gray-500 group-hover:text-neon-amber'}`}>{item.icon}</span>
      <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-neon-amber shadow-[0_0_10px_rgba(255,170,0,1)]' : 'bg-white/10'}`}></span>
    </div>
    <h3 className="text-base font-bold text-white">{item.label}</h3>
    <p className="mt-2 text-xs font-mono leading-relaxed text-gray-500">{item.desc}</p>
  </button>
);

const ReviewScreen: React.FC<{ situation: Choice; target: Choice; readiness: Choice; onOpenCoaching: () => void }> = ({ situation, target, readiness, onOpenCoaching }) => (
  <div className="relative z-10 grid min-h-[540px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
    <div>
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-amber/20 bg-neon-amber/10 px-3 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-neon-amber shadow-[0_0_10px_rgba(255,170,0,1)]"></span>
        <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-amber">Ready to launch</span>
      </div>
      <h1 className="text-4xl font-bold leading-[0.95] text-white lg:text-6xl">Your job-search cockpit is ready.</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-400">We will focus on realistic fresher roles, shortlisting fixes, daily applications, and interview readiness.</p>
    </div>
    <div className="space-y-3">
      <ReviewCard marker="01" item={situation} label="Current status" />
      <ReviewCard marker="02" item={target} label="Target role" />
      <ReviewCard marker="03" item={readiness} label="Priority need" />
      <DecisionCoachCard
        compact
        accent="amber"
        eyebrow="Want a target-role check?"
        desc="Book a 1-on-1 session before committing to a fresher role or application plan."
        onOpenCoaching={onOpenCoaching}
      />
    </div>
  </div>
);

const ReviewCard: React.FC<{ marker: string; item: Choice; label: string }> = ({ marker, item, label }) => (
  <div className="rounded-3xl border border-neon-amber/20 bg-black/25 p-4">
    <div className="mb-3 flex items-center justify-between">
      <span className="text-[10px] font-mono text-neon-amber">{marker}</span>
      <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-gray-500">{label}</span>
    </div>
    <div className="flex items-start gap-4">
      <span className="material-symbols-outlined text-4xl text-neon-amber">{item.icon}</span>
      <span>
        <span className="block text-lg font-bold text-white">{item.label}</span>
        <span className="mt-1 block text-xs font-mono leading-relaxed text-gray-500">{item.desc}</span>
      </span>
    </div>
  </div>
);

export default GraduateSetupView;
