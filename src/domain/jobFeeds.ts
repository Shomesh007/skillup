import type { JobOpportunity } from '../../types';
import { extractSkills } from './skills';
export interface JobFeed {company:string;provider:'greenhouse'|'ashby';board:string;careersUrl:string;verifiedAt:string;}
export interface FeedResult {feed:JobFeed;attemptedAt:string;fetchedAt?:string;status:'ok'|'failed';error?:string;jobs:JobOpportunity[];}
export interface JobSnapshot {version:1;feeds:FeedResult[];}
export const jobFeeds:JobFeed[]=[
 {company:'Appian',provider:'greenhouse',board:'appian',careersUrl:'https://careers.appian.com/jobs',verifiedAt:'2026-11-11'},
 {company:'Poshmark',provider:'ashby',board:'poshmark',careersUrl:'https://poshmark.com/careers',verifiedAt:'2026-11-11'},
 {company:'HappyRobot',provider:'ashby',board:'happyrobot.ai',careersUrl:'https://www.happyrobot.ai/careers',verifiedAt:'2026-11-11'},
];
export function feedUrl(feed:JobFeed){return feed.provider==='greenhouse'?`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(feed.board)}/jobs?content=true`:`https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(feed.board)}?includeCompensation=true`;}
const clean=(value:unknown)=>String(value||'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
function roleExcerpt(text:string){
 const start=text.search(/\b(?:About the role|About this role|In this role|You will|We are (?:looking|seeking|hiring)|As an? (?:engineer|developer|manager|consultant|analyst|specialist|member|account|senior|principal|staff|director))\b/i);
 return text?text.slice(start<0?0:start).split(/\s+/).slice(0,24).join(' ')+'…':undefined;
}
function safeLink(value:unknown){try{const url=new URL(String(value));return url.protocol==='https:'?url.href:undefined;}catch{return undefined;}}
export function normalizeFeed(feed:JobFeed,data:unknown,fetchedAt:string):JobOpportunity[]{
 if(!data||typeof data!=='object'||!Array.isArray((data as any).jobs))throw new Error('Unexpected response: missing jobs array');
 const seen=new Set<string>();
 return (data as any).jobs.filter((row:any)=>feed.provider==='ashby'?row.isListed===true:row.internal_job_id!==null).map((row:any)=>{
  const url=safeLink(feed.provider==='greenhouse'?row.absolute_url:row.jobUrl);
  const sourceId=feed.provider==='greenhouse'?String(row.id??''):String(row.id||url?.split('/').filter(Boolean).at(-1)||'');
  if(!row.title||!url||!sourceId)throw new Error('Unexpected posting: missing title, HTTPS URL or source ID');
  const id=`${feed.provider}:${feed.board}:${sourceId}`;
  if(seen.has(id))throw new Error('Duplicate source posting ID');seen.add(id);
  const text=clean(feed.provider==='greenhouse'?row.content:row.descriptionPlain||row.descriptionHtml);
  const locations=feed.provider==='greenhouse'?[row.location?.name]:[row.location,...(row.secondaryLocations||[]).map((item:any)=>item.location)];
  const workplace=String(row.workplaceType||'');
  const sourceCountries=Array.from(new Set([row.address,...(row.secondaryLocations||[]).map((item:any)=>item.address)].map(address=>address?.postalAddress?.addressCountry||address?.addressCountry).filter((country):country is string=>typeof country==='string'&&!!country.trim())));
  return {id,title:clean(row.title),company:feed.company,location:locations.filter(Boolean).join(' · ')||'Location not specified',experience:'Experience not specified',salary:clean(row.compensation?.scrapeableCompensationSalarySummary)||'Not disclosed',mode:/hybrid/i.test(workplace)?'Hybrid':/remote/i.test(workplace)||row.isRemote===true?'Remote':/onsite|on.site/i.test(workplace)?'On-site':'Not specified',description:roleExcerpt(text),skills:extractSkills(text),linkedinUrl:url,sourceUrl:url,sourceProvider:feed.provider,sourceBoard:feed.board,sourceId,fetchedAt,sourceCountries,providerUpdatedAt:feed.provider==='greenhouse'?row.updated_at:undefined,postedAt:feed.provider==='ashby'?row.publishedAt:undefined,employmentType:row.employmentType};
 });
}
export function failedFeed(feed:JobFeed,previous:FeedResult|undefined,attemptedAt:string,error:string):FeedResult{return {feed,status:'failed',attemptedAt,fetchedAt:previous?.fetchedAt,jobs:previous?.jobs||[],error};}
export function isIndiaLocation(job:JobOpportunity){return /\bindia\b/i.test(job.location)||(job.sourceCountries||[]).some(country=>/^(india|ind|in)$/i.test(country.trim()));}
