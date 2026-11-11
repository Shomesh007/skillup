import React, { useCallback, useEffect, useRef, useState } from 'react';
import {writeJSON,readDraft,rememberUnsaved,forgetUnsaved,unsavedEntries,PersistenceState} from '../../src/domain/storage';
import { Icon } from '../Brand';
export function useStoredState<T>(key:string,initial:T):[T,(next:T|((previous:T)=>T))=>boolean,PersistenceState]{
 const read=()=>readDraft(()=>localStorage,key,initial);
 const [value,setState]=useState<T>(()=>read().value),[persistence,setPersistence]=useState<PersistenceState>(()=>read());
 const latest=useRef(value);latest.current=value;const failed=useRef(false);
 useEffect(()=>{
  failed.current=false;
  const refresh=(event:Event)=>{
   if(event instanceof CustomEvent&&event.detail!==key)return;
   if(event instanceof StorageEvent&&event.key!==null&&event.key!==key)return;
   if(failed.current)return;
   const loaded=read();latest.current=loaded.value;setState(loaded.value);setPersistence(loaded);failed.current=loaded.status==='error'&&unsavedEntries().some(([entry])=>entry===key);
  };
  refresh(new Event('storage'));window.addEventListener('storage',refresh);window.addEventListener('skillup:data',refresh);
  return()=>{window.removeEventListener('storage',refresh);window.removeEventListener('skillup:data',refresh);};
 },[key]);
 const setValue=useCallback((next:T|((previous:T)=>T))=>{
  const resolved=typeof next==='function'?(next as (previous:T)=>T)(latest.current):next;latest.current=resolved;setState(resolved);
  let result:{ok:boolean;error:string|null};try{result=writeJSON(localStorage,key,resolved);}catch{result={ok:false,error:'Changes are only in memory. Keep this tab open and export a backup.'};}
  failed.current=!result.ok;if(result.ok)forgetUnsaved(key);else rememberUnsaved(key,resolved);setPersistence({status:result.ok?'saved':'error',error:result.error});
  if(result.ok)window.dispatchEvent(new CustomEvent('skillup:data',{detail:key}));return result.ok;
 },[key]);
 return [value,setValue,persistence];
}
export function Page({title,description,actions,children,className=''}:{title:string;description?:string;actions?:React.ReactNode;children:React.ReactNode;className?:string}){return <div className={`product-page ${className}`}><header className="product-page-header"><div><h1>{title}</h1>{description&&<p>{description}</p>}</div>{actions&&<div className="product-header-actions">{actions}</div>}</header>{children}</div>;}
export function Button({children,variant='secondary',className='',...props}:React.ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'ghost'}){return <button className={`ui-button ui-button-${variant} ${className}`} type="button" {...props}>{children}</button>;}
export function Field({label,id,hint,children}:{label:string;id:string;hint?:string;children:React.ReactNode}){return <div className="ui-field"><label htmlFor={id}>{label}</label>{children}{hint&&<p className="ui-field-hint">{hint}</p>}</div>;}
export function Tabs({items,value,onChange,label}:{items:string[];value:string;onChange:(value:string)=>void;label:string}){return <div className="ui-tabs" role="group" aria-label={label}>{items.map(item=><button key={item} type="button" aria-pressed={item===value} onClick={()=>onChange(item)}>{item}</button>)}</div>;}
export function Empty({title,description,icon='inbox',action}:{title:string;description:string;icon?:string;action?:React.ReactNode}){return <div className="ui-empty"><Icon name={icon} size={26}/><h2>{title}</h2><p>{description}</p>{action}</div>;}
export function Section({title,aside,children}:{title:string;aside?:React.ReactNode;children:React.ReactNode}){return <section className="ui-section"><div className="ui-section-heading"><h2>{title}</h2>{aside}</div>{children}</section>;}
export function SourceNote({children}:{children:React.ReactNode}){return <div className="ui-source-note"><Icon name="info" size={16}/><span>{children}</span></div>;}
export function useCopy(){const [state,setState]=useState<'idle'|'copied'|'error'>('idle');return {state,copy:async(text:string)=>{try{await navigator.clipboard.writeText(text);setState('copied');}catch{setState('error');}}};}
