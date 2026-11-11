// Deployment package includes the shared, tested collector modules. No AI API is used.
import {jobFeeds,feedId} from '../../../src/domain/jobFeeds';
import {collectFeed} from '../../../src/domain/collectJobs';
declare const Deno:{env:{get(name:string):string|undefined};serve(handler:(request:Request)=>Promise<Response>):void};
const projectUrl=Deno.env.get('SUPABASE_URL')!;
const serverKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
async function rpc(name:string,args:unknown){
 const response=await fetch(`${projectUrl}/rest/v1/rpc/${name}`,{method:'POST',headers:{'Content-Type':'application/json',apikey:serverKey,Authorization:`Bearer ${serverKey}`},body:JSON.stringify(args),signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw new Error(`Catalog operation ${name} failed (${response.status})`);
 return response.json();
}
const reply=(status:number,data:unknown)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
Deno.serve(async request=>{
 if(request.method!=='POST')return reply(405,{error:'POST required'});
 const token=request.headers.get('X-Skillup-Collector-Token')||'';
 if(!/^[a-f0-9]{64}$/.test(token))return reply(401,{error:'Unauthorized'});
 let runId:string|null=null,sourceId='';
 try{
  if(!await rpc('skillup_authorize_refresh',{p_token:token}))return reply(401,{error:'Unauthorized'});
  if(Number(request.headers.get('content-length'))>1024)return reply(413,{error:'Request too large'});
  const body=await request.text();if(body.length>1024)return reply(413,{error:'Request too large'});
  let input;try{input=JSON.parse(body);}catch{return reply(400,{error:'Invalid JSON'});}
  const feed=jobFeeds.find(item=>feedId(item)===input.sourceId);if(!feed)return reply(400,{error:'Unknown source'});
  sourceId=feedId(feed);runId=await rpc('skillup_begin_refresh',{p_source_id:sourceId});
  if(!runId)return reply(200,{sourceId,status:'already-running'});
  const jobs=await collectFeed(feed,new Date().toISOString());
  await rpc('skillup_finish_refresh',{p_source_id:sourceId,p_run_id:runId,p_jobs:jobs,p_error:null});
  return reply(200,{sourceId,status:'ok',count:jobs.length});
 }catch(error){
  const message=error instanceof Error?error.message:'Collector failed';
  if(runId)try{await rpc('skillup_finish_refresh',{p_source_id:sourceId,p_run_id:runId,p_jobs:[],p_error:message});}catch{console.error('Could not record collector failure',sourceId);}
  console.error('Collector failure',sourceId,message);
  return reply(502,{sourceId,status:'failed',error:message});
 }
});
