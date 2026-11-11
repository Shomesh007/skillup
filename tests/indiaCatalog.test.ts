import test from 'node:test';
import assert from 'node:assert/strict';
import {parseLinkedinDiscovery} from '../src/domain/linkedinDiscovery';
import {jobFeeds} from '../src/domain/jobFeeds';
import {indiaOnly,isSouthIndiaLocation} from '../src/domain/indiaJobs';
import {retainMissingGroups} from '../src/domain/jobRetention';
import type {JobOpportunity} from '../types';
const feed=jobFeeds.find(source=>source.provider==='linkedin'&&source.board==='tcs')!;
const card=(id:string,company='Tata Consultancy Services',slug='tata-consultancy-services',location='Chennai, Tamil Nadu, India',date='2026-11-10')=>`<div class="base-card" data-entity-urn="urn:li:jobPosting:${id}"><h3>Java Engineer</h3><h4><a href="https://www.linkedin.com/company/${slug}">${company}</a></h4><span class="job-search-card__location">${location}</span><time datetime="${date}"></time></div>`;
test('Portal discovery requires matching employer identity, recent date and explicit India eligibility',()=>{
 const jobs=parseLinkedinDiscovery(feed,card('1')+card('2','Tata Communications','tata-communications')+card('3','Tata Consultancy Services','wrong-company')+card('4',undefined,undefined,'California, United States')+card('5',undefined,undefined,undefined,'2026-10-01'),'2026-11-11T12:00:00Z');
 assert.equal(jobs.length,1);assert.equal(jobs[0].id,'linkedin:tcs:1');assert.equal(jobs[0].sourceUrl,'https://www.linkedin.com/jobs/view/1/');assert.equal(jobs[0].experience,'Experience not specified');
});
test('Portal blocks, missing posting metadata and repeated IDs cannot silently replace the catalog',()=>{
 assert.throws(()=>parseLinkedinDiscovery(feed,'<h1>Sign in</h1>','2026-11-11'),/unavailable/);
 assert.throws(()=>parseLinkedinDiscovery(feed,card('1').replace('2026-11-10','invalid'),'2026-11-11'),/metadata/);
 assert.throws(()=>parseLinkedinDiscovery(feed,card('1')+card('1'),'2026-11-11'),/repeated/);
});
test('India-only catalog rejects international remote listings and separates South India from other Indian cities',()=>{
 const job=(location:string,sourceCountries?:string[])=>({id:location,title:'Engineer',company:'Example',location,sourceCountries,mode:/Remote/.test(location)?'Remote':'Not specified',experience:'Not specified',salary:'Not disclosed',skills:[]} as JobOpportunity);
 const jobs=indiaOnly([job('San Francisco, United States'),job('Remote'),job('Pune, India'),job('Chennai, India'),job('India Remote')]);
 assert.equal(jobs.length,3);assert.equal(isSouthIndiaLocation(jobs[0]),false);assert.equal(isSouthIndiaLocation(jobs[1]),true);assert.equal(isSouthIndiaLocation(jobs[2]),true);
});
test('Saved applications remain accessible after a listing leaves the current catalog without duplicating current roles',()=>{
 const job=(id:string,title:string)=>({id,title,company:'Example',location:'Chennai, India',mode:'Remote',experience:'Not specified',salary:'Not disclosed',skills:[]} as JobOpportunity);
 const live=job('new','Engineer'),old=job('old','Engineer'),expired=job('expired','Analyst');
 const result=retainMissingGroups([live],[old,expired]);
 assert.deepEqual(result.map(item=>item.id),['new','expired']);
});
