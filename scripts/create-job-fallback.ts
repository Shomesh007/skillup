import {readFile,writeFile} from 'node:fs/promises';
import type {JobSnapshot} from '../src/domain/jobFeeds';
import {isIndiaLocation} from '../src/domain/jobFeeds';
const snapshot:JobSnapshot=JSON.parse(await readFile(new URL('../src/data/officialJobs.json',import.meta.url),'utf8'));
const feeds=snapshot.feeds.map(source=>({...source,jobs:source.jobs.filter(isIndiaLocation).slice(0,10)}));
await writeFile(new URL('../src/data/jobFallback.json',import.meta.url),JSON.stringify({version:1,coverage:'sample',feeds},null,2)+'\n');
console.log(`Saved ${feeds.reduce((sum,feed)=>sum+feed.jobs.length,0)} sample postings for offline fallback`);
