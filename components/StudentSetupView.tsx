import React from 'react';
import PathSetup from './PathSetup';
export interface StudentSetupProfile { stage:string; goal:string; interest:string; }
export default function StudentSetupView({onComplete,onBack}:{onComplete:(profile:StudentSetupProfile)=>void;onBack:()=>void;onOpenCoaching:()=>void}) {
 return <PathSetup pathName="Student path" onBack={onBack} onComplete={p=>onComplete(p as unknown as StudentSetupProfile)} steps={[
  {field:'stage',title:'What chapter are you in?',hint:'We’ll meet you where you are.',choices:[{id:'first-year',label:'1st or 2nd year',icon:'school'},{id:'pre-final',label:'Pre-final year',icon:'auto_stories'},{id:'final-year',label:'Final year',icon:'workspace_premium'}]},
  {field:'goal',title:'What’s your next big thing?',hint:'One priority helps us find your next step.',choices:[{id:'explore',label:'Find a role I’d enjoy',icon:'explore'},{id:'internship',label:'Get internship-ready',icon:'work_outline'},{id:'placement',label:'Prepare for placements',icon:'forum'},{id:'skills',label:'Improve my skills',icon:'construction'},{id:'jobs',label:'Search internships or jobs',icon:'search'},{id:'resume',label:'Build my resume',icon:'description'}]},
  {field:'interest',title:'What sparks your curiosity?',hint:'You can explore every direction later.',choices:[{id:'software',label:'Building apps & software',icon:'code'},{id:'testing',label:'Testing & quality',icon:'bug_report'},{id:'data',label:'Data & AI',icon:'query_stats'},{id:'infra',label:'Cloud & security',icon:'cloud'}]}
 ]}/>;
}
