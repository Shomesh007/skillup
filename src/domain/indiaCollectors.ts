import {parseHTML} from 'linkedom';
import {SOUTH_CITIES,indiaOnly} from './indiaJobs';
import {normalizeFeed,type JobFeed} from './jobFeeds';
import type {JobOpportunity} from '../../types';
type Read=(response:Response)=>Promise<string>;
const json=async(fetcher:typeof fetch,read:Read,url:string,init?:RequestInit)=>JSON.parse(await read(await fetcher(url,{...init,signal:AbortSignal.timeout(25000)})));
export async function collectAccenture(feed:JobFeed,date:string,fetcher:typeof fetch,read:Read){
 const rows:any[]=[];
 // Official site request, empty keyword, Newest sort. The collection window is explicit.
 for(const city of SOUTH_CITIES){
  const body=new FormData();for(const[key,value]of Object.entries({startIndex:0,maxResultSize:50,jobKeyword:'',jobCountry:'India',jobLanguage:'en',countrySite:'in-en',sortBy:1,searchType:'vectorSearch',enableQueryBoost:true,minScore:0.6,getFeedbackJudgmentEnabled:true,useCleanEmbedding:true,score:true,totalHits:true,debugQuery:false,jobFilters:JSON.stringify([{fieldName:'location.keyword',items:[city],multiSelect:false}])}))body.append(key,String(value));
  const data=await json(fetcher,read,'https://www.accenture.com/api/accenture/elastic/findjobs',{method:'POST',headers:{'CSRF-Token':'',Accept:'application/json'},body});
  if(data.message!=='Success'||!Array.isArray(data.data))throw new Error('Accenture public search response changed');
  for(const row of data.data){if(row.country!=='India')continue;rows.push({id:row.guid,title:row.title,isListed:true,jobUrl:`https://www.accenture.com/in-en/careers/jobdetails?id=${encodeURIComponent(row.guid)}`,location:[...(row.location||[]),'India'].join(', '),country:'IN',descriptionPlain:row.jobDescriptionClean,experienceText:row.yearsOfExperience,employmentType:row.employeeType,workplaceType:row.remoteType,updatedAt:row.updateDate});}
 }
 const distinct=Array.from(new Map(rows.map(row=>[row.id,row])).values());
 return normalizeFeed(feed,{jobs:distinct},date);
}
export async function collectWipro(feed:JobFeed,date:string,fetcher:typeof fetch,read:Read){
 const rows:any[]=[];
 for(const city of SOUTH_CITIES){
  const data=await json(fetcher,read,'https://careers.wipro.com/services/recruiting/v1/jobs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({keywords:'',locale:'en_US',location:city,pageNumber:0,sortBy:'recent'})});
  if(typeof data.totalJobs!=='number'||data.totalJobs>0&&!Array.isArray(data.jobSearchResult))throw new Error('Wipro public search response changed');
  for(const item of data.jobSearchResult||[]){const row=item.response;if(!row||!Array.isArray(row.jobLocationCountry))throw new Error('Wipro location metadata missing');if(!row.jobLocationCountry.some(country=>/^india$/i.test(country)))continue;
   rows.push({id:String(row.id),title:row.unifiedStandardTitle,isListed:true,jobUrl:`https://careers.wipro.com/job/${encodeURIComponent(row.unifiedUrlTitle||row.urlTitle||'role')}/${encodeURIComponent(row.id)}-en_US`,location:(row.jobLocationShort||[]).map(location=>String(location).replace(/<[^>]*>/g,'').trim()).filter(location=>/\bIND\b|\bIndia\b/.test(location)).join(' · ')||'India',country:'IN',publishedAt:undefined});
  }
 }
 return normalizeFeed(feed,{jobs:Array.from(new Map(rows.map(row=>[row.id,row])).values())},date);
}
export async function collectInfosys(feed:JobFeed,date:string,fetcher:typeof fetch,read:Read){
 // Verified from the official portal's public environment.json and sourcelist.json on 2026-11-11.
 // Call the public unauthenticated jobs API directly; the UI asset host can reject cloud requests.
 const base=new URL('https://intapgateway.infosysapps.com/careersci/search/intapjbsrch/');
 const india={sourceList:[1,21]}; // Official India IL mapping: lateral + fresher.
 const url=new URL('getCareerSearchJobs',base);url.searchParams.set('sourceId',india.sourceList.join(','));url.searchParams.set('searchText','ALL');
 const data=await json(fetcher,read,url.href);if(!Array.isArray(data)||data.length>5000)throw new Error('Infosys India job response changed');
 const rows=data.filter(row=>!row.expiryDate||!Number.isFinite(Date.parse(row.expiryDate))||Date.parse(row.expiryDate)>=Date.parse(date)).map(row=>{
  if(!india.sourceList.includes(row.sourceId)||!row.referenceCode||!row.postingTitle)throw new Error('Infosys posting identity changed');
  return {id:String(row.postingId),title:row.postingTitle,isListed:true,jobUrl:`https://career.infosys.com/jobdesc?jobReferenceCode=${encodeURIComponent(row.referenceCode)}&sourceId=${encodeURIComponent(row.sourceId)}`,location:`${row.location||'City not specified'}, India`,country:'IN',experienceText:Number.isFinite(row.minExperienceLevel)?`${row.minExperienceLevel}${row.maxExperienceLevel!==row.minExperienceLevel?`–${row.maxExperienceLevel}`:''} years`:'Experience not specified',descriptionPlain:[row.postingDescription,row.technicalRequirement].filter(Boolean).join(' '),publishedAt:row.createdOn,employmentType:undefined};
 });
 return indiaOnly(normalizeFeed(feed,{jobs:rows},date));
}
