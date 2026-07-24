import React from 'react';

interface Props {
  eyebrow?: string;
  title?: string;
  desc?: string;
  accent?: 'cyan' | 'amber' | 'green' | 'violet';
  compact?: boolean;
  onOpenCoaching: () => void;
}

const accentStyles = {
  cyan: {
    border: 'border-neon-cyan/30',
    bg: 'bg-neon-cyan/10',
    text: 'text-neon-cyan',
    glow: 'bg-neon-cyan/20',
  },
  amber: {
    border: 'border-neon-amber/30',
    bg: 'bg-neon-amber/10',
    text: 'text-neon-amber',
    glow: 'bg-neon-amber/20',
  },
  green: {
    border: 'border-neon-green/30',
    bg: 'bg-neon-green/10',
    text: 'text-neon-green',
    glow: 'bg-neon-green/20',
  },
  violet: {
    border: 'border-neon-violet/30',
    bg: 'bg-neon-violet/10',
    text: 'text-neon-violet',
    glow: 'bg-neon-violet/20',
  },
};

const DecisionCoachCard: React.FC<Props> = ({
  eyebrow = 'Need help deciding?',
  title = 'Book a 1-on-1 live guidance session',
  desc = 'Talk through your options with a coach before choosing a role, track, resume direction, or job-search plan.',
  accent = 'cyan',
  compact,
  onOpenCoaching,
}) => {
  const style = accentStyles[accent];

  return (
    <button
      onClick={onOpenCoaching}
      className={`group relative w-full overflow-hidden rounded-[1.75rem] border ${style.border} ${style.bg} p-4 text-left transition-all hover:-translate-y-1 active:scale-[0.99] ${compact ? 'lg:p-4' : 'lg:p-5'}`}
    >
      <div className={`absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full ${style.glow} blur-2xl`}></div>
      <div className="relative flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${style.border} bg-black/25`}>
          <span className={`material-symbols-outlined text-2xl ${style.text}`}>videocam</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className={`mb-1 text-[9px] font-mono uppercase tracking-[0.24em] ${style.text}`}>{eyebrow}</div>
          <h3 className="text-base font-bold leading-tight text-white lg:text-lg">{title}</h3>
          <p className="mt-2 text-xs font-mono leading-relaxed text-gray-400">{desc}</p>
        </div>
        <span className={`material-symbols-outlined shrink-0 text-2xl ${style.text} transition-transform group-hover:translate-x-1`}>arrow_forward</span>
      </div>
    </button>
  );
};

export default DecisionCoachCard;
