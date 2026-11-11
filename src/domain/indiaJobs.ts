import type {JobOpportunity} from '../../types';
import {isIndiaLocation} from './jobFeeds';
export const SOUTH_CITIES=['Chennai','Bengaluru','Hyderabad','Coimbatore','Kochi','Thiruvananthapuram','Tiruchirappalli'];
const south=/\b(chennai|bengaluru|bangalore|hyderabad|coimbatore|kochi|cochin|thiruvananthapuram|trivandrum|madurai|mysuru|mysore|mangaluru|mangalore|tiruchirappalli|trichy|salem|vijayawada|visakhapatnam|vizag|guntur|nellore|puducherry|pondicherry|tiruppur|tamil nadu|karnataka|telangana|andhra pradesh|kerala)\b/i;
const indianCity=/\b(india|chennai|bengaluru|bangalore|hyderabad|coimbatore|kochi|cochin|thiruvananthapuram|trivandrum|madurai|mysuru|mysore|mangaluru|mangalore|tiruchirappalli|trichy|salem|vijayawada|visakhapatnam|vizag|guntur|nellore|puducherry|tiruppur|pune|mumbai|delhi|gurugram|gurgaon|noida|kolkata|ahmedabad|jaipur|lucknow|indore|nagpur|bhubaneswar)\b/i;
export function indiaOnly(jobs:JobOpportunity[]){return jobs.filter(isIndiaLocation).map(job=>{
 const locations=job.location.split(/\s*[·;|]\s*/).filter(location=>indianCity.test(location));
 return {...job,location:locations.length?locations.join(' · '):'India (city not specified)',sourceCountries:['IN']};
});}
export function isSouthIndiaLocation(job:JobOpportunity){return isIndiaLocation(job)&&(south.test(job.location)||job.mode==='Remote');}
