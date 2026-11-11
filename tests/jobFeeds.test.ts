import test from 'node:test';
import assert from 'node:assert/strict';
import {jobFeeds,normalizeFeed,failedFeed,isIndiaLocation} from '../src/domain/jobFeeds';
import {companyResearch,companyKey} from '../src/data/companyResearch';
import official from '../src/data/officialJobs.json';
import browser from '../src/data/browserJobs.json';
test('Greenhouse updates are not represented as posting dates; unknown modes stay unknown',()=>{
 const [job]=normalizeFeed(jobFeeds[0],{jobs:[{id:42,title:'Java developer',location:{name:'Chennai, India'},absolute_url:'https://careers.appian.com/jobs/42',updated_at:'2026-11-10',content:'<p>Build Java services with SQL and JavaScript.</p>'}]},'2026-11-11');
 assert.equal(job.postedAt,undefined);assert.equal(job.providerUpdatedAt,'2026-11-10');assert.equal(job.mode,'Not specified');assert.equal(job.id,'greenhouse:appian:42');assert.ok(job.skills.includes('Java'));assert.ok(job.skills.includes('JavaScript'));
});
test('Ashby keeps only listed postings, published dates and secondary locations',()=>{
 const jobs=normalizeFeed(jobFeeds[1],{jobs:[{isListed:true,title:'Engineer',jobUrl:'https://jobs.ashbyhq.com/poshmark/123',location:'Chennai, India',secondaryLocations:[{location:'Bengaluru, India'}],publishedAt:'2026-11-10',workplaceType:'Hybrid',descriptionPlain:'A '.repeat(60)},{isListed:false}]},'2026-11-11');
 assert.equal(jobs.length,1);assert.equal(jobs[0].mode,'Hybrid');assert.equal(jobs[0].postedAt,'2026-11-10');assert.match(jobs[0].location,/Bengaluru/);assert.equal(jobs[0].description.split(/\s+/).length,24);
});
test('Invalid responses fail rather than silently reporting no vacancies',()=>{
 assert.throws(()=>normalizeFeed(jobFeeds[0],{error:'unavailable'},'2026-11-11'));
 assert.throws(()=>normalizeFeed(jobFeeds[0],{jobs:[{title:'Invalid',id:1,absolute_url:'javascript:alert(1)'}]},'2026-11-11'));
 assert.deepEqual(normalizeFeed(jobFeeds[0],{jobs:[]},'2026-11-11'),[]);
});
test('India filter uses supplied country metadata and never treats remote as worldwide eligibility',()=>{
 const [job]=normalizeFeed(jobFeeds[1],{jobs:[{isListed:true,title:'Engineer',jobUrl:'https://jobs.ashbyhq.com/poshmark/123',location:'Chennai',address:{postalAddress:{addressCountry:'IND'}},isRemote:true}]},'2026-11-11');
 assert.equal(isIndiaLocation(job),true);
 assert.equal(isIndiaLocation({...job,location:'Remote',sourceCountries:['USA']}),false);
 assert.equal(isIndiaLocation({...job,location:'Chennai, India',sourceCountries:[]}),true);
});
test('Failed refresh retains last successful data and retrieval date',()=>{
 const previous={feed:jobFeeds[0],status:'ok' as const,attemptedAt:'2026-11-10',fetchedAt:'2026-11-10',jobs:[{id:'existing'} as any]};
 const failed=failedFeed(jobFeeds[0],previous,'2026-11-11','HTTP 503');assert.equal(failed.jobs,previous.jobs);assert.equal(failed.fetchedAt,'2026-11-10');assert.equal(failed.status,'failed');assert.equal(failed.attemptedAt,'2026-11-11');
});
test('Research names are unique, sources use HTTPS and guidance has a stated scope',()=>{
 assert.equal(new Set(companyResearch.map(item=>companyKey(item.name))).size,companyResearch.length);
 for(const item of companyResearch){assert.equal(new URL(item.sourceUrl).protocol,'https:');assert.ok(item.scope);assert.ok(item.reviewedAt);for(const faq of item.faqs)assert.equal(new URL(faq.sourceUrl||item.sourceUrl).protocol,'https:');}
});
test('Collected records have unique provider identities and date provenance',()=>{
 const jobs=[...official.feeds.flatMap<any>(feed=>feed.jobs),...browser.jobs];
 assert.equal(new Set(jobs.map(job=>job.id)).size,jobs.length);
 for(const job of jobs){assert.ok(job.title&&job.company&&job.sourceId&&job.sourceProvider);assert.ok(Number.isFinite(Date.parse(job.fetchedAt)));assert.equal(new URL(job.sourceUrl).protocol,'https:');if(job.description)assert.ok(job.description.split(/\s+/).length<=24);}
});
