import test from 'node:test';
import assert from 'node:assert/strict';
import {collectFeed} from '../src/domain/collectJobs';
import {parseZoho,parseSmartRecruitersPosting,parseHexawarePage} from '../src/domain/companyCollectors';
import {parseLinkedinDiscovery} from '../src/domain/linkedinDiscovery';
import {jobFeeds} from '../src/domain/jobFeeds';
const feed=(company:string)=>jobFeeds.find(item=>item.company===company)!;
const date='2026-11-11T12:00:00Z';
test('Zoho requires published, unlocked India openings and preserves unknown cities',()=>{
 const row={id:'123',Posting_Title:'Support Engineer',Country1:'India',Publish:true,Job_Type:'Full time',$url:'https://careers.zohocorp.com/jobs/Careers/123/Support-Engineer',Job_Description:'Support customers using Java and SQL.'};
 const jobs=parseZoho(feed('Zoho'),{code:'success',data:[row,{...row,id:'124',Publish:false},{...row,id:'125',Is_Locked:true},{...row,id:'126',Country1:'United States'}]},date);
 assert.equal(jobs.length,1);assert.equal(jobs[0].location,'India');assert.equal(jobs[0].postedAt,undefined);assert.equal(jobs[0].mode,'Not specified');assert.deepEqual(jobs[0].skills,['Java','SQL']);
 assert.deepEqual(parseZoho(feed('Zoho'),{code:'success',data:[]},date),[]);
 assert.throws(()=>parseZoho(feed('Zoho'),{code:'success',data:[row],info:{more_records:true}},date),/incomplete/);
 assert.throws(()=>parseZoho(feed('Zoho'),{code:'error',data:[]},date),/Unexpected/);
 assert.throws(()=>parseZoho(feed('Zoho'),{code:'success',data:[{...row,$url:'https://example.com/jobs/123'}]},date),/host/);
});
const smartRow=(id:string)=>({id,name:'Engineer',company:{identifier:'Freshworks'},visibility:'PUBLIC',active:true,location:{country:'in',city:'Chennai',remote:false,hybrid:false},postingUrl:`https://jobs.smartrecruiters.com/Freshworks/${id}-engineer`,releasedDate:date,jobAd:{sections:{jobDescription:{text:'<p>Build Java services.</p>'},qualifications:{text:'<p>5+ years of relevant experience.</p>'}}},compensation:{min:0,max:0}});
test('Freshworks consumes every page and public detail, without treating zero compensation as a salary',async()=>{
 const requests:string[]=[];
 const fetcher=async(input:any)=>{const url=new URL(input);requests.push(url.href);if(/\/postings\/\d+$/.test(url.pathname))return Response.json(smartRow(url.pathname.split('/').at(-1)!));const offset=Number(url.searchParams.get('offset'));return Response.json({offset,totalFound:2,content:[smartRow(offset===0?'1':'2')]});};
 const jobs=await collectFeed(feed('Freshworks'),date,fetcher as typeof fetch);
 assert.equal(jobs.length,2);assert.equal(jobs[0].experience,'5+ years');assert.equal(jobs[0].salary,'Not disclosed');assert.equal(jobs[0].mode,'Not specified');assert.equal(jobs[0].sourceCountries?.[0],'IN');assert.equal(requests.length,4);
 assert.equal(parseSmartRecruitersPosting(feed('Freshworks'),{...smartRow('3'),visibility:'INTERNAL'},date),null);
 assert.equal(parseSmartRecruitersPosting(feed('Freshworks'),{...smartRow('3'),location:{country:'us'}},date),null);
});
test('Freshworks rejects incomplete, repeated and mismatched pages before replacing a snapshot',async()=>{
 await assert.rejects(collectFeed(feed('Freshworks'),date,(async()=>Response.json({offset:0,totalFound:2,content:[]})) as typeof fetch),/Incomplete/);
 let count=0;await assert.rejects(collectFeed(feed('Freshworks'),date,(async()=>Response.json({offset:count++,totalFound:2,content:[smartRow('1')]})) as typeof fetch),/Repeated/);
 assert.throws(()=>parseSmartRecruitersPosting(feed('Freshworks'),{...smartRow('1'),company:{identifier:'Other'}},date),/employer/);
});
const hexRow=(Id:string,country='IN')=>({Id,Title:'DevOps Engineer',PrimaryLocationCountry:country,PrimaryLocation:country==='IN'?'Chennai, India':'United States',PostedDate:'2026-11-10',secondaryLocations:[]});
test('Hexaware preserves alphanumeric requisitions and reads all pages before filtering India',async()=>{
 const fetcher=async(input:any)=>{const offset=Number(new URL(input).searchParams.get('finder')!.match(/offset=(\d+)/)![1]);return Response.json({items:[{SiteNumber:'CX_1',Offset:offset,TotalJobsCount:3,requisitionList:offset===0?[hexRow('123'),hexRow('124','US')]:[hexRow('HC_264311')]}]});};
 const jobs=await collectFeed(feed('Hexaware'),date,fetcher as typeof fetch);
 assert.deepEqual(jobs.map(job=>job.sourceId),['123','HC_264311']);assert.ok(jobs[1].sourceUrl?.endsWith('/job/HC_264311'));
 const expired=hexRow('555');(expired as any).PostingEndDate='2026-11-01';
 assert.equal(parseHexawarePage(feed('Hexaware'),{items:[{SiteNumber:'CX_1',Offset:0,TotalJobsCount:1,requisitionList:[expired]}]},date).jobs.length,0);
 await assert.rejects(collectFeed(feed('Hexaware'),date,(async()=>Response.json({items:[{SiteNumber:'CX_1',Offset:0,TotalJobsCount:1,requisitionList:[]}]})) as typeof fetch),/Incomplete/);
});
test('UST discovery excludes similarly named employers and retains the verified company slug',()=>{
 const card=(id:string,name:string,slug:string)=>`<div class="base-card" data-entity-urn="urn:li:jobPosting:${id}"><h3>Java Engineer</h3><h4><a href="https://www.linkedin.com/company/${slug}">${name}</a></h4><span class="job-search-card__location">Kochi, Kerala, India</span><time datetime="2026-11-10"></time></div>`;
 const jobs=parseLinkedinDiscovery(feed('UST'),card('1','UST','ustglobal')+card('2','UST Software India','ust-software-india')+card('3','UST','other-company'),date);
 assert.equal(jobs.length,1);assert.equal(jobs[0].id,'linkedin:ust:1');
});
