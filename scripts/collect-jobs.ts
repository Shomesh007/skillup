import { readFile,writeFile,mkdir,rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { jobFeeds,feedId,failedFeed,type JobSnapshot } from '../src/domain/jobFeeds';
import {collectFeed} from '../src/domain/collectJobs';
const target=fileURLToPath(new URL('../src/data/officialJobs.json',import.meta.url));
let previous:JobSnapshot={version:1,feeds:[]};
try{previous=JSON.parse(await readFile(target,'utf8'));}catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;}
const snapshot:JobSnapshot={version:1,feeds:[]};
const selected=process.argv.slice(2);
if(selected.some(id=>!jobFeeds.some(feed=>feedId(feed)===id)))throw new Error('Unknown source ID; use provider:board from jobFeeds');
for(const feed of jobFeeds){
 if(selected.length&&!selected.includes(feedId(feed))){const retained=previous.feeds.find(item=>feedId(item.feed)===feedId(feed));if(retained)snapshot.feeds.push(retained);continue;}
 const attemptedAt=new Date().toISOString();
 try{
  // Public read-only APIs and listing HTML. No sign-in, applicant data or application submissions.
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
