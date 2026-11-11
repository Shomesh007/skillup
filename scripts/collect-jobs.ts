import { readFile,writeFile,mkdir,rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { jobFeeds,feedUrl,normalizeFeed,failedFeed,type JobSnapshot } from '../src/domain/jobFeeds';
import {collectFeed} from '../src/domain/collectJobs';
const target=fileURLToPath(new URL('../src/data/officialJobs.json',import.meta.url));
let previous:JobSnapshot={version:1,feeds:[]};
try{previous=JSON.parse(await readFile(target,'utf8'));}catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;}
const snapshot:JobSnapshot={version:1,feeds:[]};
for(const feed of jobFeeds){
 const attemptedAt=new Date().toISOString();
 try{
  // Public read-only APIs. No accounts, applicant data, application submissions or HTML crawling.
  const jobs=await collectFeed(feed,attemptedAt);
  snapshot.feeds.push({feed,attemptedAt,fetchedAt:attemptedAt,status:'ok',jobs});
  console.log(`${feed.company}: ${jobs.length} India listings collected`);
 }catch(error){
  const message=error instanceof Error?error.message:'Collection failed';
  snapshot.feeds.push(failedFeed(feed,previous.feeds.find(item=>item.feed.provider===feed.provider&&item.feed.board===feed.board),attemptedAt,message));
  console.error(`${feed.company}: ${message}; retained last successful snapshot`);
 }
}
await mkdir(dirname(target),{recursive:true});
await writeFile(target+'.tmp',JSON.stringify(snapshot,null,2)+'\n');await rename(target+'.tmp',target);
if(snapshot.feeds.some(item=>item.status==='failed'))process.exitCode=1;
