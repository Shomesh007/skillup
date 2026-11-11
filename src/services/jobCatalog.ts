import type {JobOpportunity} from '../../types';
import {jobBackendUrl,jobPublishableKey} from '../config/jobBackend';
import snapshot from '../data/jobFallback.json';
export interface CatalogSource {id:string;company:string;provider:string;board:string;careersUrl:string;attemptedAt?:string;fetchedAt?:string;status:string;count:number;error?:string;coverage?:string;}
export interface JobCatalog {jobs:JobOpportunity[];sources:CatalogSource[];retrievedAt?:string;origin:'cloud'|'snapshot';warning?:string;}
export const fallbackCatalog:JobCatalog={origin:'snapshot',jobs:snapshot.feeds.flatMap<any>(feed=>feed.jobs),sources:snapshot.feeds.map(item=>({id:`${item.feed.provider}:${item.feed.board}`,company:item.feed.company,provider:item.feed.provider,board:item.feed.board,careersUrl:item.feed.careersUrl,attemptedAt:item.attemptedAt,fetchedAt:item.fetchedAt,status:item.status,count:item.jobs.length}))};
export function validateCatalog(data:unknown):Omit<JobCatalog,'origin'|'warning'>{
 if(!data||typeof data!=='object')throw new Error('Invalid catalog response');
 const catalog=data as JobCatalog;
 if(!Array.isArray(catalog.jobs)||!Array.isArray(catalog.sources)||catalog.jobs.length>30000||catalog.sources.length>500)throw new Error('Invalid catalog shape');
 for(const job of catalog.jobs){if(!job.id||!job.title||!job.company||!job.sourceProvider||!job.sourceBoard||!job.sourceUrl?.startsWith('https://')||!Number.isFinite(Date.parse(job.fetchedAt||''))||!['experience','salary','location','mode'].every(key=>typeof job[key]==='string'))throw new Error('Catalog contains an invalid posting');}
 if(new Set(catalog.jobs.map(job=>job.id)).size!==catalog.jobs.length)throw new Error('Catalog contains duplicate posting IDs');
 for(const source of catalog.sources){if(!source.id||!source.company||!['pending','running','ok','failed'].includes(source.status)||!Number.isInteger(source.count)||source.count<0)throw new Error('Invalid source status');}
 return {jobs:catalog.jobs,sources:catalog.sources,retrievedAt:catalog.retrievedAt};
}
export async function readJobCatalog(signal?:AbortSignal):Promise<JobCatalog>{
 const response=await fetch(`${jobBackendUrl}/rest/v1/rpc/skillup_read_job_catalog`,{headers:{apikey:jobPublishableKey},signal:signal?AbortSignal.any([signal,AbortSignal.timeout(20000)]):AbortSignal.timeout(20000),cache:'no-store'});
 if(!response.ok)throw new Error(`Catalog unavailable (${response.status})`);
 return {...validateCatalog(await response.json()),origin:'cloud'};
}
