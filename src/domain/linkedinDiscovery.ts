import {parseHTML} from 'linkedom';
import {extractSkills} from './skills';
import {indiaOnly} from './indiaJobs';
import type {JobFeed} from './jobFeeds';
import type {JobOpportunity} from '../../types';
const employers:Record<string,{keyword:string;slugs:string[];names:string[]}>= {
 ust:{keyword:'UST',slugs:['ustglobal'],names:['UST','UST Global']},
 tcs:{keyword:'Tata Consultancy Services',slugs:['tata-consultancy-services'],names:['Tata Consultancy Services','Tata Consultancy Services Limited']},
 hcltech:{keyword:'HCLTech',slugs:['hcl-technologies','hcltech'],names:['HCLTech']},
 cognizant:{keyword:'Cognizant',slugs:['cognizant','cognizant-technology-solutions'],names:['Cognizant']},
 capgemini:{keyword:'Capgemini',slugs:['capgemini'],names:['Capgemini']},
 techmahindra:{keyword:'Tech Mahindra',slugs:['tech-mahindra'],names:['Tech Mahindra']},
 ltm:{keyword:'LTIMindtree',slugs:['ltimindtree','ltm-larsenandtoubrocompany'],names:['LTM','LTIMindtree']},
};
const key=(value:string)=>value.toLowerCase().replace(/[^a-z0-9]/g,'');
export function linkedinSearchUrl(feed:JobFeed){const employer=employers[feed.board];if(!employer)throw new Error('Unknown LinkedIn employer configuration');const url=new URL('https://www.linkedin.com/jobs/search/');url.searchParams.set('keywords',employer.keyword);url.searchParams.set('location','India');url.searchParams.set('f_TPR','r604800');return url.href;}
export function parseLinkedinDiscovery(feed:JobFeed,html:string,fetchedAt:string):JobOpportunity[]{
 const employer=employers[feed.board];if(!employer)throw new Error('Unknown LinkedIn employer configuration');
 const {document}=parseHTML(html);const cards=Array.from(document.querySelectorAll('.base-card'));
 if(!cards.length)throw new Error('LinkedIn public results unavailable or markup changed; previous data retained');
 const jobs:JobOpportunity[]=[];
 for(const card of cards){
  const company=card.querySelector('h4')?.textContent.trim()||'';
  const companyLink=card.querySelector('h4 a')?.getAttribute('href')||'';
  let slug='';try{slug=new URL(companyLink).pathname.match(/^\/company\/([^/]+)/)?.[1]||'';}catch{continue;}
  if(!employer.names.some(name=>key(name)===key(company))||!employer.slugs.includes(slug))continue;
  const title=card.querySelector('h3')?.textContent.trim();const location=card.querySelector('.job-search-card__location')?.textContent.trim();
  const id=card.getAttribute('data-entity-urn')?.match(/^urn:li:jobPosting:(\d+)$/)?.[1];
  const date=card.querySelector('time')?.getAttribute('datetime');
  if(!title||!location||!id||!date||!Number.isFinite(Date.parse(date)))throw new Error('LinkedIn posting metadata changed');
  // Do not present old portal cards as fresh just because the search page still returns them.
  const age=Date.parse(fetchedAt)-Date.parse(date);if(age< -24*60*60*1000||age>8*24*60*60*1000)continue;
  const sourceUrl=`https://www.linkedin.com/jobs/view/${id}/`;
  jobs.push({id:`linkedin:${feed.board}:${id}`,title,company:feed.company,location,experience:'Experience not specified',salary:'Not disclosed',mode:'Not specified',sourceProvider:'linkedin',sourceBoard:feed.board,sourceId:id,sourceUrl,linkedinUrl:sourceUrl,fetchedAt,postedAt:date,skills:extractSkills(title)});
 }
 const result=indiaOnly(jobs);if(new Set(result.map(job=>job.id)).size!==result.length)throw new Error('LinkedIn repeated a posting ID');
 return result;
}
