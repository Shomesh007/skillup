import {parseHTML} from 'linkedom';
import {extractSkills} from './skills';
import {indiaOnly} from './indiaJobs';
import type {JobFeed} from './jobFeeds';
import type {JobOpportunity} from '../../types';
type ReadResponse=(response:Response)=>Promise<string>;
const text=(html:unknown)=>parseHTML(`<html><body>${String(html||'')}</body></html>`).document.body.textContent.replace(/\s+/g,' ').trim();
const excerpt=(value:string)=>value?value.split(/\s+/).slice(0,24).join(' ')+'…':undefined;
const validDate=(value:unknown)=>typeof value==='string'&&Number.isFinite(Date.parse(value))?value:undefined;
const india=(country:unknown)=>typeof country==='string'&&/^(IN|IND|India)$/i.test(country);
function sourceUrl(value:unknown,host:string){let url:URL;try{url=new URL(String(value));}catch{throw new Error('Missing posting URL');}if(url.protocol!=='https:'||url.hostname!==host)throw new Error('Unexpected posting host');return url.href;}
function base(feed:JobFeed,id:string,title:string,fetchedAt:string):JobOpportunity{
 if(!id||!title)throw new Error('Missing posting identity');
 return {id:`${feed.provider}:${feed.board}:${id}`,sourceProvider:feed.provider,sourceBoard:feed.board,sourceId:id,company:feed.company,title,fetchedAt,sourceCountries:['IN'],location:'India (city not specified)',experience:'Experience not specified',salary:'Not disclosed',mode:'Not specified',skills:[]};
}
function unique(jobs:JobOpportunity[]){if(jobs.length>5000||new Set(jobs.map(job=>job.id)).size!==jobs.length)throw new Error('Duplicate posting IDs or catalog limit exceeded');return jobs;}
async function get(url:string,fetcher:typeof fetch,read:ReadResponse){return JSON.parse(await read(await fetcher(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(25000)})));}

export function parseZoho(feed:JobFeed,data:any,fetchedAt:string):JobOpportunity[]{
 if(data?.code!=='success'||!Array.isArray(data.data)||data.info?.more_records===true)throw new Error('Unexpected or incomplete Zoho public job feed');
 const jobs=data.data.filter(row=>row.Publish===true&&!row.Is_Locked&&india(row.Country1||row.Country)).map(row=>{
  const id=String(row.id||'');if(!/^\d+$/.test(id))throw new Error('Invalid Zoho posting ID');
  const job=base(feed,id,text(row.Posting_Title||row.Job_Opening_Name),fetchedAt);
  const description=text(row.Job_Description);
  const url=sourceUrl(row.$url||row.Posting_Url,'careers.zohocorp.com');
  return {...job,location:[text(row.City),text(row.State),'India'].filter(Boolean).join(', '),sourceUrl:url,linkedinUrl:url,description:excerpt(description),skills:extractSkills(`${job.title} ${description}`),experience:text(row.Work_Experience)||job.experience,employmentType:text(row.Job_Type)||undefined,mode:row.Remote_Job==='Yes'?'Remote':'Not specified',postedAt:validDate(row.Date_Opened)};
 });return unique(indiaOnly(jobs));
}
export async function collectZoho(feed:JobFeed,fetchedAt:string,fetcher:typeof fetch,read:ReadResponse){
 const url='https://careers.zohocorp.com/recruit/v2/public/Job_Openings?pagename=Careers&source=CareerSite&extra_fields=%5B%22Remote_Job%22%2C%22Job_Description%22%5D';
 return parseZoho(feed,await get(url,fetcher,read),fetchedAt);
}

export function parseSmartRecruitersPosting(feed:JobFeed,row:any,fetchedAt:string):JobOpportunity|null{
 if(row?.visibility!=='PUBLIC'||row.active===false||!india(row.location?.country))return null;
 if(row.company?.identifier?.toLowerCase()!==feed.board.toLowerCase())throw new Error('SmartRecruiters employer mismatch');
 const id=String(row.id||'');if(!/^\d+$/.test(id))throw new Error('Invalid SmartRecruiters posting ID');
 const job=base(feed,id,text(row.name),fetchedAt);
 const sections=row.jobAd?.sections||{},description=text(sections.jobDescription?.text),qualifications=text(sections.qualifications?.text);
 const years=qualifications.match(/\b\d+\+?\s*(?:[-–]\s*\d+)?\s*(?:years?|yrs?)\b/i)?.[0];
 const url=sourceUrl(row.postingUrl,'jobs.smartrecruiters.com');
 return {...job,location:[row.location.city,row.location.region,'India'].filter(Boolean).join(', '),sourceUrl:url,linkedinUrl:url,postedAt:validDate(row.releasedDate),description:excerpt(description),skills:extractSkills(`${job.title} ${description} ${qualifications}`),experience:years||job.experience,mode:row.location.remote===true?'Remote':row.location.hybrid===true?'Hybrid':'Not specified',employmentType:row.typeOfEmployment?.label,seniorityLevel:row.experienceLevel?.label,jobFunction:row.function?.label,industries:row.industry?.label};
}
export async function collectSmartRecruiters(feed:JobFeed,fetchedAt:string,fetcher:typeof fetch,read:ReadResponse){
 const rows:any[]=[];let offset=0,total:number|undefined;
 do{
  const url=`https://api.smartrecruiters.com/v1/companies/${encodeURIComponent(feed.board)}/postings?country=in&limit=100&offset=${offset}`;
  const data=await get(url,fetcher,read);
  if(!Array.isArray(data.content)||!Number.isInteger(data.totalFound)||data.totalFound<0||data.offset!==offset||data.totalFound>5000)throw new Error('Unexpected SmartRecruiters page');
  if(total!==undefined&&total!==data.totalFound)throw new Error('SmartRecruiters results changed while paging');total=data.totalFound;
  if(!data.content.length&&rows.length<total)throw new Error('Incomplete SmartRecruiters page');
  rows.push(...data.content);offset+=data.content.length;
  if(offset>total)throw new Error('SmartRecruiters count mismatch');
 }while(offset<total);
 if(new Set(rows.map(row=>row.id)).size!==rows.length)throw new Error('Repeated SmartRecruiters posting IDs');
 // Read only publicly listed India postings; no account, applicant or recruiter data is requested.
 const jobs:JobOpportunity[]=[];
 for(let start=0;start<rows.length;start+=4){
  const batch=await Promise.all(rows.slice(start,start+4).filter(row=>row.visibility==='PUBLIC'&&india(row.location?.country)).map(async row=>{
   if(!/^\d+$/.test(String(row.id)))throw new Error('Invalid SmartRecruiters posting ID');
   const detail=await get(`https://api.smartrecruiters.com/v1/companies/${encodeURIComponent(feed.board)}/postings/${row.id}`,fetcher,read);
   if(String(detail.id)!==String(row.id))throw new Error('SmartRecruiters detail identity mismatch');
   return parseSmartRecruitersPosting(feed,detail,fetchedAt);
  }));jobs.push(...batch.filter((job):job is JobOpportunity=>job!==null));
 }return unique(indiaOnly(jobs));
}

export function parseHexawarePage(feed:JobFeed,data:any,fetchedAt:string){
 const result=data?.items?.[0];
 if(!result||result.SiteNumber!=='CX_1'||!Array.isArray(result.requisitionList)||!Number.isInteger(result.TotalJobsCount)||result.TotalJobsCount<0||result.TotalJobsCount>5000)throw new Error('Unexpected Hexaware careers response');
 const jobs=result.requisitionList.filter(row=>india(row.PrimaryLocationCountry)&&(!row.PostingEndDate||Date.parse(row.PostingEndDate)>=Date.parse(fetchedAt))).map(row=>{
  const id=String(row.Id||'');if(!/^[A-Za-z0-9_-]{1,80}$/.test(id))throw new Error('Invalid Hexaware posting ID');
  const job=base(feed,id,text(row.Title),fetchedAt),description=text(row.ShortDescriptionStr);
  const url=`https://fa-etqo-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/${id}`;
  const locations=[row.PrimaryLocation,...(row.secondaryLocations||[]).filter(item=>india(item.CountryCode||item.Country)).map(item=>item.Location)].filter(Boolean);
  return {...job,location:locations.join(' · ')||'India (city not specified)',sourceUrl:url,linkedinUrl:url,postedAt:validDate(row.PostedDate),description:excerpt(description),skills:extractSkills(`${job.title} ${description}`),mode:/^remote$/i.test(row.WorkplaceType||'')?'Remote':/^hybrid$/i.test(row.WorkplaceType||'')?'Hybrid':'Not specified',employmentType:row.JobSchedule||undefined};
 });return {jobs:indiaOnly(jobs),total:result.TotalJobsCount,pageSize:result.requisitionList.length,offset:result.Offset};
}
export async function collectHexaware(feed:JobFeed,fetchedAt:string,fetcher:typeof fetch,read:ReadResponse){
 const jobs:JobOpportunity[]=[];let offset=0,total:number|undefined;
 do{
  const url=new URL('https://fa-etqo-saasfaprod1.fa.ocs.oraclecloud.com/hcmRestApi/resources/latest/recruitingCEJobRequisitions');
  url.searchParams.set('onlyData','true');url.searchParams.set('expand','requisitionList.secondaryLocations');url.searchParams.set('finder',`findReqs;siteNumber=CX_1,limit=100,offset=${offset},sortBy=POSTING_DATES_DESC`);
  const page=parseHexawarePage(feed,await get(url.href,fetcher,read),fetchedAt);
  if(page.offset!==offset||total!==undefined&&page.total!==total)throw new Error('Hexaware results changed while paging');total=page.total;
  if(!page.pageSize&&offset<total)throw new Error('Incomplete Hexaware page');
  jobs.push(...page.jobs);offset+=page.pageSize;
  if(offset>total)throw new Error('Hexaware count mismatch');
 }while(offset<total);
 return unique(jobs);
}
