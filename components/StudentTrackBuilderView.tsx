import React, { useState } from 'react';
import DecisionCoachCard from './DecisionCoachCard';

interface Track {
  id: string;
  title: string;
  icon: string;
  accent: string;
  bestFor: string;
  outcome: string;
  weeks: string[];
  tools: string[];
  proof: string;
  resume: string;
  avoid: string;
}

const tracks: Track[] = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    icon: 'web',
    accent: 'text-neon-cyan',
    bestFor: 'Students who like visual building and instant feedback.',
    outcome: 'A polished portfolio project with responsive UI.',
    weeks: ['HTML/CSS plus layout basics', 'JavaScript interactions', 'React components', 'Deploy and write resume bullets'],
    tools: ['VS Code', 'React', 'GitHub', 'Vercel'],
    proof: 'Build a campus events dashboard with filters and detail pages.',
    resume: 'Built a responsive React dashboard with reusable components, filters, and deployed demo.',
    avoid: 'Do not collect tutorials without shipping a small finished app.',
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    icon: 'dns',
    accent: 'text-cyan-300',
    bestFor: 'Students who enjoy logic, APIs, databases, and systems.',
    outcome: 'A working API with database and authentication basics.',
    weeks: ['HTTP and API basics', 'Database tables and queries', 'Auth and validation', 'Postman docs plus deployment'],
    tools: ['Node or Java', 'Postman', 'SQL', 'Render'],
    proof: 'Build a student task API with login, CRUD, and search.',
    resume: 'Created REST APIs with authentication, database persistence, and Postman documentation.',
    avoid: 'Do not skip database practice; backend needs data confidence.',
  },
  {
    id: 'qa-auto',
    title: 'QA Automation',
    icon: 'bug_report',
    accent: 'text-neon-green',
    bestFor: 'Students who like breaking apps, patterns, and quality.',
    outcome: 'A visible test automation repo recruiters can open.',
    weeks: ['Manual test cases', 'Bug reports and test data', 'Playwright or Selenium scripts', 'CI run plus test report'],
    tools: ['Playwright', 'Postman', 'GitHub Actions', 'Jira'],
    proof: 'Automate login, search, checkout, and error tests for a sample app.',
    resume: 'Automated key UI and API flows using Playwright/Postman with CI test execution.',
    avoid: 'Do not say only "testing"; show cases, bugs, scripts, and reports.',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    icon: 'bar_chart',
    accent: 'text-neon-amber',
    bestFor: 'Students who like numbers, patterns, dashboards, and stories.',
    outcome: 'A dashboard and short insight report.',
    weeks: ['Excel/Sheets cleanup', 'SQL basics', 'Dashboard charts', 'Insights and portfolio writeup'],
    tools: ['SQL', 'Power BI', 'Sheets', 'Kaggle'],
    proof: 'Analyze placement or job market data and publish a dashboard.',
    resume: 'Analyzed dataset using SQL and Power BI to identify trends and actionable insights.',
    avoid: 'Do not only show charts; explain what decision your chart supports.',
  },
  {
    id: 'devops',
    title: 'DevOps Beginner',
    icon: 'deployed_code',
    accent: 'text-neon-violet',
    bestFor: 'Students who like deployment, automation, cloud, and Linux.',
    outcome: 'A deployed app with CI pipeline and simple monitoring notes.',
    weeks: ['Linux and Git basics', 'Dockerize a small app', 'CI/CD with GitHub Actions', 'Deploy and monitor'],
    tools: ['Linux', 'Docker', 'GitHub Actions', 'AWS or Render'],
    proof: 'Containerize and auto-deploy a simple web app.',
    resume: 'Implemented Docker-based deployment and CI/CD workflow for a web application.',
    avoid: 'Do not jump to Kubernetes before understanding Linux, Docker, and CI.',
  },
];

interface Props {
  onOpenCoaching: () => void;
}

const StudentTrackBuilderView: React.FC<Props> = ({ onOpenCoaching }) => {
  const [trackId, setTrackId] = useState(tracks[2].id);
  const selectedTrack = tracks.find((track) => track.id === trackId) || tracks[0];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-5 pb-32 lg:p-8 lg:pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-neon-green/20 bg-[linear-gradient(145deg,rgba(10,255,0,0.11),rgba(10,16,31,0.9)_44%,rgba(19,91,236,0.12))] p-5 lg:p-8">
        <div className="absolute right-[-5rem] top-[-5rem] h-60 w-60 rounded-full bg-neon-green/10 blur-3xl"></div>
        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-green/20 bg-black/25 px-3 py-1">
            <span className="material-symbols-outlined text-sm text-neon-green">route</span>
            <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-green">Build proof</span>
          </div>
          <h1 className="text-3xl font-bold leading-none text-white lg:text-6xl">Pick one track. Build visible proof.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
            This is not career exploration. This is the execution plan: what to learn, what to build, and how to turn it into resume proof.
          </p>
        </div>
      </section>

      <section className="mt-5">
        <DecisionCoachCard
          accent="green"
          eyebrow="Not sure which track to build?"
          desc="Book a 1-on-1 session to choose the right project path and avoid building something that will not help your resume."
          onOpenCoaching={onOpenCoaching}
        />
      </section>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[10px] font-mono uppercase tracking-[0.24em] text-gray-400">Choose a build track</h2>
          <span className="text-[10px] font-mono text-neon-green">4 week sprint</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar lg:grid lg:grid-cols-5 lg:overflow-visible">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => setTrackId(track.id)}
              className={`min-w-[150px] rounded-2xl border p-3 text-left transition-all lg:min-w-0 ${
                track.id === trackId ? 'border-neon-green/50 bg-neon-green/10' : 'border-white/10 bg-black/25'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${track.accent}`}>{track.icon}</span>
              <span className="mt-2 block text-sm font-bold text-white">{track.title}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <aside className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4">
          <div className={`material-symbols-outlined mb-3 text-4xl ${selectedTrack.accent}`}>{selectedTrack.icon}</div>
          <h2 className="text-2xl font-bold text-white">{selectedTrack.title}</h2>
          <p className="mt-2 text-xs font-mono leading-relaxed text-gray-500">{selectedTrack.bestFor}</p>

          <div className="mt-5 space-y-3">
            <InfoTile icon="emoji_events" label="Outcome" value={selectedTrack.outcome} />
            <InfoTile icon="assignment" label="Project proof" value={selectedTrack.proof} />
            <InfoTile icon="warning" label="Avoid" value={selectedTrack.avoid} />
          </div>
        </aside>

        <div className="space-y-4">
          <div className="rounded-[1.75rem] border border-neon-green/20 bg-black/25 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-mono uppercase tracking-[0.18em] text-white">Sprint plan</h3>
              <span className="text-[10px] font-mono text-neon-green">Short and finishable</span>
            </div>
            <div className="grid gap-3 lg:grid-cols-4">
              {selectedTrack.weeks.map((week, index) => (
                <div key={week} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <span className="mb-3 block text-[10px] font-mono text-neon-green">Week {index + 1}</span>
                  <p className="text-sm font-semibold leading-snug text-white">{week}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4">
              <h3 className="mb-3 text-sm font-mono uppercase tracking-[0.18em] text-white">Tools to start</h3>
              <div className="flex flex-wrap gap-2">
                {selectedTrack.tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[10px] font-mono text-gray-300">{tool}</span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-neon-cyan/20 bg-neon-cyan/10 p-4">
              <h3 className="mb-3 text-sm font-mono uppercase tracking-[0.18em] text-white">Resume bullet</h3>
              <p className="text-sm font-semibold leading-relaxed text-white">{selectedTrack.resume}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const InfoTile: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
    <span className="material-symbols-outlined text-xl text-neon-green">{icon}</span>
    <span>
      <span className="block text-[9px] font-mono uppercase tracking-widest text-gray-500">{label}</span>
      <span className="mt-1 block text-sm font-semibold leading-snug text-white">{value}</span>
    </span>
  </div>
);

export default StudentTrackBuilderView;
