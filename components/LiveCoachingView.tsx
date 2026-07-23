import React from 'react';

const sessions = [
  {
    title: 'Where Should You Apply This Week?',
    coach: 'Career Coach Ananya',
    date: 'Today',
    time: '7:00 PM IST',
    seats: '18 seats left',
    tag: 'Jobs',
    icon: 'work',
    accent: 'text-neon-cyan',
    border: 'border-l-neon-cyan',
  },
  {
    title: 'Cold Outreach and Referral Clinic',
    coach: 'Hiring Mentor Panel',
    date: 'Tomorrow',
    time: '6:30 PM IST',
    seats: '12 seats left',
    tag: 'Outreach',
    icon: 'connect_without_contact',
    accent: 'text-neon-amber',
    border: 'border-l-neon-amber',
  },
  {
    title: 'Build Your 30-Day Job Search Plan',
    coach: 'Placement Strategy Coach',
    date: 'Fri',
    time: '8:00 PM IST',
    seats: '9 seats left',
    tag: 'Plan',
    icon: 'event_note',
    accent: 'text-neon-violet',
    border: 'border-l-neon-violet',
  },
];

const LiveCoachingView: React.FC = () => {
  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar p-6 pt-4 pb-32 lg:p-8 lg:pb-8">
      <header className="mb-6 lg:mb-8">
        <div className="relative overflow-hidden rounded-2xl border border-neon-green/30 bg-[linear-gradient(135deg,rgba(10,255,0,0.12),rgba(19,91,236,0.12),rgba(10,16,31,0.78))] p-5 lg:p-8">
          <div className="absolute right-[-36px] top-[-36px] h-28 w-28 rounded-full border border-neon-green/20"></div>
          <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-neon-green/30 bg-black/30 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-green shadow-[0_0_8px_rgba(10,255,0,1)]"></span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-neon-green">Live</span>
          </div>

          <div className="relative max-w-[260px] lg:max-w-3xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/40">
              <span className="material-symbols-outlined text-3xl text-neon-green">videocam</span>
            </div>
            <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-neon-green">Live Coaching</p>
            <h1 className="mb-3 text-3xl font-bold leading-tight text-white lg:text-5xl">
              Get live guidance for finding and applying to the right jobs.
            </h1>
            <p className="text-sm leading-relaxed text-gray-400 lg:max-w-2xl lg:text-base">
              Join group sessions on job discovery, outreach, referrals, and application strategy, or book focused 1:1 help for your search.
            </p>
          </div>
        </div>
      </header>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="border-l-2 border-neon-cyan pl-3 text-sm font-mono uppercase tracking-widest text-white">
            Upcoming Sessions
          </h2>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">This Week</span>
        </div>

        <div className="space-y-3 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
          {sessions.map((session) => (
            <article
              key={session.title}
              className={`glass-panel rounded-2xl border-l-4 ${session.border} p-4 transition-all hover:-translate-y-0.5 hover:border-white/20 lg:flex lg:min-h-72 lg:flex-col lg:p-5`}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/30">
                    <span className={`material-symbols-outlined text-2xl ${session.accent}`}>{session.icon}</span>
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-bold leading-snug text-white">{session.title}</h3>
                    <p className="text-[10px] font-mono text-gray-500">{session.coach}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-gray-300">
                  {session.tag}
                </span>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-white/5 bg-black/30 p-2">
                  <div className="text-[8px] font-mono uppercase text-gray-600">Date</div>
                  <div className="text-xs text-white">{session.date}</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-black/30 p-2">
                  <div className="text-[8px] font-mono uppercase text-gray-600">Time</div>
                  <div className="text-xs text-white">{session.time}</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-black/30 p-2">
                  <div className="text-[8px] font-mono uppercase text-gray-600">Seats</div>
                  <div className="text-xs text-neon-green">{session.seats}</div>
                </div>
              </div>

              <button className="w-full rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 py-3 text-[10px] font-mono uppercase tracking-widest text-neon-cyan transition-colors hover:bg-neon-cyan/20 lg:mt-auto">
                Join Session
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center lg:gap-8 lg:p-6">
        <div>
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            <span className="material-symbols-outlined text-2xl text-primary">support_agent</span>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-mono uppercase tracking-widest text-primary">Personal Coaching</p>
            <h2 className="text-xl font-bold leading-tight text-white">Book a 1 on 1 live session</h2>
          </div>
        </div>
        <p className="mb-5 text-sm leading-relaxed text-gray-400">
          Get a private session to decide which jobs to apply for, improve your outreach, and turn your profile into a clear weekly action plan.
        </p>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-green to-neon-cyan py-4 text-sm font-bold uppercase tracking-widest text-black shadow-lg shadow-neon-cyan/20 transition-all hover:brightness-110">
          Book 1:1 Session
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </section>
    </div>
  );
};

export default LiveCoachingView;
