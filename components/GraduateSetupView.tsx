import React from 'react';
import PathSetup from './PathSetup';
export interface GraduateSetupProfile { situation:string; target:string; readiness:string; }
export default function GraduateSetupView({onComplete,onBack}:{onComplete:(profile:GraduateSetupProfile)=>void;onBack:()=>void;onOpenCoaching:()=>void}) {
 return <PathSetup pathName="First-job path" onBack={onBack} onComplete={p=>onComplete(p as unknown as GraduateSetupProfile)} steps={[
 {field:'situation',title:'Where are you right now?',hint:'Let’s find a useful place to start.',choices:[{id:'recent',label:'Just graduated',icon:'school'},{id:'active',label:'Already applying',icon:'send'},{id:'gap',label:'Returning after a break',icon:'restart_alt'},{id:'experience',label:'I have projects or internships',icon:'deployed_code'}]},
 {field:'target',title:'What would you like to do?',hint:'It’s okay to still be figuring it out.',choices:[{id:'developer',label:'Software development',icon:'code'},{id:'testing',label:'Testing & QA',icon:'bug_report'},{id:'data',label:'Data & AI',icon:'query_stats'},{id:'cloud',label:'Cloud & DevOps',icon:'cloud'},{id:'support',label:'Support & analyst roles',icon:'support_agent'},{id:'unsure',label:'Help me choose',icon:'explore'}]},
 {field:'readiness',title:'What would help most?',hint:'We’ll put the right tools within reach.',choices:[{id:'resume',label:'A stronger resume',icon:'description'},{id:'skills',label:'Skills & project proof',icon:'construction'},{id:'jobs',label:'Finding the right jobs',icon:'work_outline'},{id:'prep',label:'Interview practice',icon:'forum'},{id:'no-calls',label:'Getting more callbacks',icon:'phone_callback'}]}
 ]}/>;
}
