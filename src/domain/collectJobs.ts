import {linkedinSearchUrl,parseLinkedinDiscovery} from './linkedinDiscovery';
import {indiaOnly} from './indiaJobs';
import {collectAccenture,collectWipro,collectInfosys} from './indiaCollectors';
import {parseHTML} from 'linkedom';
import {feedUrl,normalizeFeed,type JobFeed} from './jobFeeds';
import type {JobOpportunity} from '../../types';
const MAX_BYTES=12_000_000;
async function read(response:Response){
 if(!response.ok)throw new Error(`Source returned HTTP ${response.status}`);
 if(Number(response.headers.get('content-length'))>MAX_BYTES)throw new Error('Source response exceeds size limit');
 const reader=response.body?.getReader();if(!reader)throw new Error('Missing source response body');
 const chunks:Uint8Array[]=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_BYTES){await reader.cancel();throw new Error('Source response exceeds size limit');}chunks.push(value);}
 const data=new Uint8Array(size);let offset=0;for(const chunk of chunks){data.set(chunk,offset);offset+=chunk.length;}return new TextDecoder().decode(data);
}
export function parseZuora(html:string){
 const {document}=parseHTML(html);
 if(!/Browse Current Job Openings/i.test(document.body?.textContent||''))throw new Error('Zuora page structure changed or access was blocked');
 const links=Array.from(document.querySelectorAll('main a[href]')).filter(el=>{try{return new URL(el.getAttribute('href')||'').pathname.startsWith('/careers/');}catch{return false;}});
 // An unexpected empty HTML page must never retire the previous catalog.
 if(!links.length)throw new Error('Zuora returned no recognizable job rows; manual review needed');
 return {jobs:links.map(el=>{
  const url=new URL(el.getAttribute('href')||'');if(url.origin!=='https://www.zuora.com')throw new Error('Unexpected Zuora job host');
  const title=Array.from(el.querySelector('h3')?.childNodes||[]).filter(node=>node.nodeType===3).map(node=>node.textContent).join(' ').trim();
  const location=Array.from(el.querySelectorAll('.JobsContent-location')).map(node=>node.textContent.trim()).join(' · ');
  if(!title||!location)throw new Error('Zuora job row format changed');
  return {id:url.pathname,title,location,jobUrl:url.href,isListed:true,workplaceType:/remote/i.test(location)?'Remote':undefined};
 })};
}
export async function collectFeed(feed:JobFeed,fetchedAt:string,fetcher:typeof fetch=fetch):Promise<JobOpportunity[]>{
 if(feed.provider==='linkedin'){const response=await fetcher(linkedinSearchUrl(feed),{signal:AbortSignal.timeout(25000),headers:{Accept:'text/html'}});return parseLinkedinDiscovery(feed,await read(response),fetchedAt);}
 if(feed.provider==='accenture')return indiaOnly(await collectAccenture(feed,fetchedAt,fetcher,read));
 if(feed.provider==='wipro')return indiaOnly(await collectWipro(feed,fetchedAt,fetcher,read));
 if(feed.provider==='infosys')return collectInfosys(feed,fetchedAt,fetcher,read);
 const jobs:JobOpportunity[]=[];let skip=0;
 while(true){
  const url=new URL(feedUrl(feed));if(feed.provider==='lever')url.searchParams.set('skip',String(skip));
  const text=await read(await fetcher(url,{signal:AbortSignal.timeout(25000),headers:{Accept:feed.provider==='zuora'?'text/html':'application/json'}}));
  const data=feed.provider==='zuora'?parseZuora(text):JSON.parse(text);
  const normalized=normalizeFeed(feed,data,fetchedAt);jobs.push(...normalized);
  if(jobs.length>5000)throw new Error('Catalog limit exceeded; source needs a larger collection configuration');
  if(feed.provider!=='lever'||!Array.isArray(data)||data.length<100)break;
  skip+=100;
 }
 if(new Set(jobs.map(job=>job.id)).size!==jobs.length)throw new Error('Duplicate job IDs across source pages');
 return indiaOnly(jobs);
}
