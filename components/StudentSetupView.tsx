import React, { useState } from 'react';

export interface StudentSetupProfile {
  stage: string;
  goal: string;
  interest: string;
}

interface Props {
  onComplete: (profile: StudentSetupProfile) => void;
  onBack: () => void;
}

interface Choice {
  id: string;
  label: string;
  desc: string;
  icon: string;
}

const stageOptions = [
  { id: 'first-year', label: '1st / 2nd Year', desc: 'Explore IT roles, learn basics, and build your first project habits', icon: 'looks_one' },
  { id: 'pre-final', label: 'Pre-final Year', desc: 'Build internship-ready skills, proof projects, and a stronger profile', icon: 'timeline' },
  { id: 'final-year', label: 'Final Year', desc: 'Prepare applications, interviews, company lists, and placement strategy', icon: 'school' },
];

const goalOptions = [
  { id: 'explore', label: 'Explore IT Roles', desc: 'Find what fits before committing to a track or job title', icon: 'travel_explore' },
  { id: 'internship', label: 'Get Internship Ready', desc: 'Projects, resume, LinkedIn, and application rhythm for internships', icon: 'work_history' },
  { id: 'placement', label: 'Crack Placements', desc: 'DSA, aptitude, interviews, resume, and company preparation', icon: 'workspace_premium' },
];

const interestOptions = [
  { id: 'software', label: 'Software Development', desc: 'Frontend, backend, full stack, mobile, cloud, and product engineering', icon: 'code' },
  { id: 'testing', label: 'Testing and QA', desc: 'Manual QA, automation QA, SDET, API testing, and security testing', icon: 'bug_report' },
  { id: 'data', label: 'Data and AI', desc: 'Analytics, data engineering, machine learning, AI, and prompt engineering', icon: 'query_stats' },
  { id: 'infra', label: 'Cloud and Security', desc: 'DevOps, SRE, cloud engineering, SOC, cyber security, and infrastructure', icon: 'cloud_done' },
];

const steps = [
  {
    marker: '01',
    eyebrow: 'Student path scan',
    title: 'Where are you right now?',
    desc: 'This helps us decide whether to focus on exploration, internships, or placement preparation first.',
    field: 'stage' as const,
    options: stageOptions,
  },
  {
    marker: '02',
    eyebrow: 'Next priority',
    title: 'What should SkillUp optimize for first?',
    desc: 'Students need different guidance depending on whether they are exploring, building proof, or preparing for offers.',
    field: 'goal' as const,
    options: goalOptions,
  },
  {
    marker: '03',
    eyebrow: 'IT direction',
    title: 'Which IT direction are you curious about?',
    desc: 'We will still show all IT job titles, but this gives your dashboard a smart starting point.',
    field: 'interest' as const,
    options: interestOptions,
  },
];

const getChoice = (options: Choice[], id: string) => options.find((item) => item.id === id) || options[0];

const StudentSetupView: React.FC<Props> = ({ onComplete, onBack }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<StudentSetupProfile>({
    stage: stageOptions[1].id,
    goal: goalOptions[1].id,
    interest: interestOptions[0].id,
  });

  const isReview = stepIndex === steps.length;
  const activeStep = steps[Math.min(stepIndex, steps.length - 1)];
  const selectedValue = profile[activeStep.field];
  const selectedStage = getChoice(stageOptions, profile.stage);
  const selectedGoal = getChoice(goalOptions, profile.goal);
  const selectedInterest = getChoice(interestOptions, profile.interest);

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
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.22em] text-gray-300 transition-colors hover:border-neon-cyan/40 hover:text-neon-cyan"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            {stepIndex === 0 ? 'Change stage' : 'Back'}
          </button>
          <span className="rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-neon-cyan">
            {isReview ? 'Review' : `${activeStep.marker} / 03`}
          </span>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-1.5 rounded-full transition-all ${
                item <= stepIndex ? 'bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.7)]' : 'bg-white/10'
              }`}
            ></div>
          ))}
        </div>

        <section className="relative flex-1 overflow-hidden rounded-[2.25rem] border border-neon-cyan/20 bg-[radial-gradient(circle_at_18%_0%,rgba(0,240,255,0.18),transparent_32%),linear-gradient(135deg,rgba(10,16,31,0.94),rgba(3,8,18,0.78))] p-5 shadow-2xl shadow-black/30 lg:p-8">
          <div className="absolute right-[-7rem] top-[-7rem] h-72 w-72 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 blur-sm"></div>
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent"></div>
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px]"></div>

          {!isReview ? (
            <div className="relative z-10 grid min-h-[540px] gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-green/20 bg-neon-green/10 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-green shadow-[0_0_10px_rgba(10,255,0,1)]"></span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-green">{activeStep.eyebrow}</span>
                </div>
                <h1 className="text-4xl font-bold leading-[0.95] text-white lg:text-6xl">{activeStep.title}</h1>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-400">{activeStep.desc}</p>

                <div className="mt-8 hidden rounded-3xl border border-white/10 bg-black/25 p-4 lg:block">
                  <div className="mb-3 text-[10px] font-mono uppercase tracking-[0.22em] text-gray-500">Already selected</div>
                  <div className="space-y-2">
                    <SummaryRow label="Stage" value={selectedStage.label} active={activeStep.field === 'stage'} />
                    <SummaryRow label="Goal" value={selectedGoal.label} active={activeStep.field === 'goal'} />
                    <SummaryRow label="Direction" value={selectedInterest.label} active={activeStep.field === 'interest'} />
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {activeStep.options.map((item) => (
                  <ChoiceButton
                    key={item.id}
                    item={item}
                    active={selectedValue === item.id}
                    onClick={() => setProfile((current) => ({ ...current, [activeStep.field]: item.id }))}
                  />
                ))}
              </div>
            </div>
          ) : (
            <ReviewScreen stage={selectedStage} goal={selectedGoal} interest={selectedInterest} />
          )}
        </section>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={goBack}
            className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-[10px] font-mono uppercase tracking-widest text-gray-400 transition-colors hover:text-white lg:inline-flex"
          >
            Back
          </button>
          <button
            onClick={goNext}
            className="group relative flex flex-1 items-center justify-between overflow-hidden rounded-3xl border border-neon-cyan/40 bg-neon-cyan/10 px-5 py-5 text-left transition-all hover:-translate-y-1 hover:bg-neon-cyan/15 active:scale-[0.99]"
          >
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-neon-cyan/25 to-transparent opacity-70 transition-transform duration-500 group-hover:translate-x-full"></div>
            <span className="relative">
              <span className="block text-[10px] font-mono uppercase tracking-[0.24em] text-neon-cyan">
                {isReview ? 'Generate student workspace' : 'Continue setup'}
              </span>
              <span className="mt-1 block text-xl font-bold text-white">{isReview ? 'Start my guided path' : 'Next question'}</span>
            </span>
            <span className="material-symbols-outlined relative text-3xl text-neon-cyan transition-transform group-hover:translate-x-1">
              {isReview ? 'auto_awesome' : 'arrow_forward'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const SummaryRow: React.FC<{ label: string; value: string; active: boolean }> = ({ label, value, active }) => (
  <div className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 ${active ? 'border-neon-cyan/30 bg-neon-cyan/10' : 'border-white/5 bg-white/[0.03]'}`}>
    <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500">{label}</span>
    <span className={`truncate text-xs font-semibold ${active ? 'text-neon-cyan' : 'text-white'}`}>{value}</span>
  </div>
);

const ChoiceButton: React.FC<{ item: Choice; active: boolean; onClick: () => void }> = ({ item, active, onClick }) => (
  <button
    onClick={onClick}
    className={`group min-h-32 rounded-3xl border p-4 text-left transition-all hover:-translate-y-1 active:scale-[0.98] lg:min-h-36 lg:p-5 ${
      active
        ? 'border-neon-cyan/50 bg-neon-cyan/10 shadow-[inset_0_0_28px_rgba(0,240,255,0.08)]'
        : 'border-white/10 bg-black/25 hover:border-white/20 hover:bg-white/[0.05]'
    }`}
  >
    <div className="mb-4 flex items-center justify-between">
      <span className={`material-symbols-outlined text-4xl ${active ? 'text-neon-cyan text-neon' : 'text-gray-500 group-hover:text-neon-cyan'}`}>
        {item.icon}
      </span>
      <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-mono ${
        active ? 'border-neon-cyan/40 bg-neon-cyan/15 text-neon-cyan' : 'border-white/10 text-gray-600'
      }`}>
        {active ? 'ON' : ''}
      </span>
    </div>
    <h3 className="text-lg font-bold text-white">{item.label}</h3>
    <p className="mt-2 text-xs font-mono leading-relaxed text-gray-500">{item.desc}</p>
  </button>
);

const ReviewScreen: React.FC<{ stage: Choice; goal: Choice; interest: Choice }> = ({ stage, goal, interest }) => (
  <div className="relative z-10 grid min-h-[540px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
    <div>
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-green/20 bg-neon-green/10 px-3 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-neon-green shadow-[0_0_10px_rgba(10,255,0,1)]"></span>
        <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-green">Ready to launch</span>
      </div>
      <h1 className="text-4xl font-bold leading-[0.95] text-white lg:text-6xl">Your Student Home is ready.</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-400">
        This creates a focused student workspace first. From there, students can explore exact IT roles, build projects, find internships, improve resumes, and prep interviews.
      </p>
    </div>

    <div className="space-y-3">
      <ReviewCard marker="01" item={stage} label="Current stage" />
      <ReviewCard marker="02" item={goal} label="Main goal" />
      <ReviewCard marker="03" item={interest} label="Starting direction" />
    </div>
  </div>
);

const ReviewCard: React.FC<{ marker: string; item: Choice; label: string }> = ({ marker, item, label }) => (
  <div className="rounded-3xl border border-neon-cyan/20 bg-black/25 p-4">
    <div className="mb-3 flex items-center justify-between">
      <span className="text-[10px] font-mono text-neon-cyan">{marker}</span>
      <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-gray-500">{label}</span>
    </div>
    <div className="flex items-start gap-4">
      <span className="material-symbols-outlined text-4xl text-neon-cyan">{item.icon}</span>
      <span>
        <span className="block text-lg font-bold text-white">{item.label}</span>
        <span className="mt-1 block text-xs font-mono leading-relaxed text-gray-500">{item.desc}</span>
      </span>
    </div>
  </div>
);

export default StudentSetupView;
