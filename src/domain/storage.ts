export interface StorageResult{ok:boolean;error:string|null;}
export interface PersistenceState{status:'new'|'saved'|'error';error:string|null;}
const unsaved=new Map<string,unknown>();
const message='Changes are only in memory. Browser storage is unavailable or full. Keep this tab open and export a backup.';
const notify=()=>{if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('skillup:unsaved'));};
export function rememberUnsaved(key:string,value:unknown){unsaved.set(key,value);notify();}
export function forgetUnsaved(key:string){if(unsaved.delete(key))notify();}
export function unsavedEntries(){return [...unsaved.entries()];}
export function readDraft<T>(storage:()=>Pick<Storage,'getItem'>,key:string,initial:T):PersistenceState&{value:T}{if(unsaved.has(key))return{value:unsaved.get(key) as T,status:'error',error:message};try{const raw=storage().getItem(key);return{value:raw===null?initial:JSON.parse(raw),status:raw===null?'new':'saved',error:null};}catch{return{value:initial,status:'error',error:'Could not read browser storage. Keep this tab open and export important work.'};}}
export function writeJSON(storage:Pick<Storage,'setItem'>,key:string,value:unknown):StorageResult{try{storage.setItem(key,JSON.stringify(value));return{ok:true,error:null};}catch{return{ok:false,error:message};}}
export function storeResumeVersion(storage:Pick<Storage,'setItem'|'removeItem'>,id:string,resume:unknown,versions:unknown):StorageResult{const key=`skillup.resume.variant.${id}`;const document=writeJSON(storage,key,resume);if(!document.ok)return document;const metadata=writeJSON(storage,'skillup.resumeVariants',versions);if(!metadata.ok){try{storage.removeItem(key);}catch{}return metadata;}return{ok:true,error:null};}
