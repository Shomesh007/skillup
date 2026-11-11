import assert from 'node:assert/strict';
import {readJobCatalog} from '../src/services/jobCatalog';
import {jobBackendUrl} from '../src/config/jobBackend';
import {isIndiaLocation} from '../src/domain/jobFeeds';
const catalog=await readJobCatalog();
assert.ok(catalog.jobs.every(isIndiaLocation),'Every public posting must have explicit India eligibility');
const unauthorized=await fetch(`${jobBackendUrl}/functions/v1/skillup-jobs-refresh`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sourceId:'greenhouse:appian'}),signal:AbortSignal.timeout(20000)});
assert.equal(unauthorized.status,401,'Collector must reject unauthenticated refreshes');
console.log(JSON.stringify({origin:catalog.origin,jobs:catalog.jobs.length,india:catalog.jobs.filter(isIndiaLocation).length,sources:catalog.sources.map(source=>({company:source.company,status:source.status,count:source.count})),unauthorizedRefreshStatus:unauthorized.status}));
