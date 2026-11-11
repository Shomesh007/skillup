import React from 'react';
import { Icon } from './Brand';
interface Props { eyebrow?:string; title?:string; desc?:string; accent?:'cyan'|'amber'|'green'|'violet';compact?:boolean;onOpenCoaching:()=>void; }
export default function DecisionCoachCard({eyebrow='Need a hand?',onOpenCoaching}:Props){return <button onClick={onOpenCoaching} className="w-full flex items-center gap-3 rounded-2xl border border-line bg-white p-4 text-left hover:bg-blue-50"><span className="text-primary"><Icon name="lightbulb" size={25}/></span><span className="flex-1"><strong className="text-xs block">{eyebrow}</strong><span className="text-[11px] text-muted block mt-1">Open a practical preparation checklist.</span></span><span className="text-primary text-xl">↗</span></button>;}
