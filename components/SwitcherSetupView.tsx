import React from 'react';
import PathSetup from './PathSetup';
export interface SwitcherSetupProfile { current:string; target:string; blocker:string; }
export default function SwitcherSetupView({onComplete,onBack}:{onComplete:(profile:SwitcherSetupProfile)=>void;onBack:()=>void;onOpenCoaching:()=>void}) {
 return <PathSetup pathName="Career-switch path" onBack={onBack} onComplete={p=>onComplete(p as unknown as SwitcherSetupProfile)} steps={[
 {field:'current',title:'What’s your current world?',hint:'Your experience is part of what comes next.',choices:[{id:'support',label:'Support or operations',icon:'support_agent'},{id:'non-it',label:'A role outside tech',icon:'swap_horiz'},{id:'qa',label:'Testing & QA',icon:'bug_report'},{id:'developer',label:'Software development',icon:'code'},{id:'analyst',label:'Analyst or data-adjacent',icon:'bar_chart'}]},
 {field:'target',title:'Where would you like to go?',hint:'Let’s build a bridge to your next role.',choices:[{id:'dev',label:'Into development',icon:'code'},{id:'automation',label:'Into automation or SDET',icon:'precision_manufacturing'},{id:'data',label:'Into data roles',icon:'query_stats'},{id:'cloud',label:'Into cloud & DevOps',icon:'cloud'},{id:'better-job',label:'Same role, new company',icon:'trending_up'}]},
 {field:'blocker',title:'What’s holding you back?',hint:'A clear challenge makes a better plan.',choices:[{id:'proof',label:'I need proof of new skills',icon:'deployed_code'},{id:'resume',label:'My resume needs a new story',icon:'description'},{id:'time',label:'Limited time after work',icon:'schedule'},{id:'confidence',label:'I’m unsure what’s realistic',icon:'explore'},{id:'interviews',label:'I need interview practice',icon:'forum'},{id:'jobs',label:'Finding relevant openings',icon:'search'}]}
 ]}/>;
}
