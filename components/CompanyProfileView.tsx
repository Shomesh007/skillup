import React, { useState } from 'react';
import './companyResearch.css';
import { Company, AppView } from '../types';

import { researchFor } from '../src/data/companyResearch';
import { Icon } from './Brand';
import { Button, Empty, Page, Section, SourceNote, Tabs, useStoredState } from './workspace/UI';
export default function CompanyProfileView({company,onAction,onShowJobs}:{company:Company;onAction:(view:AppView)=>void;onBack:()=>void;onShowJobs?:(name:string)=>void}){
 const [tab,setTab]=useState('Overview');
 const [saved,setSaved]=useStoredState<string[]>('skillup_saved_companies',[]);
 const isSaved=saved.includes(company.id),research=researchFor(company.name);
 return <Page title={company.name} description="Hiring guidance and application preparation" actions={<><Button onClick={()=>setSaved(previous=>isSaved?previous.filter(id=>id!==company.id):[...previous,company.id])} aria-pressed={isSaved}><Icon name={isSaved?'bookmark_added':'bookmark_border'}/>{isSaved?'Saved company':'Save company'}</Button><Button variant="primary" onClick={()=>onShowJobs?.(company.name)}>India jobs<Icon name="arrow_forward"/></Button></>}>
  <Tabs items={['Overview','Hiring FAQs','Preparation']} value={tab} onChange={setTab} label="Company details"/>
  {tab==='Overview'&&<div className="company-profile-layout"><section>
   {research&&<Section title="Careers at this company"><p>Explore current openings and review the requirements for your role.</p><div className="company-official-links"><a href={research.applyUrl||research.sourceUrl} target="_blank" rel="noopener noreferrer">Visit careers site<Icon name="open_in_new" size={15}/></a></div></Section>}
   <Section title="India hiring essentials">{research?.faqs.length?<div className="company-essentials">{research.faqs.slice(0,3).map(faq=><div key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p><a href={faq.sourceUrl||research.sourceUrl} target="_blank" rel="noopener noreferrer">Official guidance ↗</a></div>)}<Button onClick={()=>setTab('Hiring FAQs')}>All hiring FAQs ({research.faqs.length})</Button></div>:<p>Use the official India vacancy to confirm the city, eligibility, qualifications and application route. Ask your recruiter about the interview stages for your role.</p>}{research?.applyUrl&&<div className="company-official-links"><a href={research.applyUrl} target="_blank" rel="noopener noreferrer">Official India careers ↗</a>{research.graduateUrl&&<a href={research.graduateUrl} target="_blank" rel="noopener noreferrer">Graduate / entry-level route ↗</a>}</div>}</Section>
  </section></div>}
  {tab==='Hiring FAQs'&&<section className="company-hiring-process"><h2>Hiring questions</h2>{research?.faqs.length?<><div className="company-faq-list">{research.faqs.map(faq=><details className="ui-surface ui-surface-pad" key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p><a href={faq.sourceUrl||research.sourceUrl} target="_blank" rel="noopener noreferrer">Read the official guidance ↗</a></details>)}</div></>:<Empty title="Questions to ask before applying" description="Check the role’s qualifications, location and application deadline. Ask your recruiter which assessments and interview stages apply."/>}</section>}
  {tab==='Preparation'&&<div className="company-prep-list">{[{title:'Tailor your resume',description:'Connect your real work to the requirements of a specific opening.',view:AppView.RESUME_TEMPLATES,icon:'description'},{title:'Practise the conversation',description:'Prepare clear examples and talk through your decisions.',view:AppView.INTERVIEW_PREP,icon:'forum'},{title:'Organize an application',description:'Review the role, plan your next steps, and prepare thoughtful outreach.',view:AppView.GUIDE,icon:'checklist'}].map(item=><button key={item.view} onClick={()=>onAction(item.view)}><Icon name={item.icon} size={21}/><span><strong>{item.title}</strong><span>{item.description}</span></span><Icon name="arrow_forward" size={18}/></button>)}</div>}
  <SourceNote>Eligibility and hiring steps vary by role and programme. Check the requirements on your chosen vacancy.</SourceNote>
 </Page>;
}
