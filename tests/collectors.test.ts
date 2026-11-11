import test from 'node:test';
import assert from 'node:assert/strict';
import {collectFeed,parseZuora} from '../src/domain/collectJobs';
import {jobFeeds} from '../src/domain/jobFeeds';
import {validateCatalog,fallbackCatalog} from '../src/services/jobCatalog';
const lever=jobFeeds.find(feed=>feed.provider==='lever')!;
const posting=(index:number)=>({id:String(index),text:'Java Engineer',hostedUrl:`https://jobs.lever.co/valgenesis/${index}`,categories:{location:'Chennai',commitment:'Full-time'},country:'IN',createdAt:1794399366000,workplaceType:'hybrid',descriptionPlain:'In this role you will build Java services.'});
test('Lever paginates until a short page and preserves source IDs, country and publication date',async()=>{
 const skips:string[]=[];
 const fetcher=async(input:any)=>{const skip=new URL(input).searchParams.get('skip');skips.push(skip);return new Response(JSON.stringify(skip==='0'?Array.from({length:100},(_,index)=>posting(index)):[posting(100)]));};
 const jobs=await collectFeed(lever,'2026-11-11',fetcher as typeof fetch);
 assert.equal(jobs.length,101);assert.deepEqual(skips,['0','100']);assert.equal(jobs[0].sourceProvider,'lever');assert.equal(jobs[0].sourceCountries[0],'IN');assert.equal(jobs[0].mode,'Hybrid');assert.ok(jobs[0].postedAt);
});
test('A failing later page never returns a partial snapshot',async()=>{
 const fetcher=async(input:any)=>new URL(input).searchParams.get('skip')==='0'?new Response(JSON.stringify(Array.from({length:100},(_,index)=>posting(index)))):new Response('Unavailable',{status:503});
 await assert.rejects(collectFeed(lever,'2026-11-11',fetcher as typeof fetch),/503/);
});
test('Repeated source pages fail rather than silently duplicating vacancies',async()=>{
 let page=0;const fetcher=async()=>new Response(JSON.stringify(page++===0?Array.from({length:100},(_,index)=>posting(index)):[posting(0)]));
 await assert.rejects(collectFeed(lever,'2026-11-11',fetcher as typeof fetch),/Duplicate/);
});
test('Zuora parser extracts factual metadata and rejects changed or blocked markup',()=>{
 const data=parseZuora('<html><body><h2>Browse Current Job Openings</h2><main><a href="https://www.zuora.com/careers/engineering/example/"><h3>Engineer<small><span class="JobsContent-location">Chennai, India</span></small></h3></a></main></body></html>');
 assert.equal(data.jobs[0].title,'Engineer');assert.equal(data.jobs[0].location,'Chennai, India');
 assert.throws(()=>parseZuora('<html><body>Verify you are human</body></html>'),/blocked/);
 assert.throws(()=>parseZuora('<html><body>Browse Current Job Openings<main></main></body></html>'),/no recognizable/);
});
test('A valid empty shared catalog is authoritative and malformed records fail validation',()=>{
 assert.deepEqual(validateCatalog({jobs:[],sources:[]}).jobs,[]);
 assert.throws(()=>validateCatalog({jobs:[{id:'x',title:'Role'}],sources:[]}),/invalid posting/);
 assert.throws(()=>validateCatalog({jobs:[],sources:[{id:'a',company:'A',count:3,status:'invented'}]}),/source status/);
 for(const source of fallbackCatalog.sources)assert.equal(source.count,fallbackCatalog.jobs.filter(job=>`${job.sourceProvider}:${job.sourceBoard}`===source.id).length);
});
