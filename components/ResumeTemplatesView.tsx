import React, { useMemo, useState } from 'react';
import { Company } from '../types';
import { useAppContext } from '../context/AppContext';

interface Props {
  company: Company;
}

type TemplateId = 'starter' | 'internship' | 'switcher';

interface TemplateCard {
  id: TemplateId;
  title: string;
  subtitle: string;
  idealFor: string;
  strength: string;
  sections: string[];
  keywords: string[];
  summary: string;
}

const templates: TemplateCard[] = [
  {
    id: 'starter',
    title: 'Campus Starter',
    subtitle: 'Best for students and fresh graduates',
    idealFor: 'Zero-to-one resumes with projects, internships, and certifications.',
    strength: 'Simple, keyword-rich, and easy for ATS parsers to scan.',
    sections: ['Header', 'Summary', 'Education', 'Projects', 'Skills', 'Certifications'],
    keywords: ['Python', 'Java', 'SQL', 'Git', 'Problem Solving', 'Teamwork'],
    summary:
      'Recent computer science student building practical projects in web development, data structures, and cloud basics. Comfortable with collaborative tools and eager to contribute to product teams.',
  },
  {
    id: 'internship',
    title: 'Internship Sprint',
    subtitle: 'Best for internship and early-career applications',
    idealFor: 'Students with internships, hackathons, and measurable project outcomes.',
    strength: 'Highlights impact, metrics, and relevant course work without extra design noise.',
    sections: ['Header', 'Objective', 'Experience', 'Projects', 'Achievements', 'Skills'],
    keywords: ['React', 'Node.js', 'API', 'Agile', 'Analytics', 'Debugging'],
    summary:
      'Motivated early-career candidate who has shipped small features, improved workflows, and worked across product and engineering tasks during internships and college projects.',
  },
  {
    id: 'switcher',
    title: 'Career Switcher',
    subtitle: 'Best for graduates changing domains',
    idealFor: 'Students or graduates moving into tech from another field.',
    strength: 'Focuses on transferable skills, coursework, and role-aligned projects.',
    sections: ['Header', 'Profile', 'Transferable Skills', 'Projects', 'Training', 'Tools'],
    keywords: ['Learning Agility', 'Communication', 'Python', 'Excel', 'Testing', 'Automation'],
    summary:
      'Career switcher with strong communication and process skills, now focused on building technical depth through structured learning, practice projects, and hands-on tools.',
  },
];

const ATS_RULES = [
  'Use a clean single-column layout with standard headings.',
  'Keep text as text, not icons or graphics inside the resume body.',
  'Match job keywords naturally in summary, skills, and project bullets.',
  'Use measurable outcomes wherever possible.',
  'Export to PDF only after checking the file stays text-readable.',
];

const ResumeTemplatesView: React.FC<Props> = ({ company }) => {
  const { selectedCompany } = useAppContext();
  const displayCompany = selectedCompany || company;
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('starter');
  const [copied, setCopied] = useState(false);

  const currentTemplate = useMemo(
    () => templates.find((template) => template.id === activeTemplate) || templates[0],
    [activeTemplate]
  );

  const buildTemplateText = (template: TemplateCard) => {
    return [
      'FULL NAME',
      'Email | Phone | LinkedIn | Portfolio',
      '',
      template.title.toUpperCase(),
      template.summary,
      '',
      'EDUCATION',
      'Degree, College, Year | CGPA or Percentage',
      '',
      'PROJECTS',
      '- Project name: what you built, tools used, measurable result.',
      '- Project name: add 1-2 impact bullets and relevant keywords.',
      '',
      'SKILLS',
      template.keywords.join(' | '),
      '',
      'EXPERIENCE',
      '- Internship or freelance role with quantified achievements.',
    ].join('\n');
  };

  const copyTemplate = async () => {
    await navigator.clipboard.writeText(buildTemplateText(currentTemplate));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex-1 h-full flex flex-col overflow-y-auto no-scrollbar relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(19,91,236,0.22),transparent_72%)]"></div>
        <div className="absolute -right-24 top-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl"></div>
        <div className="absolute -left-20 bottom-24 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 pt-4 pb-32 lg:p-8 lg:pb-8">
        <header className="mb-8 lg:max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300/80 font-mono mb-3">Resume toolkit</p>
          <h1 className="text-3xl font-bold leading-tight text-white mb-3 lg:text-5xl">
            ATS-friendly templates for
            <br />
            students who want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-amber-300">get shortlisted</span>
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            Pick a clean template, copy the structure, and tailor it for {displayCompany.name || 'each job'} without adding design clutter that breaks ATS scans.
          </p>
        </header>

        <section className="mb-8 grid grid-cols-3 gap-3 lg:max-w-3xl">
          {[
            { value: '3', label: 'Templates' },
            { value: 'ATS', label: 'Safe Format' },
            { value: '1', label: 'Copy Action' },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel rounded-2xl p-4 border border-white/10">
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-[9px] uppercase tracking-[0.28em] text-gray-500 font-mono">{stat.label}</div>
            </div>
          ))}
        </section>

        <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6 lg:items-start">
        <section className="space-y-4 mb-8 lg:sticky lg:top-0">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-mono">Choose a template</h2>
          <div className="space-y-3">
            {templates.map((template) => {
              const active = template.id === activeTemplate;
              return (
                <button
                  key={template.id}
                  onClick={() => setActiveTemplate(template.id)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all ${
                    active
                      ? 'border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2 h-2 rounded-full ${active ? 'bg-cyan-300' : 'bg-gray-500'}`}></span>
                        <h3 className="text-base font-bold text-white">{template.title}</h3>
                      </div>
                      <p className="text-xs text-gray-400 font-mono">{template.subtitle}</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-500">description</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="glass-panel rounded-3xl border border-white/10 p-5 mb-8 relative overflow-hidden lg:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-300"></div>
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/70 font-mono mb-2">Preview</p>
              <h2 className="text-2xl font-bold text-white">{currentTemplate.title}</h2>
              <p className="text-xs text-gray-400 mt-1">{currentTemplate.idealFor}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-cyan-300">check_circle</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-black/30 border border-white/5 p-4">
              <div className="text-[10px] uppercase tracking-[0.28em] text-gray-500 font-mono mb-2">Professional summary</div>
              <p className="text-sm text-gray-300 leading-relaxed">{currentTemplate.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-gray-500 font-mono mb-2">Sections</div>
                <div className="flex flex-wrap gap-2">
                  {currentTemplate.sections.map((section) => (
                    <span key={section} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {section}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-gray-500 font-mono mb-2">Keywords</div>
                <div className="flex flex-wrap gap-2">
                  {currentTemplate.keywords.map((keyword) => (
                    <span key={keyword} className="text-[10px] px-2 py-1 rounded-full bg-cyan-400/10 text-cyan-200 border border-cyan-400/20">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-amber-400/5 border border-amber-400/15 p-4">
              <div className="text-[10px] uppercase tracking-[0.28em] text-amber-200/70 font-mono mb-2">Why it works</div>
              <p className="text-sm text-gray-300 leading-relaxed">{currentTemplate.strength}</p>
            </div>

            <button
              onClick={copyTemplate}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all"
            >
              {copied ? 'COPIED TO CLIPBOARD' : 'COPY TEMPLATE STRUCTURE'}
            </button>
          </div>
        </section>

        </div>
        <section className="space-y-4 lg:max-w-5xl">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-mono">ATS rules</h2>
            <span className="text-[10px] text-cyan-300 font-mono">Keep it simple</span>
          </div>
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
            {ATS_RULES.map((rule, index) => (
              <div key={rule} className="flex gap-3 items-start rounded-2xl bg-white/5 border border-white/5 p-4">
                <div className="w-7 h-7 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-xs font-bold text-cyan-300 shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-cyan-400/5 p-5">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-cyan-300 text-2xl">rocket_launch</span>
            <div>
              <h3 className="font-bold text-white mb-1">Use this with your target role</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Tailor the summary and skills section to each application, then align one project bullet to the job description before you submit.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResumeTemplatesView;
