import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {COMPANIES} from '../constants';
import {LINKEDIN_COMPANIES} from '../src/data/linkedinCompanies';
import {companyResearch,researchFor} from '../src/data/companyResearch';
import {isIndiaLocation,type JobSnapshot} from '../src/domain/jobFeeds';
import official from '../src/data/officialJobs.json';
import {INDIA_COMPANIES} from '../src/data/indiaEmployers';
import type {JobOpportunity} from '../types';
const output=process.argv[2];if(!output)throw new Error('Pass an output directory');
const companies=Array.from(new Map([...COMPANIES,...LINKEDIN_COMPANIES,...INDIA_COMPANIES].map(item=>[item.name.toLowerCase(),item])).values()).sort((a,b)=>a.name.localeCompare(b.name));
const feeds=(official as JobSnapshot).feeds;
const jobs:JobOpportunity[]=feeds.flatMap(feed=>feed.jobs).filter(isIndiaLocation);
const unresolved=companies.filter(company=>!researchFor(company.name));
const websiteOnly=companyResearch.filter(company=>/careers route not confirmed/.test(company.scope));
const guidance=companyResearch.filter(company=>company.faqs.length);
const escape=(value:unknown)=>`"${String(value??'').replace(/"/g,'""')}"`;
const csv=(rows:unknown[][])=>rows.map(row=>row.map(escape).join(',')).join('\r\n')+'\r\n';
const unresolvedNote=(name:string)=>name==='Nebula AI'?'Ambiguous name in the original seed data; client identity needed':name==='Life@foodhub'?'Possible Foodhub brand alias; canonical identity not confirmed':'Search completed; official careers route not confidently matched';
const report=`# Company research and India job collection

Research date: 11 November 2026. This document is an operator reference, not public interface copy.

## Coverage

- ${companies.length} company names inventoried.
- ${companyResearch.length} have official sources, including ${websiteOnly.length} company websites without a confirmed careers route.
- ${guidance.length} have specific published guidance summarized with source links and country or programme scope.
- ${unresolved.length} identities or careers routes remain unresolved; no interview stages or eligibility rules were invented.
- ${jobs.length} India listings in the versioned snapshot across ${feeds.length} sources. The public app reads the shared catalog and defaults to South India.

## Source snapshots

| Company | Method | Listings | Retrieved |
|---|---|---:|---|
${feeds.map(feed=>`| ${feed.feed.company} | ${feed.feed.provider}; ${feed.status} | ${feed.jobs.length} | ${feed.fetchedAt||'No successful retrieval'} |`).join('\n')}

Accenture and Wipro use bounded recent-result windows across seven South Indian cities. Infosys collects its India lateral and fresher portal. Appian, Capco, Poshmark, ValGenesis and Zuora use official public board APIs or HTML. Six additional employers use public LinkedIn discovery cards: exact employer name and company slug, explicit India location and recent source date are required. LinkedIn coverage is the public first page from the past week, not an employer’s complete vacancy inventory.

The shared collector is active on lotus-buzzer at 7:00 a.m. IST, with failed-source retries at 8:00 a.m. IST. It uses no model calls and does not require Codex to be open. See [job collection operations](JOB-COLLECTION-OPERATIONS.md) for deployment, security and failure handling. Frontend deployment remains separate from a repository push.

Refresh failures retain the last successful data. Listings absent from a successful source snapshot leave the current catalog; that does not prove the employer closed them, especially with bounded windows. Saved applications remain available. No salary, experience or work-mode guesses are added. Provider update dates are not posting dates.

## Unresolved names

${unresolved.map(company=>`- **${company.name}** — ${unresolvedNote(company.name)}.`).join('\n')}

## Company source index

| Company | Coverage | Scope | Official source |
|---|---|---|---|
${companies.map(company=>{const research=researchFor(company.name);return `| ${company.name} | ${research?.faqs.length?'Published guidance':research?'Source identified':'Unresolved'} | ${research?.scope||unresolvedNote(company.name)} | ${research?`[Source](${research.sourceUrl})`:'—'} |`;}).join('\n')}

## Published guidance summaries

${guidance.map(company=>`### ${company.name}

Scope: ${company.scope}. Reviewed ${company.reviewedAt}.

${company.faqs.map(faq=>`**${faq.question}** ${faq.answer} [Official guidance](${faq.sourceUrl||company.sourceUrl}).`).join('\n\n')}`).join('\n\n')}
`;
await mkdir(resolve(output),{recursive:true});
await writeFile(resolve(output,'company-research-report.md'),report);
await writeFile(new URL('../docs/COMPANY-RESEARCH.md',import.meta.url),report);
await writeFile(resolve(output,'company-source-coverage.csv'),csv([['company','coverage','scope','source','reviewed_at'],...companies.map(company=>{const research=researchFor(company.name);return [company.name,research?.faqs.length?'published-guidance':research?'source-identified':'unresolved',research?.scope||unresolvedNote(company.name),research?.sourceUrl,research?.reviewedAt];})]));
await writeFile(resolve(output,'india-job-snapshot.csv'),csv([['id','company','title','location','source_countries','mode','salary','source_provider','source_url','retrieved_at','published_at','provider_updated_at'],...jobs.map(job=>[job.id,job.company,job.title,job.location,job.sourceCountries?.join('; '),job.mode,job.salary,job.sourceProvider,job.sourceUrl,job.fetchedAt,job.postedAt,job.providerUpdatedAt])]));
console.log(JSON.stringify({companies:companies.length,sources:companyResearch.length,careerSources:companyResearch.length-websiteOnly.length,guidance:guidance.length,unresolved:unresolved.length,postings:jobs.length,india:jobs.filter(isIndiaLocation).length}));
