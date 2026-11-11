import { JobOpportunity } from '../../types';
export const jobGroupKey=(job:JobOpportunity)=>[job.title,job.company,job.location,job.mode].map(value=>value.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()).join('|');
