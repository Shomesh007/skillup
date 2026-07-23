
import React, { useEffect, useMemo, useState } from 'react';
import { Company, JobOpportunity } from '../types';
import { useAppContext } from '../context/AppContext';

type CompanyDetails = Company & {
  careersPage?: string;
  linkedInUrl?: string;
};

interface Props {
  company: CompanyDetails;
  job?: JobOpportunity | null;
  onBack: () => void;
  onOpenTemplates: () => void;
}

const GUIDE_FALLBACKS: Record<string, string[]> = {
  frontend: ['React fundamentals', 'TypeScript', 'state management', 'API integration', 'responsive UI'],
  backend: ['Node.js or Java APIs', 'databases', 'authentication', 'system design basics', 'testing'],
  full: ['React', 'REST APIs', 'SQL', 'Git', 'deployment basics'],
  data: ['SQL', 'Python', 'Excel or BI dashboards', 'statistics', 'business storytelling'],
  devops: ['Linux', 'Docker', 'CI/CD', 'cloud basics', 'monitoring'],
};

function getJobSkills(job?: JobOpportunity | null) {
  if (job?.skills && job.skills.length > 0) return job.skills;
  const title = job?.title.toLowerCase() || '';
  if (title.includes('frontend')) return GUIDE_FALLBACKS.frontend;
  if (title.includes('backend')) return GUIDE_FALLBACKS.backend;
  if (title.includes('full')) return GUIDE_FALLBACKS.full;
  if (title.includes('data')) return GUIDE_FALLBACKS.data;
  if (title.includes('devops')) return GUIDE_FALLBACKS.devops;
  return ['resume tailoring', 'role fundamentals', 'projects', 'communication', 'interview practice'];
}

function buildFallbackAnalysis(job: JobOpportunity, companyName: string) {
  const skills = getJobSkills(job);
  return [
    `${job.title} at ${companyName} is best prepared as a role-specific application, not a generic resume send.`,
    `Focus your resume around ${skills.slice(0, 3).join(', ')} and show one project or work example that proves each skill.`,
    `For ${job.experience}, keep the story practical: what you built, what changed, and how you measured the result.`,
    `Before applying, prepare a short pitch that connects your background to ${job.company}'s role, location, and ${job.mode.toLowerCase()} work setup.`,
  ].join('\n\n');
}

const GuideView: React.FC<Props> = ({ company, job, onBack, onOpenTemplates }) => {
  const [resumeScore] = useState(87);
  const [copied, setCopied] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { selectedCompany } = useAppContext();
  const displayCompany = selectedCompany || company;
  const targetLabel = job ? `${job.title} at ${job.company}` : displayCompany.name;
  const jobSkills = useMemo(() => getJobSkills(job), [job]);

  useEffect(() => {
    if (!job) {
      setAiAnalysis('');
      return;
    }

    let cancelled = false;
    const generateAnalysis = async () => {
      setIsGenerating(true);
      try {
        const { getChatResponse } = await import('../src/services/azureOpenAI');
        const response = await getChatResponse(
          `Create a concise job readiness guide for this application:
Role: ${job.title}
Company: ${job.company}
Location: ${job.location}
Experience: ${job.experience}
Salary: ${job.salary}
Work mode: ${job.mode}
Description: ${job.description || 'Not available'}
Skills: ${(job.skills || []).join(', ') || 'Not detected'}

Return 4 short paragraphs covering fit, resume keywords, interview preparation, and a 7-day action plan.`
        );
        if (!cancelled) setAiAnalysis(response);
      } catch (error) {
        console.error('Job guide AI generation failed:', error);
        if (!cancelled) setAiAnalysis(buildFallbackAnalysis(job, displayCompany.name));
      } finally {
        if (!cancelled) setIsGenerating(false);
      }
    };

    generateAnalysis();
    return () => {
      cancelled = true;
    };
  }, [displayCompany.name, job]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar">
      <header className="p-6 shrink-0 pt-4 lg:p-8 lg:pb-4">
        <h1 className="text-3xl font-bold mb-1 text-white lg:text-5xl">Get Ready</h1>
        <p className="text-xs text-gray-500 font-mono">Guides for {targetLabel}</p>
      </header>

      <div className="px-6 space-y-10 pb-24 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 lg:px-8 lg:pb-8">
        {job && (
          <section className="lg:col-span-2">
            <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">AI job readiness result</h3>
            <div className="glass-panel rounded-2xl p-5 border-neon-cyan/30">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {[job.location, job.experience, job.salary, job.mode].map((detail) => (
                  <span key={detail} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-mono text-gray-300">
                    {detail}
                  </span>
                ))}
              </div>
              {isGenerating ? (
                <div className="flex items-center gap-3 text-xs font-mono text-neon-cyan">
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  Generating role-specific guidance...
                </div>
              ) : (
                <p className="whitespace-pre-line text-xs leading-relaxed text-gray-300 font-mono">{aiAnalysis}</p>
              )}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">1. Where to apply</h3>
          <div className="grid grid-cols-2 gap-3">
            {job?.linkedinUrl && (
              <a href={job.linkedinUrl} target="_blank" rel="noopener noreferrer" className="glass-panel p-4 rounded-xl text-left hover:bg-white/5 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-neon-cyan mb-2">work</span>
                <div className="text-[10px] font-bold text-white uppercase tracking-wider">LinkedIn Job</div>
                <div className="text-[8px] text-gray-500 mt-1 font-mono">DIRECT APPLY</div>
              </a>
            )}
            {displayCompany.careersPage && (
              <a href={displayCompany.careersPage} target="_blank" rel="noopener noreferrer" className="glass-panel p-4 rounded-xl text-left hover:bg-white/5 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-neon-cyan mb-2">language</span>
                <div className="text-[10px] font-bold text-white uppercase tracking-wider">Careers Page</div>
                <div className="text-[8px] text-gray-500 mt-1 font-mono">OFFICIAL</div>
              </a>
            )}
            {displayCompany.linkedInUrl && (
              <a href={displayCompany.linkedInUrl} target="_blank" rel="noopener noreferrer" className="glass-panel p-4 rounded-xl text-left hover:bg-white/5 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-neon-violet mb-2">link</span>
                <div className="text-[10px] font-bold text-white uppercase tracking-wider">LinkedIn</div>
                <div className="text-[8px] text-gray-500 mt-1 font-mono">NETWORKING</div>
              </a>
            )}
          </div>
        </section>

        {job?.description && (
          <section className="lg:col-span-2">
            <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Job description</h3>
            <div className="glass-panel rounded-2xl p-5">
              <p className="text-xs text-gray-400 font-mono leading-relaxed">{job.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[job.postedAt, job.applicants, job.employmentType, job.seniorityLevel].filter(Boolean).map((item) => (
                  <span key={item} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-mono text-gray-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        <section>
          <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">2. Your Resume</h3>
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-cyan/50 animate-scan"></div>
            
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="text-2xl font-mono font-bold text-neon-cyan">{resumeScore}%</div>
                <div className="text-[8px] text-gray-500 uppercase font-mono tracking-widest">Resume Score</div>
              </div>
              <div className="w-12 h-12 bg-neon-cyan/10 rounded-lg flex items-center justify-center border border-neon-cyan/20">
                <span className="material-symbols-outlined text-neon-cyan">analytics</span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-gray-400 font-mono leading-relaxed">
                Include keywords from {job ? `${job.title}'s requirements` : `${displayCompany.name}'s tech stack and job requirements`}.
              </p>
              {job && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {jobSkills.map((skill) => (
                    <span key={skill} className="rounded-md bg-neon-cyan/10 px-2 py-1 text-[9px] font-mono text-neon-cyan">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                <span className="text-[10px] text-amber-400 font-mono">Add quantified achievements and metrics</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">2b. Use a ready-made template</h3>
          <button
            onClick={onOpenTemplates}
            className="w-full rounded-2xl p-5 border border-cyan-400/20 bg-cyan-400/8 text-left hover:bg-cyan-400/12 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-cyan-300">auto_stories</span>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Open ATS Resume Templates</h4>
                <p className="text-xs text-gray-400 font-mono leading-relaxed">
                  Pick a structure for freshers, internships, or career switchers and copy the text into your resume builder.
                </p>
              </div>
            </div>
          </button>
        </section>

        <section>
          <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">3. Get a Referral</h3>
          <div className="space-y-4">
            <div className="glass-panel p-4 rounded-xl border-l-2 border-l-primary">
              <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">Message Template</h4>
              <p className="text-[10px] text-gray-500 font-mono leading-relaxed bg-black/40 p-3 rounded italic">
                "Hi [Name], I'm interested in the {job?.title || 'role'} at {displayCompany.name} and saw you're working there. I'd love to discuss opportunities..."
              </p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`Hi [Name], I'm interested in the ${job?.title || 'role'} at ${displayCompany.name} and saw you're working there. I'd love to discuss opportunities...`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-[10px] font-mono text-primary font-bold mt-3 hover:text-neon-cyan transition"
              >
                {copied ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
            <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl">
              <span className="material-symbols-outlined text-primary">group</span>
              <span className="text-[10px] font-mono text-primary font-bold tracking-widest">REFERRALS INCREASE CHANCES BY 40%</span>
            </div>
          </div>
        </section>

        <section className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl lg:col-span-2">
          <h3 className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-4">Mistakes to Avoid</h3>
          <ul className="space-y-2">
            {['Generic Resumes', 'Missing Deadlines', 'Poor Email Etiquette', 'Lack of Follow-up'].map(m => (
              <li key={m} className="text-xs text-red-400/80 font-mono flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">block</span> {m}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default GuideView;
