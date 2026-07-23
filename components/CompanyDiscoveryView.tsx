
import React, { useState, useMemo } from 'react';
import { Company } from '../types';
import { useAppContext } from '../context/AppContext';
import { LINKEDIN_COMPANIES } from '../src/data/linkedinCompanies';

interface Props {
  role: string;
  onSelectCompany: (company: Company) => void;
  onBack: () => void;
  onShowJobs?: (companyName: string) => void;
}

const CompanyDiscoveryView: React.FC<Props> = ({ role, onSelectCompany, onBack, onShowJobs }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'MNC' | 'PRODUCT' | 'STARTUP'>('ALL');
  const { companies: contextCompanies } = useAppContext();

  // Convert context companies to the Company type
  const mappedCompanies: Company[] = useMemo(() => {
    return contextCompanies.map((c: any) => ({
      id: c.id,
      name: c.name,
      tagline: c.name,
      logo: c.logo || '🏢',
      rating: 4.5,
      location: 'Multiple Locations',
      salary: c.averageSalary,
      experience: '0-5 Years',
      category: c.tier === 'mnc' ? 'FAANG' : c.tier === 'product' ? 'PRODUCT' : c.tier === 'sme' ? 'STARTUP' : 'FAANG',
      isHiring: c.hiringStatus === 'high' || c.hiringStatus === 'regular',
      about: `${c.name} is actively hiring for ${c.rolesHiring.length} roles`,
      stack: {
        frontend: [],
        backend: [],
        database: [],
        cloud: []
      },
      timeline: c.hiringProcess?.steps?.map((s: any) => ({ step: s.name, duration: s.duration })) || []
    }));
  }, [contextCompanies]);

  const filtered = useMemo(() => {
    const companyMap = new Map<string, Company>();
    [...mappedCompanies, ...LINKEDIN_COMPANIES].forEach((company) => {
      companyMap.set(company.name.toLowerCase(), company);
    });
    let result = Array.from(companyMap.values());
    
    if (activeTab !== 'ALL') {
      // Map activeTab to the corresponding category value
      const tabToCategoryMap: { [key: string]: string } = {
        'MNC': 'FAANG',
        'PRODUCT': 'PRODUCT',
        'STARTUP': 'STARTUP'
      };
      const targetCategory = tabToCategoryMap[activeTab];
      result = result.filter(c => c.category === targetCategory);
    }
    
    // Show all companies in the filtered category (regardless of hiring status)
    // This allows users to prepare for any company they want
    return result;
  }, [mappedCompanies, activeTab]);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <header className="px-6 pt-4 pb-2 shrink-0 lg:px-8 lg:pt-6">
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
          <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-mono whitespace-nowrap">REMOTE FRIENDLY</button>
          <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-mono whitespace-nowrap">0-5 YEARS EXP</button>
        </div>

        <div className="flex border-b border-white/5">
          {['ALL', 'MNC', 'PRODUCT', 'STARTUP'].map(t => (
            <button 
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`px-4 py-3 text-[10px] font-mono tracking-widest transition-all ${activeTab === t ? 'text-neon-cyan border-b-2 border-neon-cyan bg-neon-cyan/5' : 'text-gray-500'}`}
            >
              {t === 'ALL' ? 'ALL HIRING' : t}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-4 pb-32 pt-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-5 lg:space-y-0 lg:px-8 lg:pb-8 lg:items-start lg:content-start">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No companies found in this category</p>
          </div>
        ) : (
          filtered.map(c => (
            <div 
              key={c.id} 
              onClick={() => onSelectCompany(c)}
              className="glass-panel p-5 rounded-2xl group cursor-pointer hover:border-neon-cyan/50 transition-all shrink-0 h-fit lg:h-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-white p-2 flex items-center justify-center text-2xl">
                  {typeof c.logo === 'string' && c.logo.length === 1 ? c.logo : '🏢'}
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[10px] font-mono ${c.isHiring ? 'text-neon-green bg-neon-green/10' : 'text-gray-400 bg-gray-400/10'} px-2 py-0.5 rounded uppercase tracking-wider mb-2`}>
                    {c.isHiring ? 'Hiring' : 'Explore'}
                  </span>
                  <div className="flex text-neon-amber">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-xs leading-none">star</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors">{c.name}</h3>
              <p className="text-xs text-gray-500 font-mono mb-4 line-clamp-2">{c.about || `${c.name} is actively hiring`}</p>
              
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                  <div className="text-[8px] text-gray-600 uppercase font-mono">Salary</div>
                  <div className="text-xs text-neon-cyan">{c.salary}</div>
                </div>
                <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                  <div className="text-[8px] text-gray-600 uppercase font-mono">Category</div>
                  <div className="text-xs text-gray-300">{c.category}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (c.isHiring) {
                      onShowJobs?.(c.name);
                    } else {
                      onSelectCompany(c);
                    }
                  }}
                  className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest hover:bg-white/10"
                >
                  {c.isHiring ? 'Show Jobs' : 'Explore'}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCompany(c);
                  }}
                  className="flex-1 py-2 rounded-lg bg-primary/20 border border-primary/40 text-primary text-[10px] font-mono uppercase tracking-widest hover:bg-primary/30"
                >
                  Get Ready
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyDiscoveryView;
