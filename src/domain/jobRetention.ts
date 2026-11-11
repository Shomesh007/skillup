import type {JobOpportunity} from '../../types';
import {jobGroupKey} from '../utils/jobGroupKey';
// An application remains useful after its listing leaves the current collection window.
export function retainMissingGroups(current:JobOpportunity[],retained:JobOpportunity[]){
 const currentGroups=new Set(current.map(jobGroupKey)),seen=new Set<string>();
 return [...current,...retained.filter(job=>{const key=jobGroupKey(job);const identity=`${key}|${job.id}`;if(currentGroups.has(key)||seen.has(identity))return false;seen.add(identity);return true;})];
}
