import React, { useState } from 'react';
import DecisionCoachCard from './DecisionCoachCard';

interface RoleTitle {
  title: string;
  summary: string;
  skills: string[];
  tools: string[];
  project: string;
  search: string;
  level: 'Starter' | 'Medium' | 'Deep';
}

interface RoleFamily {
  id: string;
  label: string;
  icon: string;
  color: string;
  promise: string;
  titles: RoleTitle[];
}

const families: RoleFamily[] = [
  {
    id: 'dev',
    label: 'Development',
    icon: 'code',
    color: 'text-neon-cyan',
    promise: 'Build apps, services, and product features.',
    titles: [
      { title: 'Frontend Developer', summary: 'Builds the visible part of websites and web apps.', skills: ['HTML/CSS', 'JavaScript', 'React'], tools: ['VS Code', 'Git', 'Chrome DevTools'], project: 'Portfolio with 3 polished UI sections', search: 'frontend intern react', level: 'Starter' },
      { title: 'Backend Developer', summary: 'Builds APIs, databases, auth, and server logic.', skills: ['APIs', 'SQL', 'Node/Java/Python'], tools: ['Postman', 'Git', 'DB client'], project: 'Student task API with login and database', search: 'backend developer intern api', level: 'Medium' },
      { title: 'Full Stack Developer', summary: 'Connects frontend screens with backend systems.', skills: ['React', 'APIs', 'Database'], tools: ['GitHub', 'Vercel', 'Postman'], project: 'Mini job tracker with CRUD and auth', search: 'full stack intern fresher', level: 'Medium' },
      { title: 'Mobile App Developer', summary: 'Builds Android, iOS, or cross-platform mobile apps.', skills: ['UI screens', 'State', 'APIs'], tools: ['Android Studio', 'Flutter', 'Firebase'], project: 'Expense tracker mobile app', search: 'mobile app developer intern', level: 'Medium' },
    ],
  },
  {
    id: 'qa',
    label: 'Testing / QA',
    icon: 'bug_report',
    color: 'text-neon-green',
    promise: 'Protect product quality before users find bugs.',
    titles: [
      { title: 'Manual Tester', summary: 'Tests features by using the app like a real user.', skills: ['Test cases', 'Bug reports', 'SDLC'], tools: ['Jira', 'TestRail', 'Sheets'], project: 'Test 20 flows of a sample shopping app', search: 'manual tester fresher', level: 'Starter' },
      { title: 'QA Analyst', summary: 'Understands requirements and checks product behavior.', skills: ['Requirements', 'Scenarios', 'Reporting'], tools: ['Jira', 'Confluence', 'Postman'], project: 'Requirement-to-test-case portfolio doc', search: 'qa analyst intern', level: 'Starter' },
      { title: 'Automation Tester', summary: 'Writes scripts that repeat tests automatically.', skills: ['Selenium', 'Playwright', 'JavaScript'], tools: ['Playwright', 'GitHub Actions', 'VS Code'], project: 'Automate login and checkout tests', search: 'automation tester intern', level: 'Medium' },
      { title: 'SDET', summary: 'A developer-style tester who builds test frameworks.', skills: ['Coding', 'API tests', 'CI/CD'], tools: ['Playwright', 'Postman', 'GitHub Actions'], project: 'API plus UI test suite in GitHub', search: 'sdet intern fresher', level: 'Deep' },
      { title: 'API Tester', summary: 'Checks backend APIs for correct data and errors.', skills: ['HTTP', 'JSON', 'Assertions'], tools: ['Postman', 'Swagger', 'Newman'], project: 'Postman collection with automated assertions', search: 'api tester fresher', level: 'Starter' },
      { title: 'Performance Tester', summary: 'Checks speed and stability under heavy usage.', skills: ['Load tests', 'Metrics', 'Bottlenecks'], tools: ['JMeter', 'k6', 'Grafana'], project: 'Load test report for a demo API', search: 'performance testing intern', level: 'Deep' },
    ],
  },
  {
    id: 'data',
    label: 'Data / AI',
    icon: 'query_stats',
    color: 'text-neon-amber',
    promise: 'Turn data into answers, models, and decisions.',
    titles: [
      { title: 'Data Analyst', summary: 'Finds insights from data and explains them clearly.', skills: ['SQL', 'Excel', 'Dashboards'], tools: ['Power BI', 'Tableau', 'Sheets'], project: 'Placement trend dashboard', search: 'data analyst intern sql', level: 'Starter' },
      { title: 'Data Engineer', summary: 'Builds pipelines that move and clean data.', skills: ['Python', 'SQL', 'ETL'], tools: ['Airflow', 'BigQuery', 'Spark'], project: 'CSV to database data pipeline', search: 'data engineer intern', level: 'Deep' },
      { title: 'ML Engineer', summary: 'Builds and ships machine learning systems.', skills: ['Python', 'ML basics', 'Evaluation'], tools: ['scikit-learn', 'Jupyter', 'MLflow'], project: 'Predict student placement outcome demo', search: 'machine learning intern', level: 'Deep' },
      { title: 'AI Prompt Engineer', summary: 'Designs reliable AI workflows and prompts.', skills: ['Prompting', 'Evaluation', 'Automation'], tools: ['OpenAI API', 'Sheets', 'Zapier'], project: 'AI resume feedback assistant', search: 'ai intern prompt engineer', level: 'Medium' },
    ],
  },
  {
    id: 'infra',
    label: 'Cloud / Security',
    icon: 'cloud_done',
    color: 'text-cyan-300',
    promise: 'Keep systems fast, reliable, and safe.',
    titles: [
      { title: 'DevOps Engineer', summary: 'Automates build, deploy, and cloud workflows.', skills: ['Linux', 'CI/CD', 'Cloud'], tools: ['Docker', 'GitHub Actions', 'AWS'], project: 'Deploy an app with CI pipeline', search: 'devops intern fresher', level: 'Deep' },
      { title: 'Cloud Engineer', summary: 'Sets up cloud infrastructure and services.', skills: ['Networking', 'Compute', 'Storage'], tools: ['AWS', 'Azure', 'Terraform'], project: 'Host a static app with monitoring', search: 'cloud engineer intern', level: 'Medium' },
      { title: 'SOC Analyst', summary: 'Monitors alerts and investigates security issues.', skills: ['Logs', 'Threats', 'Incident basics'], tools: ['SIEM', 'Wireshark', 'Splunk'], project: 'Analyze sample security logs', search: 'soc analyst fresher', level: 'Starter' },
      { title: 'Cybersecurity Tester', summary: 'Finds security weaknesses before attackers do.', skills: ['OWASP', 'Burp', 'Reports'], tools: ['Burp Suite', 'Kali', 'OWASP ZAP'], project: 'Security test report for a demo app', search: 'security testing intern', level: 'Deep' },
    ],
  },
  {
    id: 'ops',
    label: 'Support / Ops',
    icon: 'support_agent',
    color: 'text-neon-violet',
    promise: 'Help users, systems, and teams run smoothly.',
    titles: [
      { title: 'Technical Support Engineer', summary: 'Solves user and product issues with technical debugging.', skills: ['Troubleshooting', 'SQL basics', 'Communication'], tools: ['Zendesk', 'Logs', 'SQL client'], project: 'Support playbook for common app issues', search: 'technical support engineer fresher', level: 'Starter' },
      { title: 'Application Support Engineer', summary: 'Supports live apps, incidents, and production issues.', skills: ['Logs', 'SQL', 'Monitoring'], tools: ['Grafana', 'Jira', 'Postman'], project: 'Incident report for a demo outage', search: 'application support fresher', level: 'Starter' },
      { title: 'NOC Engineer', summary: 'Monitors networks and systems for uptime.', skills: ['Networking', 'Alerts', 'Escalation'], tools: ['Nagios', 'Zabbix', 'Wireshark'], project: 'Network monitoring checklist', search: 'noc engineer fresher', level: 'Starter' },
    ],
  },
];

interface Props {
  onOpenCoaching: () => void;
}

const StudentRoleExplorerView: React.FC<Props> = ({ onOpenCoaching }) => {
  const [familyId, setFamilyId] = useState(families[1].id);
  const activeFamily = families.find((family) => family.id === familyId) || families[1];
  const [roleTitle, setRoleTitle] = useState(activeFamily.titles[0].title);
  const selectedRole = activeFamily.titles.find((role) => role.title === roleTitle) || activeFamily.titles[0];

  const selectFamily = (id: string) => {
    const nextFamily = families.find((family) => family.id === id) || families[0];
    setFamilyId(id);
    setRoleTitle(nextFamily.titles[0].title);
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-5 pb-32 lg:p-8 lg:pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-neon-cyan/20 bg-[linear-gradient(145deg,rgba(0,240,255,0.12),rgba(10,16,31,0.9)_48%,rgba(0,0,0,0.35))] p-5 lg:p-8">
        <div className="absolute right-[-4rem] top-[-5rem] h-56 w-56 rounded-full bg-neon-cyan/10 blur-3xl"></div>
        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-cyan/20 bg-black/25 px-3 py-1">
            <span className="material-symbols-outlined text-sm text-neon-cyan">travel_explore</span>
            <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-neon-cyan">Explore first</span>
          </div>
          <h1 className="text-3xl font-bold leading-none text-white lg:text-6xl">Explore IT careers without guessing.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
            Pick a family, scan exact titles, then open one role to see what it does, what to learn, and what to search for.
          </p>
        </div>
      </section>

      <section className="mt-5">
        <DecisionCoachCard
          accent="cyan"
          eyebrow="Confused between IT titles?"
          desc="Use a 1-on-1 session to compare roles, difficulty, projects, and what fits your strengths."
          onOpenCoaching={onOpenCoaching}
        />
      </section>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[10px] font-mono uppercase tracking-[0.24em] text-gray-400">Role families</h2>
          <span className="text-[10px] font-mono text-neon-cyan">{activeFamily.titles.length} titles</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar lg:grid lg:grid-cols-5 lg:overflow-visible">
          {families.map((family) => (
            <button
              key={family.id}
              onClick={() => selectFamily(family.id)}
              className={`min-w-[150px] rounded-2xl border p-3 text-left transition-all lg:min-w-0 ${
                family.id === familyId ? 'border-neon-cyan/50 bg-neon-cyan/10' : 'border-white/10 bg-black/25'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${family.color}`}>{family.icon}</span>
              <span className="mt-2 block text-sm font-bold text-white">{family.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-4">
            <div className={`material-symbols-outlined mb-3 text-4xl ${activeFamily.color}`}>{activeFamily.icon}</div>
            <h2 className="text-2xl font-bold text-white">{activeFamily.label}</h2>
            <p className="mt-2 text-xs font-mono leading-relaxed text-gray-500">{activeFamily.promise}</p>
          </div>
          <div className="space-y-2">
            {activeFamily.titles.map((role) => (
              <button
                key={role.title}
                onClick={() => setRoleTitle(role.title)}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition-all ${
                  role.title === selectedRole.title ? 'border-neon-cyan/40 bg-neon-cyan/10' : 'border-white/5 bg-black/20'
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-white">{role.title}</span>
                  <span className="block truncate text-[10px] font-mono text-gray-500">{role.summary}</span>
                </span>
                <span className="shrink-0 rounded-full border border-white/10 px-2 py-1 text-[9px] font-mono text-gray-500">{role.level}</span>
              </button>
            ))}
          </div>
        </div>

        <RoleDetail role={selectedRole} />
      </section>
    </div>
  );
};

const RoleDetail: React.FC<{ role: RoleTitle }> = ({ role }) => (
  <article className="rounded-[1.75rem] border border-neon-cyan/20 bg-black/25 p-4 lg:p-5">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-neon-cyan">Selected title</span>
        <h2 className="mt-2 text-2xl font-bold leading-tight text-white">{role.title}</h2>
      </div>
      <span className="rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-1 text-[10px] font-mono text-neon-cyan">{role.level}</span>
    </div>

    <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-gray-300">{role.summary}</p>

    <div className="mt-4 grid gap-3 lg:grid-cols-2">
      <MiniPanel label="Skills" items={role.skills} icon="psychology" />
      <MiniPanel label="Tools" items={role.tools} icon="construction" />
    </div>

    <div className="mt-4 grid gap-3">
      <AdviceRow icon="assignment" label="Student project" value={role.project} />
      <AdviceRow icon="search" label="Internship keywords" value={role.search} />
      <AdviceRow icon="trending_up" label="Next career move" value={`Learn basics, build proof, then compare ${role.title} with nearby titles.`} />
    </div>
  </article>
);

const MiniPanel: React.FC<{ label: string; items: string[]; icon: string }> = ({ label, items, icon }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
    <div className="mb-3 flex items-center gap-2">
      <span className="material-symbols-outlined text-lg text-neon-cyan">{icon}</span>
      <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">{label}</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[10px] font-mono text-gray-300">{item}</span>
      ))}
    </div>
  </div>
);

const AdviceRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
    <span className="material-symbols-outlined text-xl text-neon-green">{icon}</span>
    <span>
      <span className="block text-[9px] font-mono uppercase tracking-widest text-gray-500">{label}</span>
      <span className="mt-1 block text-sm font-semibold leading-snug text-white">{value}</span>
    </span>
  </div>
);

export default StudentRoleExplorerView;
