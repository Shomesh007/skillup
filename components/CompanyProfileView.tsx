
import React, { useState, useEffect } from 'react';
import { Company, AppView } from '../types';
import { useAppContext } from '../context/AppContext';
import { getCompanyInterviewRounds, getSalaryBenchmarks } from '../src/services/supabase';

type CompanyDetails = Company & {
  website?: string;
  careersPage?: string;
  linkedInUrl?: string;
};

interface InterviewRound {
  id: string;
  round_number: number;
  round_name: string;
  duration_minutes: number;
  focus_areas: string[];
  pass_rate_percentage: number;
}

interface SalaryBenchmark {
  id: string;
  level: string;
  base_25th_percentile: number;
  base_50th_percentile: number;
  base_75th_percentile: number;
  bonus_avg: number;
}

interface Props {
  company: CompanyDetails;
  onAction: (view: AppView) => void;
  onBack: () => void;
  onShowJobs?: (companyName: string) => void;
}

const CompanyProfileView: React.FC<Props> = ({ company, onAction, onBack, onShowJobs }) => {
  const { selectedCompany } = useAppContext();
  const displayCompany = selectedCompany || company;
  const [rounds, setRounds] = useState<InterviewRound[]>([]);
  const [salaries, setSalaries] = useState<SalaryBenchmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roundsRes, salariesRes] = await Promise.all([
          getCompanyInterviewRounds(displayCompany.id),
          getSalaryBenchmarks(displayCompany.id)
        ]);
        
        if (roundsRes.error) throw roundsRes.error;
        if (salariesRes.error) throw salariesRes.error;
        
        setRounds(roundsRes.data || []);
        setSalaries(salariesRes.data || []);
      } catch (error) {
        console.error('Error fetching company data:', error);
        setRounds([]);
        setSalaries([]);
      } finally {
        setLoading(false);
      }
    };

    if (displayCompany.id) {
      fetchData();
    }
  }, [displayCompany.id]);

  const formatSalary = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar">
      <header className="p-6 relative overflow-hidden shrink-0 lg:p-8">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="w-20 h-20 bg-white rounded-3xl p-4 shadow-xl border border-white/10">
            <img src={displayCompany.logo} alt={displayCompany.name} className="w-full h-full object-contain" />
          </div>
          <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-400">
            <span className="material-symbols-outlined">bookmark</span>
          </button>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 relative z-10 lg:text-6xl">{displayCompany.name}</h1>
        <p className="text-sm font-mono text-neon-cyan tracking-widest uppercase mb-6 relative z-10">Get Ready for {displayCompany.name}</p>
        <button 
          onClick={() => onShowJobs?.(displayCompany.name)}
          className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 lg:w-56"
        >
          SHOW JOBS
        </button>
      </header>

      <div className="px-6 space-y-10 pb-32 lg:px-8 lg:pb-8">
        <section>
          <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] mb-4">About</h3>
          <p className="text-sm text-gray-400 leading-relaxed font-mono">
            {displayCompany.about || `Learn more about ${displayCompany.name} and explore career opportunities.`}
          </p>
          {displayCompany.linkedInUrl && (
            <a href={displayCompany.linkedInUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-neon-cyan font-mono mt-3 hover:underline">
              View Jobs on LinkedIn →
            </a>
          )}
          {displayCompany.website && (
            <a href={displayCompany.website} target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-neon-cyan font-mono mt-2 hover:underline ml-4">
              Visit Website →
            </a>
          )}
        </section>

        {/* Salary Benchmarks Section */}
        {salaries.length > 0 && (
          <section className="glass-panel p-5 rounded-2xl">
            <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-6">💰 Salary Benchmarks</h3>
            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
              {salaries.map((salary) => (
                <div key={salary.id} className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-neon-cyan uppercase">{salary.level}</span>
                    {salary.bonus_avg > 0 && (
                      <span className="text-[9px] text-neon-amber bg-neon-amber/10 px-2 py-0.5 rounded">+{formatSalary(salary.bonus_avg)} bonus</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-500">25th percentile:</span>
                      <span className="text-white font-mono">{formatSalary(salary.base_25th_percentile)}</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-500">50th percentile (median):</span>
                      <span className="text-neon-cyan font-mono font-bold">{formatSalary(salary.base_50th_percentile)}</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-500">75th percentile:</span>
                      <span className="text-white font-mono">{formatSalary(salary.base_75th_percentile)}</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-neon-violet via-primary to-neon-cyan rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="glass-panel p-5 rounded-2xl">
          <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-6">Hiring Process</h3>
          {loading ? (
            <div className="text-sm text-gray-500">Loading interview rounds...</div>
          ) : rounds.length > 0 ? (
            <div className="relative space-y-6 pl-4 border-l border-white/5">
              {rounds.map((round, idx) => (
                <div key={round.id} className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(19,91,236,1)]"></div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white uppercase">Round {round.round_number}: {round.round_name}</span>
                    <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{round.duration_minutes}m</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] text-gray-500">Pass Rate:</span>
                    <span className="text-[9px] font-mono text-neon-cyan">{round.pass_rate_percentage}%</span>
                  </div>
                  {round.focus_areas && round.focus_areas.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Focus: {round.focus_areas.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No interview rounds available yet.</div>
          )}
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <button 
            onClick={() => onAction(AppView.RESUME_TEMPLATES)}
            className="flex items-center gap-4 p-5 glass-panel rounded-2xl text-left border-l-4 border-l-cyan-300 group"
          >
            <span className="material-symbols-outlined text-4xl text-cyan-300 opacity-50 group-hover:opacity-100 transition-opacity">badge</span>
            <div>
              <h4 className="font-bold text-white">Resume Templates</h4>
              <p className="text-[10px] text-gray-500 font-mono">ATS-friendly formats for this role</p>
            </div>
          </button>

          <button 
            onClick={() => onAction(AppView.GUIDE)}
            className="flex items-center gap-4 p-5 glass-panel rounded-2xl text-left border-l-4 border-l-neon-cyan group"
          >
            <span className="material-symbols-outlined text-4xl text-neon-cyan opacity-50 group-hover:opacity-100 transition-opacity">description</span>
            <div>
              <h4 className="font-bold text-white">How to Apply</h4>
              <p className="text-[10px] text-gray-500 font-mono">Resume help and steps</p>
            </div>
          </button>
          
          <button 
            onClick={() => onAction(AppView.INTERVIEW_PREP)}
            className="flex items-center gap-4 p-5 glass-panel rounded-2xl text-left border-l-4 border-l-neon-violet group"
          >
            <span className="material-symbols-outlined text-4xl text-neon-violet opacity-50 group-hover:opacity-100 transition-opacity">terminal</span>
            <div>
              <h4 className="font-bold text-white">Interview Help</h4>
              <p className="text-[10px] text-gray-500 font-mono">Questions and practice</p>
            </div>
          </button>

          <button 
            onClick={() => onAction(AppView.SUCCESS_STORIES)}
            className="flex items-center gap-4 p-5 glass-panel rounded-2xl text-left border-l-4 border-l-neon-amber group"
          >
            <span className="material-symbols-outlined text-4xl text-neon-amber opacity-50 group-hover:opacity-100 transition-opacity">auto_awesome</span>
            <div>
              <h4 className="font-bold text-white">Member Stories</h4>
              <p className="text-[10px] text-gray-500 font-mono">Real hiring experiences</p>
            </div>
          </button>
        </section>
      </div>
    </div>
  );
};

export default CompanyProfileView;
