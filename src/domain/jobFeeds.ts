import type { JobOpportunity } from '../../types';
import { extractSkills } from './skills';
export interface JobFeed {company:string;provider:'greenhouse'|'ashby'|'lever'|'zuora'|'accenture'|'wipro'|'infosys'|'linkedin'|'zoho'|'smartrecruiters'|'hexaware';board:string;careersUrl:string;verifiedAt:string;coverage?:string;}
export interface FeedResult {feed:JobFeed;attemptedAt:string;fetchedAt?:string;status:'ok'|'failed';error?:string;jobs:JobOpportunity[];}
export interface JobSnapshot {version:1;feeds:FeedResult[];}
export const jobFeeds:JobFeed[]=[
 {company:'Zoho',provider:'zoho',board:'zohocorp',careersUrl:'https://www.zoho.com/careers/',verifiedAt:'2026-11-11',coverage:'Published India openings from the public feed linked by Zoho Careers; missing cities remain unspecified'},
 {company:'Freshworks',provider:'smartrecruiters',board:'Freshworks',careersUrl:'https://careers.smartrecruiters.com/Freshworks',verifiedAt:'2026-11-11',coverage:'Paginated public India postings and their details from the official Freshworks SmartRecruiters board'},
 {company:'UST',provider:'linkedin',board:'ust',careersUrl:'https://www.linkedin.com/jobs/search/?keywords=UST&location=India&f_TPR=r604800',verifiedAt:'2026-11-11',coverage:'LinkedIn discovery: public first-page India cards from the past week; partial coverage, confirm on the source'},
 {company:'Hexaware',provider:'hexaware',board:'hexaware',careersUrl:'https://jobs.hexaware.com/',verifiedAt:'2026-11-11',coverage:'Paginated public Hexaware Oracle CX_1 board, filtered by explicit India country metadata'},
 {company:'Tata Consultancy Services',provider:'linkedin',board:'tcs',careersUrl:'https://www.linkedin.com/jobs/search/?keywords=Tata%20Consultancy%20Services&location=India&f_TPR=r604800',verifiedAt:'2026-11-11',coverage:'LinkedIn discovery: public first-page India cards from the past week; partial coverage, confirm on the source'},
 {company:'HCLTech',provider:'linkedin',board:'hcltech',careersUrl:'https://www.linkedin.com/jobs/search/?keywords=HCLTech&location=India&f_TPR=r604800',verifiedAt:'2026-11-11',coverage:'LinkedIn discovery: public first-page India cards from the past week; partial coverage, confirm on the source'},
 {company:'Cognizant',provider:'linkedin',board:'cognizant',careersUrl:'https://www.linkedin.com/jobs/search/?keywords=Cognizant&location=India&f_TPR=r604800',verifiedAt:'2026-11-11',coverage:'LinkedIn discovery: public first-page India cards from the past week; partial coverage, confirm on the source'},
 {company:'Capgemini',provider:'linkedin',board:'capgemini',careersUrl:'https://www.linkedin.com/jobs/search/?keywords=Capgemini&location=India&f_TPR=r604800',verifiedAt:'2026-11-11',coverage:'LinkedIn discovery: public first-page India cards from the past week; partial coverage, confirm on the source'},
 {company:'Tech Mahindra',provider:'linkedin',board:'techmahindra',careersUrl:'https://www.linkedin.com/jobs/search/?keywords=Tech%20Mahindra&location=India&f_TPR=r604800',verifiedAt:'2026-11-11',coverage:'LinkedIn discovery: public first-page India cards from the past week; partial coverage, confirm on the source'},
 {company:'LTM',provider:'linkedin',board:'ltm',careersUrl:'https://www.linkedin.com/jobs/search/?keywords=LTIMindtree&location=India&f_TPR=r604800',verifiedAt:'2026-11-11',coverage:'LinkedIn discovery: public first-page India cards from the past week; partial coverage, confirm on the source'},
 {company:'Accenture in India',provider:'accenture',board:'india',careersUrl:'https://www.accenture.com/in-en/careers/jobsearch',verifiedAt:'2026-11-11',coverage:'Newest up to 50 postings per South Indian city; seven cities'},
 {company:'Infosys',provider:'infosys',board:'india',careersUrl:'https://career.infosys.com/jobs?countrycode=IN',verifiedAt:'2026-11-11',coverage:'Official Infosys India experienced and fresher sources'},
 {company:'Wipro',provider:'wipro',board:'india',careersUrl:'https://careers.wipro.com/search/?locationsearch=India',verifiedAt:'2026-11-11',coverage:'Newest up to 25 search results per South Indian city; seven cities'},
 {company:'Capco',provider:'greenhouse',board:'capco',careersUrl:'https://www.capco.com/Careers/Job-Search',verifiedAt:'2026-11-11'},
 {company:'ValGenesis',provider:'lever',board:'valgenesis',careersUrl:'https://jobs.lever.co/valgenesis',verifiedAt:'2026-11-11'},
 {company:'Zuora',provider:'zuora',board:'zuora',careersUrl:'https://www.zuora.com/careers-search-jobs/',verifiedAt:'2026-11-11'},
 {company:'Appian',provider:'greenhouse',board:'appian',careersUrl:'https://careers.appian.com/jobs',verifiedAt:'2026-11-11'},
 {company:'Poshmark',provider:'ashby',board:'poshmark',careersUrl:'https://poshmark.com/careers',verifiedAt:'2026-11-11'},
];
export const feedId=(feed:JobFeed)=>`${feed.provider}:${feed.board}`;
export function feedUrl(feed:JobFeed){
 if(!/^[a-zA-Z0-9._-]{1,80}$/.test(feed.board))throw new Error('Invalid board identifier');
 if(feed.provider==='zuora')return 'https://www.zuora.com/careers-search-jobs/';
 if(feed.provider==='lever')return `https://api.lever.co/v0/postings/${encodeURIComponent(feed.board)}?mode=json&limit=100&skip=0`;
 return feed.provider==='greenhouse'?`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(feed.board)}/jobs?content=true`:`https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(feed.board)}?includeCompensation=true`;
}
const clean=(value:unknown)=>String(value||'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
function roleExcerpt(text:string){
 const start=text.search(/\b(?:About the role|About this role|In this role|You will|We are (?:looking|seeking|hiring)|As an? (?:engineer|developer|manager|consultant|analyst|specialist|member|account|senior|principal|staff|director))\b/i);
 return text?text.slice(start<0?0:start).split(/\s+/).slice(0,24).join(' ')+'…':undefined;
}
function safeLink(value:unknown){try{const url=new URL(String(value));return url.protocol==='https:'?url.href:undefined;}catch{return undefined;}}
export function normalizeFeed(feed:JobFeed,data:unknown,fetchedAt:string):JobOpportunity[]{
 if(feed.provider==='lever'){
  if(!Array.isArray(data))throw new Error('Unexpected Lever response');
  data={jobs:data.map(row=>({id:row.id,title:row.text,isListed:true,jobUrl:row.hostedUrl,location:row.categories?.location,secondaryLocations:(row.categories?.allLocations||[]).map(location=>({location})),descriptionPlain:[row.descriptionPlain,...(row.lists||[]).map(item=>item.content)].filter(Boolean).join(' '),publishedAt:typeof row.createdAt==='number'?new Date(row.createdAt).toISOString():undefined,employmentType:row.categories?.commitment,workplaceType:row.workplaceType,country:row.country}))};
 }
 if(!data||typeof data!=='object'||!Array.isArray((data as any).jobs))throw new Error('Unexpected response: missing jobs array');
 const seen=new Set<string>();
 return (data as any).jobs.filter((row:any)=>feed.provider==='greenhouse'?row.internal_job_id!==null:row.isListed===true).map((row:any)=>{
  const url=safeLink(feed.provider==='greenhouse'?row.absolute_url:row.jobUrl);
  const sourceId=feed.provider==='greenhouse'?String(row.id??''):String(row.id||url?.split('/').filter(Boolean).at(-1)||'');
  if(!row.title||!url||!sourceId)throw new Error('Unexpected posting: missing title, HTTPS URL or source ID');
  const id=`${feed.provider}:${feed.board}:${sourceId}`;
  if(seen.has(id))throw new Error('Duplicate source posting ID');seen.add(id);
  const text=clean(feed.provider==='greenhouse'?row.content:row.descriptionPlain||row.descriptionHtml);
  const locations=feed.provider==='greenhouse'?[row.location?.name]:[row.location,...(row.secondaryLocations||[]).map((item:any)=>item.location)];
  const workplace=String(row.workplaceType||'');
  const sourceCountries=Array.from(new Set([row.country,...[row.address,...(row.secondaryLocations||[]).map((item:any)=>item.address)].map(address=>address?.postalAddress?.addressCountry||address?.addressCountry)].filter((country):country is string=>typeof country==='string'&&!!country.trim())));
  return {id,title:clean(row.title),company:feed.company,location:locations.filter(Boolean).join(' · ')||'Location not specified',experience:clean(row.experienceText)||'Experience not specified',salary:clean(row.compensation?.scrapeableCompensationSalarySummary)||'Not disclosed',mode:/hybrid/i.test(workplace)?'Hybrid':/remote/i.test(workplace)||row.isRemote===true?'Remote':/onsite|on.site/i.test(workplace)?'On-site':'Not specified',description:roleExcerpt(text),skills:extractSkills(text),linkedinUrl:url,sourceUrl:url,sourceProvider:feed.provider,sourceBoard:feed.board,sourceId,fetchedAt,sourceCountries,providerUpdatedAt:feed.provider==='greenhouse'?row.updated_at:row.updatedAt,postedAt:feed.provider!=='greenhouse'?row.publishedAt:undefined,employmentType:row.employmentType};
 });
}
export function failedFeed(feed:JobFeed,previous:FeedResult|undefined,attemptedAt:string,error:string):FeedResult{return {feed,status:'failed',attemptedAt,fetchedAt:previous?.fetchedAt,jobs:previous?.jobs||[],error};}
export function isIndiaLocation(job:JobOpportunity){return /\bindia\b/i.test(job.location)||(job.sourceCountries||[]).some(country=>/^(india|ind|in)$/i.test(country.trim()));}
