
import React, { useState, useMemo } from 'react';
import { ROLE_CATEGORIES } from '../constants';
import { useAppContext } from '../context/AppContext';

interface Props {
  onSelectRole: (role: string) => void;
}

const RoleHubView: React.FC<Props> = ({ onSelectRole }) => {
  const [search, setSearch] = useState('');
  const { roles } = useAppContext();

  const getCategoryMeta = (category: string) => {
    const normalized = category.toLowerCase();

    if (normalized.includes('data') || normalized.includes('ai') || normalized.includes('ml')) {
      return { icon: 'psychology', color: 'from-primary to-purple-500' };
    }

    if (normalized.includes('cloud') || normalized.includes('devops') || normalized.includes('system')) {
      return { icon: 'cloud_queue', color: 'from-cyan-400 to-primary' };
    }

    if (
      normalized.includes('qa') ||
      normalized.includes('test') ||
      normalized.includes('software') ||
      normalized.includes('frontend') ||
      normalized.includes('backend') ||
      normalized.includes('full stack') ||
      normalized.includes('development')
    ) {
      return { icon: 'code', color: 'from-purple-500 to-pink-500' };
    }

    return { icon: 'work', color: 'from-slate-500 to-slate-700' };
  };

  // Filter roles based on search
  const filteredRoles = useMemo(() => {
    if (!search) return roles;
    return roles.filter(role => 
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      role.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [roles, search]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative min-h-0">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] right-[-10%] h-[70%] bg-[linear-gradient(to_right,#1f2f32_1px,transparent_1px),linear-gradient(to_bottom,#1f2f32_1px,transparent_1px)] bg-grid-perspective"></div>
      </div>

      <div className="p-6 pt-4 relative z-10 pb-32 lg:p-8 lg:pb-8">
        <header className="mb-8 shrink-0 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:gap-10">
          <div>
          <h1 className="text-3xl font-bold leading-tight mb-2 lg:text-5xl">
            Great! What work <br/>
            do you want to <span className="text-primary text-neon">do?</span>
          </h1>
          <p className="max-w-sm text-sm text-slate-400 leading-relaxed">
            If you picked the wrong path, jump back to student, graduate, or pro and start the selector again.
          </p>
          </div>
          <div className="relative mt-8 group lg:mt-0">
            <span className="material-symbols-outlined absolute left-0 top-2 text-primary/70">search</span>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-b border-primary/30 focus:border-primary text-white placeholder-slate-500 py-2 pl-8 outline-none transition-all duration-300" 
              placeholder="Search for jobs (e.g. Developer)..." 
            />
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(37,209,244,1)]"></div>
          </div>
        </header>

        <div className="mb-8 shrink-0">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-semibold">{search ? 'Search Results' : 'Popular Roles'}</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 lg:flex-wrap">
            {(search ? filteredRoles : roles.slice(0, 4)).map(role => (
              <button 
                key={role.id}
                onClick={() => onSelectRole(role.name)}
                className="flex-shrink-0 px-4 py-2 rounded-full border border-slate-700 bg-background-dark/50 text-slate-400 text-sm font-medium whitespace-nowrap hover:border-primary/30 hover:text-primary transition-colors"
              >
                {role.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col relative shrink-0">
          {filteredRoles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No roles found matching "{search}"</p>
            </div>
          ) : search ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {filteredRoles.map((role) => {
                const meta = getCategoryMeta(role.category);

                return (
                  <div
                    key={role.id}
                    onClick={() => onSelectRole(role.name)}
                    className="glass-panel rounded-xl relative overflow-hidden group transition-transform duration-300 hover:scale-[1.01] cursor-pointer border border-white/10"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                      <span className="text-[60px] font-bold text-slate-800 leading-none select-none">{role.difficulty[0].toUpperCase()}</span>
                    </div>
                    <div className="p-6 flex flex-col gap-4 relative z-10">
                      <div className="flex items-start justify-between gap-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${meta.color} rounded-lg border border-white/10 shadow-lg shrink-0`}>
                          <span className="material-symbols-outlined text-white text-2xl">{meta.icon}</span>
                        </div>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-300 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                          {role.category}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1 line-clamp-2">{role.name}</h2>
                        <p className="text-xs text-primary mb-2">{role.difficulty}</p>
                        <p className="text-xs text-slate-400 line-clamp-2">{role.description}</p>
                      </div>
                      <div className="mt-auto">
                        <p className="text-xs text-slate-500 mb-2">Timeline: {role.timeToMastery}</p>
                        <div className="flex gap-1 flex-wrap">
                          {role.learningPath.beginner.tools.slice(0, 3).map((tool, i) => (
                            <span key={i} className="text-[9px] bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {ROLE_CATEGORIES.map((cat) => {
                const categoryKey = cat.title.toLowerCase();
                const categoryRoles = filteredRoles.filter(r => {
                  const normalizedCategory = r.category.toLowerCase();
                  const normalizedName = r.name.toLowerCase();
                  return (
                    normalizedCategory.includes(categoryKey) ||
                    categoryKey.includes(normalizedCategory) ||
                    cat.roles.some(roleName => normalizedName.includes(roleName.toLowerCase()))
                  );
                });
                if (categoryRoles.length === 0) return null;
                
                return (
                  <div key={cat.id} className="shrink-0">
                    <div className="flex gap-6 overflow-x-auto no-scrollbar py-4 -mx-6 px-6 lg:mx-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:overflow-visible lg:px-0">
                      {categoryRoles.map((role) => (
                        <div 
                          key={role.id}
                          onClick={() => onSelectRole(role.name)}
                          className="shrink-0 w-[280px] h-[320px] glass-panel rounded-xl relative overflow-hidden group transition-transform duration-300 hover:scale-[1.02] cursor-pointer lg:w-full"
                        >
                          <div className="absolute top-0 right-0 p-4 opacity-50">
                            <span className="text-[60px] font-bold text-slate-800 leading-none select-none">{role.difficulty[0].toUpperCase()}</span>
                          </div>
                          <div className="p-6 h-full flex flex-col relative z-10">
                            <div className="mb-6">
                              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${cat.color} rounded-lg border border-white/10 shadow-lg`}>
                                <span className="material-symbols-outlined text-white text-2xl">{cat.icon}</span>
                              </div>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-1 line-clamp-2">{role.name}</h2>
                            <p className="text-xs text-primary mb-2">{role.difficulty}</p>
                            <p className="text-xs text-slate-400 mb-4 line-clamp-2">{role.description}</p>
                            <div className="mt-auto">
                              <p className="text-xs text-slate-500 mb-2">Timeline: {role.timeToMastery}</p>
                              <div className="flex gap-1 flex-wrap">
                                {role.learningPath.beginner.tools.slice(0, 3).map((tool, i) => (
                                  <span key={i} className="text-[9px] bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleHubView;
