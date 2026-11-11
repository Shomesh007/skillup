import {useCallback,useEffect,useRef,useState} from 'react';
import {fallbackCatalog,readJobCatalog} from '../../src/services/jobCatalog';
export function useJobCatalog(){
 const [catalog,setCatalog]=useState(fallbackCatalog),[loading,setLoading]=useState(true);
 const active=useRef(true),request=useRef<AbortController|null>(null);
 const refresh=useCallback(async()=>{
  if(request.current)return;const controller=new AbortController();request.current=controller;setLoading(true);
  try{const next=await readJobCatalog(controller.signal);if(active.current)setCatalog(next);}
  catch{if(active.current&&!controller.signal.aborted)setCatalog(previous=>({...previous,warning:previous.origin==='cloud'?'Could not check for updates. Showing the last catalog loaded on this page.':'The shared catalog is unavailable. Showing a saved snapshot; its retrieval dates are listed below.'}));}
  finally{if(request.current===controller){request.current=null;if(active.current)setLoading(false);}}
 },[]);
 useEffect(()=>{active.current=true;void refresh();const interval=setInterval(()=>{if(document.visibilityState==='visible')void refresh();},15*60*1000);const visible=()=>{if(document.visibilityState==='visible')void refresh();};document.addEventListener('visibilitychange',visible);return ()=>{active.current=false;request.current?.abort();request.current=null;clearInterval(interval);document.removeEventListener('visibilitychange',visible);};},[refresh]);
 return {catalog,loading,refresh};
}
