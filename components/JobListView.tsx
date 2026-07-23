
import React, { useState } from 'react';
import { JobOpportunity } from '../types';
import { LINKEDIN_JOBS } from '../src/data/linkedinJobs';

interface Props {
  role?: string;
  companyName?: string;
  onSelectJob: (job: JobOpportunity) => void;
  onBack: () => void;
}

const mockJobs: JobOpportunity[] = [
  {
    id: 1,
    title: 'Full Stack Developer',
    company: 'TCS',
    location: 'Bangalore, India',
    experience: '0-2 Years',
    salary: '6-10 LPA',
    mode: 'Hybrid'
  },
  {
    id: 2,
    title: 'Frontend Engineer',
    company: 'Microsoft',
    location: 'Hyderabad, India',
    experience: '1-3 Years',
    salary: '12-18 LPA',
    mode: 'On-site'
  },
  {
    id: 3,
    title: 'Backend Developer',
    company: 'Amazon',
    location: 'Bangalore, India',
    experience: '2-4 Years',
    salary: '16-25 LPA',
    mode: 'On-site'
  },
  {
    id: 4,
    title: 'Data Analyst',
    company: 'Google',
    location: 'Remote',
    experience: '1-3 Years',
    salary: '14-22 LPA',
    mode: 'Remote'
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'Infosys',
    location: 'Pune, India',
    experience: '2-5 Years',
    salary: '10-16 LPA',
    mode: 'Hybrid'
  },
];

const JobListView: React.FC<Props> = ({ role, companyName, onSelectJob, onBack }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const displayRole = role || 'Technology';
  const jobs = LINKEDIN_JOBS.length > 0 ? LINKEDIN_JOBS : mockJobs;

  const filteredJobs = jobs.filter(job => {
    // Filter by company if companyName is provided
    if (companyName && job.company.toLowerCase() !== companyName.toLowerCase()) {
      return false;
    }
    
    // Apply other filters
    if (selectedFilters.length === 0) return true;
    return selectedFilters.some(filter => 
      filter === 'Remote' ? job.mode === 'Remote' : 
      filter === 'Hybrid' ? job.mode === 'Hybrid' : 
      filter === 'Entry' ? job.experience.includes('0-2') || job.experience.includes('1-3') :
      true
    );
  });

  const openJobDetails = (job: JobOpportunity) => {
    if (job.linkedinUrl) {
      window.open(job.linkedinUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    onSelectJob(job);
  };

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden relative">
      <header className="pt-4 pb-2 px-6 shrink-0 z-20 lg:px-8 lg:pt-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white leading-tight lg:text-4xl">
              {companyName || displayRole} <br/><span className="font-light text-gray-400">Jobs</span>
            </h1>
          </div>
          <div className="glass-panel px-3 py-1.5 rounded-lg border-l-2 border-neon-cyan flex flex-col items-end">
            <span className="text-2xl font-mono font-bold text-neon-cyan text-neon leading-none">{filteredJobs.length}</span>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Openings</span>
          </div>
        </div>
        
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {['Entry Level', 'Remote', 'Hybrid'].map(filter => (
            <button 
              key={filter}
              onClick={() => setSelectedFilters(prev => 
                prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
              )}
              className={`glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-xs whitespace-nowrap transition-all ${
                selectedFilters.includes(filter)
                  ? 'bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan'
                  : 'hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              {filter}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32 relative space-y-5 pt-4 min-h-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:items-start lg:gap-5 lg:space-y-0 lg:px-8 lg:pb-8">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <article key={job.id} className="glass-panel rounded-2xl p-5 hover:border-neon-cyan/50 transition-all cursor-pointer group shrink-0 lg:min-h-60">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-white">{job.title}</h3>
                  <p className="text-xs text-gray-400 font-mono">{job.company}</p>
                </div>
                <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-1 rounded">{job.mode}</span>
              </div>
              {job.division && (
                <div className="mb-3 text-[9px] font-mono uppercase tracking-widest text-neon-cyan">
                  {job.division.replace(/_/g, ' ')}
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-2 mb-4 text-[10px] text-gray-500 font-mono">
                <div>📍 {job.location}</div>
                <div>⚡ {job.experience}</div>
                <div>💰 {job.salary}</div>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {job.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="rounded-md bg-white/5 px-2 py-1 text-[9px] font-mono text-gray-400">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => openJobDetails(job)}
                  className="flex-1 py-2 rounded-lg border border-white/20 text-xs font-medium hover:bg-white/5 transition"
                >
                  Details
                </button>
                <button 
                  onClick={() => onSelectJob(job)}
                  className="flex-1 py-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan text-xs font-medium hover:bg-neon-cyan/20 transition"
                >
                  Get Ready
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No jobs match your filters. Try adjusting them.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListView;
