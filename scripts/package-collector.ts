import {readFile} from 'node:fs/promises';
const base=new URL('../',import.meta.url);
const read=(name:string)=>readFile(new URL(name,base),'utf8');
const files=[
 {name:'index.ts',content:(await read('supabase/functions/skillup-jobs-refresh/index.ts')).replace("'../../../src/domain/jobFeeds'","'./jobFeeds.ts'").replace("'../../../src/domain/collectJobs'","'./collectJobs.ts'")},
 {name:'jobFeeds.ts',content:(await read('src/domain/jobFeeds.ts')).replace("'../../types'","'./types.ts'").replace("'./skills'","'./skills.ts'")},
 {name:'collectJobs.ts',content:(await read('src/domain/collectJobs.ts')).replace("'../../types'","'./types.ts'").replace("'./jobFeeds'","'./jobFeeds.ts'").replace("'./indiaJobs'","'./indiaJobs.ts'").replace("'./indiaCollectors'","'./indiaCollectors.ts'").replace("'./linkedinDiscovery'","'./linkedinDiscovery.ts'").replace("'./companyCollectors'","'./companyCollectors.ts'")},
 {name:'companyCollectors.ts',content:(await read('src/domain/companyCollectors.ts')).replace("'../../types'","'./types.ts'").replace("'./jobFeeds'","'./jobFeeds.ts'").replace("'./indiaJobs'","'./indiaJobs.ts'").replace("'./skills'","'./skills.ts'")},
 {name:'indiaJobs.ts',content:(await read('src/domain/indiaJobs.ts')).replace("'../../types'","'./types.ts'").replace("'./jobFeeds'","'./jobFeeds.ts'")},
 {name:'indiaCollectors.ts',content:(await read('src/domain/indiaCollectors.ts')).replace("'../../types'","'./types.ts'").replace("'./jobFeeds'","'./jobFeeds.ts'").replace("'./indiaJobs'","'./indiaJobs.ts'")},
 {name:'linkedinDiscovery.ts',content:(await read('src/domain/linkedinDiscovery.ts')).replace("'../../types'","'./types.ts'").replace("'./jobFeeds'","'./jobFeeds.ts'").replace("'./indiaJobs'","'./indiaJobs.ts'").replace("'./skills'","'./skills.ts'")},
 {name:'skills.ts',content:await read('src/domain/skills.ts')},
 {name:'types.ts',content:await read('types.ts')},
 {name:'deno.json',content:JSON.stringify({imports:{linkedom:'npm:linkedom@0.18.12'}})},
];
console.log(JSON.stringify(files));
