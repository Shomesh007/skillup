import {readFile,writeFile} from 'node:fs/promises';
import type {JobOpportunity} from '../types';
const input=process.argv[2];if(!input)throw new Error('Pass a browser capture JSON path');
const capture=JSON.parse(await readFile(input,'utf8'));
if(capture.company!=='Zuora'||capture.source!=='https://www.zuora.com/careers-search-jobs/'||!Number.isFinite(Date.parse(capture.fetchedAt))||!Array.isArray(capture.jobs))throw new Error('Unexpected browser capture');
const jobs:JobOpportunity[]=capture.jobs.map((row:any)=>{
 const url=new URL(row.sourceUrl);
 if(url.origin!=='https://www.zuora.com'||!url.pathname.startsWith('/careers/')||!row.title||!row.location)throw new Error('Invalid browser job metadata');
 return {id:`browser:zuora:${url.pathname}`,sourceId:url.pathname,sourceProvider:'browser',sourceBoard:'zuora',sourceUrl:url.href,linkedinUrl:url.href,company:'Zuora',title:row.title,location:row.location,mode:/remote/i.test(row.location)?'Remote':'Not specified',experience:'Experience not specified',salary:'Not disclosed',fetchedAt:capture.fetchedAt,skills:[]};
});
if(new Set(jobs.map(job=>job.id)).size!==jobs.length)throw new Error('Duplicate browser capture IDs');
await writeFile(new URL('../src/data/browserJobs.json',import.meta.url),JSON.stringify({source:capture.source,fetchedAt:capture.fetchedAt,jobs},null,2)+'\n');
console.log(`Imported ${jobs.length} Zuora browser-captured postings`);
