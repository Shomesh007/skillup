# Company research and job collection

Research date: 11 November 2026. Job retrieval dates are preserved per source.

## Coverage

- 135 company names inventoried and searched.
- 115 have official sources identified, including 7 company websites without a confirmed careers route.
- 108 have a careers, vacancy or candidate-help source. Finding a source does not verify a company-wide interview process.
- 24 have specific published hiring, preparation or recruitment-safety guidance summarized.
- 20 names remain unresolved. No timelines, ratings, eligibility or interview rounds were invented for them.
- 293 official postings collected across 4 companies; 25 mention India in their locations or supply India country metadata. Remote alone is not treated as worldwide eligibility.

## Current collection

| Company | Method | Published postings | India locations | Retrieved |
|---|---|---:|---:|---|
| Appian | greenhouse public API; ok | 158 | 14 | 2026-11-11T12:14:08.929Z |
| Poshmark | ashby public API; ok | 22 | 5 | 2026-11-11T12:14:10.804Z |
| HappyRobot | ashby public API; ok | 77 | 0 | 2026-11-11T12:14:11.383Z |
| Zuora | Browser-visible official careers page | 36 | 6 | 2026-11-11T12:04:44.779Z |

These are snapshots of listings visible at retrieval, not a continuous availability guarantee. Similar postings are grouped in the app, while their individual source IDs remain available. Unknown salaries, experience and work modes remain unspecified. Browser-only Zuora records link to the full description. API records keep at most a 24-word excerpt and detected skill keywords, not the full job text. A provider update timestamp is not represented as a posting date.

## Refresh and collection procedure

Run `npm run jobs:collect` from the app repository to refresh the three API-backed boards. The collector makes sequential public GET requests with a 25-second timeout. It never submits applications, signs in, collects applicant data or bypasses browser challenges. A failed or malformed response retains that board’s previous successful records and retrieval time, marks the refresh failed, and makes the command fail visibly. A valid empty jobs array clears only that board. Results replace the snapshot atomically.

The board names were established through official careers links: [Appian](https://careers.appian.com/jobs), [Poshmark](https://poshmark.com/careers), and [HappyRobot](https://www.happyrobot.ai/careers). Poshmark currently links to Ashby; older Greenhouse references were not reused. API contracts: [Greenhouse public Job Board API](https://docs.greenhouse.io/job-board.html), [Ashby published-postings API](https://developers.ashbyhq.com/docs/public-job-posting-api).

Zuora was collected from visible job links and location elements on its [official jobs page](https://www.zuora.com/careers-search-jobs/). It is a manual browser snapshot. To refresh it, revisit that page with computer use, capture each visible job title/location/detail URL, confirm the full list is present, and import the capture using `node --import tsx scripts/import-browser-jobs.ts <capture.json>`. The importer accepts only the official Zuora source and HTTPS Zuora careers URLs. Its capture format is `{company:"Zuora",source:"https://www.zuora.com/careers-search-jobs/",fetchedAt:"ISO timestamp",jobs:[{title,location,sourceUrl}]}`.

No recurring schedule or production backend ingestion has been enabled. The app reads versioned local snapshots. Refreshing a repository snapshot does not publish a new deployment automatically.

## Next collection work

1. Verify the official ATS identity for additional employers before adding their adapters. Prioritize India-relevant employers with published sources, including Accenture, Cognizant, TCS, Infosys, HCLTech, Wipro, Capco, Tekion, UST and Exterro. An official source for these companies has been identified; their live jobs have not yet been collected by this pipeline.
2. For Workday, Oracle, PeopleStrong, SuccessFactors and other boards, use documented public feeds where available. Otherwise use the official browser UI, respecting its filters and pagination. Record the actual coverage and retrieval date; a page blocked by a challenge or login is unresolved, not zero vacancies.
3. Extend company-specific FAQs only from published guidance. Keep country, program and role scope. Do not reuse a UK graduate rule as an India-wide requirement.
4. Add a shared `skillup_*` ingestion namespace to the selected Lotus backend before serving updates across devices; preserve the existing Lotus application’s tables and settings.

## Unresolved names

- **Alien Design Agency** — Search completed; official careers route not confidently matched.
- **BigThinkCode** — Search completed; official careers route not confidently matched.
- **Cittabase Solutions** — Search completed; official careers route not confidently matched.
- **FedEx ACC** — Search completed; official careers route not confidently matched.
- **Golden Opportunities** — Search completed; official careers route not confidently matched.
- **InFynd** — Search completed; official careers route not confidently matched.
- **Kavi India** — Search completed; official careers route not confidently matched.
- **Life@foodhub** — Possible Foodhub brand alias; canonical identity not confirmed.
- **Megan Soft Inc** — Search completed; official careers route not confidently matched.
- **Microgenn Software Solutions** — Search completed; official careers route not confidently matched.
- **MyCareernet** — Search completed; official careers route not confidently matched.
- **Nebula AI** — Ambiguous name in the original seed data; client identity needed.
- **Paperflite** — Search completed; official careers route not confidently matched.
- **Pinnacle Group, Inc.** — Search completed; official careers route not confidently matched.
- **Prognova** — Search completed; official careers route not confidently matched.
- **Seyyone Group of Companies** — Search completed; official careers route not confidently matched.
- **SWITS DIGITAL Private Limited** — Search completed; official careers route not confidently matched.
- **Uniserve** — Search completed; official careers route not confidently matched.
- **VMC Soft Technologies, Inc** — Search completed; official careers route not confidently matched.
- **Zorba AI** — Search completed; official careers route not confidently matched.

## Company source index

| Company | Coverage | Scope | Official source |
|---|---|---|---|
| A2V2.ai | Source identified | Company website; careers route not confirmed | [Source](https://www.a2v2.ai/about) |
| Accenture in India | Published guidance | India | [Source](https://www.accenture.com/in-en/careers/explore-careers/area-of-interest/journey-to-accenture) |
| ACL Digital | Source identified | Official careers source; local requirements vary | [Source](https://www.acldigital.com/careers) |
| Aditya Birla Capital | Source identified | Official careers source; local requirements vary | [Source](https://www.adityabirlacapital.com/careers) |
| Aivar Innovations | Source identified | Company website; careers route not confirmed | [Source](https://www.aivar.tech/about-us) |
| Alien Design Agency | Unresolved | Search completed; official careers route not confidently matched | — |
| Amazon | Published guidance | Official careers source; local requirements vary | [Source](https://www.amazon.jobs/content/en/faq/interview-process) |
| American Express | Source identified | Official careers source; local requirements vary | [Source](https://careers.americanexpress.com/en/sites/CX_1) |
| Appian | Source identified | Official careers source; local requirements vary | [Source](https://careers.appian.com/jobs) |
| AppViewX | Source identified | Official careers source; local requirements vary | [Source](https://www.appviewx.com/company/careers/) |
| ASSA ABLOY Group | Published guidance | Official careers source; local requirements vary | [Source](https://www.assaabloy.com/career/en/open-positions/recruitment-process) |
| AtkinsRéalis | Source identified | UK placements | [Source](https://careers.atkinsrealis.com/en/early-careers/uk/placements/selection-process) |
| Avantor | Source identified | Official careers source; local requirements vary | [Source](https://careers.avantorsciences.com/) |
| Bahwan CyberTek | Source identified | Official careers source; local requirements vary | [Source](https://www.bahwancybertek.com/careers/index.html) |
| Barclays | Source identified | Official careers source; local requirements vary | [Source](https://search.jobs.barclays/faqs) |
| Barry-Wehmiller | Source identified | Official careers source; local requirements vary | [Source](https://www.barrywehmiller.com/careers) |
| Beroe Inc | Source identified | Official careers source; local requirements vary | [Source](https://www.beroeinc.com/careers/) |
| BigThinkCode | Unresolved | Search completed; official careers route not confidently matched | — |
| Blue Yonder | Source identified | Official careers source; local requirements vary | [Source](https://careers.blueyonder.com/us/en/home) |
| BNP Paribas | Published guidance | Official careers source; local requirements vary | [Source](https://group.bnpparibas/en/careers/lets-prepare-to-apply) |
| BU Soft Tech | Source identified | Official careers source; local requirements vary | [Source](https://www.busofttech.com/careers) |
| Capco | Published guidance | Official careers source; local requirements vary | [Source](https://www.capco.com/Careers/Job-Search) |
| CapeStart | Source identified | Official careers source; local requirements vary | [Source](https://careers.capestart.com/capestart/) |
| Capgemini | Published guidance | UK | [Source](https://www.capgemini.com/gb-en/careers/join-capgemini/recruitment-process/) |
| CBTS | Source identified | Official careers source; local requirements vary | [Source](https://www.cbts.com/careers) |
| Celestica | Source identified | Official careers source; local requirements vary | [Source](https://careers.celestica.com/) |
| CGI | Published guidance | Official careers source; local requirements vary | [Source](https://www.cgi.com/en/careers/faq) |
| Ciklum India | Source identified | India | [Source](https://jobs.ciklum.com/offices/india/) |
| Cisco | Published guidance | Official careers source; local requirements vary | [Source](https://careers.cisco.com/global/en/how-we-hire) |
| Citi | Source identified | Early career programs | [Source](https://jobs.citi.com/early-career-programs) |
| Cittabase Solutions | Unresolved | Search completed; official careers route not confidently matched | — |
| Cognizant | Published guidance | India | [Source](https://careers.cognizant.com/india-en/pathways-to-cognizant/how-we-hire/) |
| Crisil | Source identified | Official careers source; local requirements vary | [Source](https://www.crisil.com/en/home/careers.html) |
| Datum Technologies Group | Source identified | Official careers source; local requirements vary | [Source](https://datumtg.com/careers/) |
| Deloitte | Published guidance | US | [Source](https://www.deloitte.com/us/en/careers/join-deloitte/recruiting-tips.html) |
| eClerx | Source identified | Official careers source; local requirements vary | [Source](https://eclerx.com/careers/career-faq/) |
| Emerson | Source identified | Official careers source; local requirements vary | [Source](https://www.emerson.com/en/corporate/careers/career-opportunities) |
| Entropik | Source identified | Official careers source; local requirements vary | [Source](https://apply.workable.com/entropik/) |
| EPAM Systems | Source identified | Official careers source; local requirements vary | [Source](https://www.epam.com/careers) |
| EXL | Source identified | Official careers source; local requirements vary | [Source](https://www.exlservice.com/careers) |
| Expleo Group | Source identified | Official careers source; local requirements vary | [Source](https://careers.expleo.com/en/) |
| Exterro India | Source identified | Global Exterro careers; confirm the India location on each opening | [Source](https://www.exterro.com/about/careers) |
| FedEx ACC | Unresolved | Search completed; official careers route not confidently matched | — |
| Flowserve Corporation | Source identified | Official careers source; local requirements vary | [Source](https://careers.flowserve.com/career-opportunities/) |
| Foodhub | Source identified | Official careers source; local requirements vary | [Source](https://foodhubcareers.com/) |
| Ford Motor Company | Published guidance | Official careers source; local requirements vary | [Source](https://www.careers.ford.com/en/faqs) |
| Fujitsu | Source identified | India | [Source](https://global.fujitsu/en-apac/careers/india) |
| Garrett - Advancing Motion | Source identified | Official careers source; local requirements vary | [Source](https://www.garrettmotion.com/) |
| GlobalLogic | Published guidance | India | [Source](https://www.globallogic.com/in/careers/) |
| GoCharting | Source identified | Official careers source; local requirements vary | [Source](https://gocharting.com/company/careers) |
| Golden Opportunities | Unresolved | Search completed; official careers route not confidently matched | — |
| Google | Published guidance | Official careers source; local requirements vary | [Source](https://support.google.com/googlecareers/answer/6095391?hl=en) |
| GRUNDFOS | Published guidance | Official careers source; local requirements vary | [Source](https://www.grundfos.com/careers/how-we-hire/faq) |
| Guidehouse | Source identified | Official careers source; local requirements vary | [Source](https://guidehouse.searchgreatcareers.com/) |
| Happiest Minds Technologies | Source identified | Official careers source; local requirements vary | [Source](https://careers.smartrecruiters.com/HappiestMindsTechnologies1) |
| HappyRobot | Source identified | Official careers source; local requirements vary | [Source](https://www.happyrobot.ai/careers) |
| HCLTech | Published guidance | Official careers source; local requirements vary | [Source](https://www.hcltech.com/careers/recruitment-process-hcl-tech) |
| Hitachi Energy | Source identified | Official careers source; local requirements vary | [Source](https://www.hitachienergy.com/careers/about-us/recruitment-process) |
| HPE Aruba Networking | Source identified | HPE parent company; US FAQ | [Source](https://careers.hpe.com/us/en/FAQs) |
| Husky Technologies | Source identified | Official careers source; local requirements vary | [Source](https://www.husky.co/en/careers/portal/) |
| IDFC FIRST Bank | Source identified | India | [Source](https://careers.idfcfirst.bank.in/in/en/faq) |
| IGT | Source identified | Official careers source; local requirements vary | [Source](https://www.igt.com/explore-igt/careers) |
| Improva | Source identified | Company website; careers route not confirmed | [Source](https://www.improva.io/about-us) |
| Infosys | Source identified | Official careers source; local requirements vary | [Source](https://digitalcareers.infosys.com/) |
| InFynd | Unresolved | Search completed; official careers route not confidently matched | — |
| JUARA IT SOLUTIONS | Source identified | Official careers source; local requirements vary | [Source](https://juaraitsolutions.com/careers/) |
| Kaleris | Source identified | Official careers source; local requirements vary | [Source](https://kaleris.com/company/careers/) |
| Karix | Source identified | Official careers source; local requirements vary | [Source](https://www.karix.com/careers) |
| Kavi India | Unresolved | Search completed; official careers route not confidently matched | — |
| Kuehne+Nagel | Source identified | Official careers source; local requirements vary | [Source](https://jobs.kuehne-nagel.com/global/en) |
| Kumaran Systems | Source identified | Official careers source; local requirements vary | [Source](https://careers.kumaran.com/) |
| Larsen & Toubro-Vyoma | Source identified | Official careers source; local requirements vary | [Source](https://larsentoubrovyoma.com/careers) |
| LetzBizz | Source identified | Recruitment service; confirm the end employer on each opening | [Source](https://letzbizz.com/recruitment/) |
| LevelShift | Source identified | Official careers source; local requirements vary | [Source](https://levelshift.com/careers/current-job-openings) |
| Life@foodhub | Unresolved | Possible Foodhub brand alias; canonical identity not confirmed | — |
| Lincoln Electric | Source identified | Official careers source; local requirements vary | [Source](https://jobs.lincolnelectric.com/content/Hiring-Process/?locale=en_US) |
| Logitech | Published guidance | Official careers source; local requirements vary | [Source](https://www.logitech.com/en-us/careers) |
| LTM | Source identified | Official careers source; local requirements vary | [Source](https://www.ltm.com/careers) |
| Luxoft | Published guidance | Official careers source; local requirements vary | [Source](https://career.luxoft.com/hiring-process) |
| Megan Soft Inc | Unresolved | Search completed; official careers route not confidently matched | — |
| Metayb | Source identified | Company website; careers route not confirmed | [Source](https://metayb.ai/) |
| Microgenn Software Solutions | Unresolved | Search completed; official careers route not confidently matched | — |
| Microsoft | Published guidance | Official careers source; local requirements vary | [Source](https://careers.microsoft.com/v2/global/en/hiringfaqs.html) |
| Movate | Source identified | Official careers source; local requirements vary | [Source](https://www.movate.com/careers-at-movate/) |
| MyCareernet | Unresolved | Search completed; official careers route not confidently matched | — |
| NatWest Group | Published guidance | Official careers source; local requirements vary | [Source](https://jobs.natwestgroup.com/pages/applying) |
| Nebula AI | Unresolved | Ambiguous name in the original seed data; client identity needed | — |
| NETGEAR | Source identified | San Jose, USA careers page | [Source](https://www.netgear.com/in/about/careers/sanjose-usa/) |
| Neurealm | Source identified | Official careers source; local requirements vary | [Source](https://www.neurealm.com/about-us/openings/) |
| Nokia | Source identified | Official careers source; local requirements vary | [Source](https://www.nokia.com/careers/) |
| Paperflite | Unresolved | Search completed; official careers route not confidently matched | — |
| Pinnacle Group, Inc. | Unresolved | Search completed; official careers route not confidently matched | — |
| Poshmark | Source identified | Official careers source; local requirements vary | [Source](https://poshmark.com/careers) |
| Presidio | Source identified | Official careers source; local requirements vary | [Source](https://www.presidio.com/careers/) |
| Prithvi Inner Wears Private Limited | Source identified | Individual public vacancy; company-wide process not confirmed | [Source](https://prithvicareers.peoplestrong.com/job/detail/piw_st_1847001) |
| Prognova | Unresolved | Search completed; official careers route not confidently matched | — |
| Prophecy Technologies | Source identified | Official careers source; local requirements vary | [Source](https://hub.prophecytechs.com/careers) |
| QualityKiosk Technologies | Source identified | Official careers source; local requirements vary | [Source](https://qualitykiosk.com/job/) |
| Radware | Source identified | Official careers source; local requirements vary | [Source](https://www.radware.com/careers/) |
| RX Global | Source identified | Official careers source; local requirements vary | [Source](https://rxglobal.com/event-jobs/search) |
| SchoolCues | Source identified | Company website; careers route not confirmed | [Source](https://www.schoolcues.com/) |
| Searce Inc | Source identified | Official careers source; local requirements vary | [Source](https://www.searce.com/join-us) |
| Seyyone Group of Companies | Unresolved | Search completed; official careers route not confidently matched | — |
| Sopra Steria | Published guidance | Official careers source; local requirements vary | [Source](https://careers.soprasteria.com/faq) |
| Spait Infotech | Source identified | Official careers source; local requirements vary | [Source](https://spaitinfotech.com/career) |
| Staples India | Source identified | Official careers source; local requirements vary | [Source](https://staples.zohorecruit.in/jobs/careers) |
| SWITS DIGITAL Private Limited | Unresolved | Search completed; official careers route not confidently matched | — |
| Synechron | Source identified | Official careers source; local requirements vary | [Source](https://www.synechron.com/careers) |
| Tata Consultancy Services | Published guidance | India | [Source](https://www.tcs.com/careers/india) |
| Tech Data APAC | Source identified | Regional company website; careers route not confirmed | [Source](https://www.techdata.com/apac/en.html) |
| techjays | Source identified | Company website; careers route not confirmed | [Source](https://www.techjays.com/) |
| Tekion Corp | Source identified | Official careers source; local requirements vary | [Source](https://tekion.com/careers) |
| TheKalki | Source identified | Official careers source; local requirements vary | [Source](https://careers.thekalki.net/) |
| TVS Next | Source identified | Official careers source; local requirements vary | [Source](https://tvsnext.com/careers) |
| TwikiBot Technologies | Source identified | Official careers source; local requirements vary | [Source](https://www.twikibot.com/careers.html) |
| U.S. Bank | Source identified | Official careers source; local requirements vary | [Source](https://careers.usbank.com/global/en/recruitment-process) |
| Uniserve | Unresolved | Search completed; official careers route not confidently matched | — |
| UST | Source identified | Official careers source; local requirements vary | [Source](https://www.ust.com/en/careers) |
| ValGenesis | Source identified | Official careers source; local requirements vary | [Source](https://jobs.lever.co/valgenesis) |
| Valor PayTech | Source identified | Official careers source; local requirements vary | [Source](https://valorpaytech.com/get-to-know-us/join-our-team/) |
| ValueMomentum | Source identified | Official careers source; local requirements vary | [Source](https://valuemomentum.com/careers/) |
| Verizon | Published guidance | Official careers source; local requirements vary | [Source](https://mycareer.verizon.com/life-at-verizon/how-we-hire/) |
| Vestas | Published guidance | Official careers source; local requirements vary | [Source](https://www.vestas.com/en/careers/our-recruitment-process) |
| Virtusa | Source identified | Official careers source; local requirements vary | [Source](https://www.virtusa.com/careers) |
| Visteon Corporation | Source identified | Official careers source; local requirements vary | [Source](https://www.visteon.com/careers/join-us/default.aspx) |
| VMC Soft Technologies, Inc | Unresolved | Search completed; official careers route not confidently matched | — |
| WhiteBlue | Source identified | Official careers source; local requirements vary | [Source](https://www.whiteblue.com/careers) |
| Willsmarg Technologies LLC | Source identified | Official careers source; local requirements vary | [Source](https://willsmarg.com/MainPage/Careers) |
| Wipro | Published guidance | Official careers source; local requirements vary | [Source](https://careers.wipro.com/content/Fraud-Awareness/?locale=en_US) |
| Wood | Source identified | Official careers source; local requirements vary | [Source](https://ehif.fa.em2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/jobs) |
| ZF Group | Source identified | India | [Source](https://www.zf.com/india/en/careers/careers.html) |
| Zocket | Source identified | Official careers source; local requirements vary | [Source](https://www.zocket.com/careers) |
| Zorba AI | Unresolved | Search completed; official careers route not confidently matched | — |
| Zuan Education | Source identified | Official careers source; local requirements vary | [Source](https://www.zuaneducation.com/careers/) |
| Zuora | Source identified | Official careers source; local requirements vary | [Source](https://www.zuora.com/careers-search-jobs/) |

## Published guidance summaries

### Accenture in India

Scope: India. Reviewed 2026-11-11.

**Can I have multiple applications?** The India hiring guidance allows one active application at a time. Choose the opening that best matches your experience. [Official guidance](https://www.accenture.com/in-en/careers/explore-careers/area-of-interest/journey-to-accenture).

**How many interviews should I expect?** The number depends on the role. Some roles also require an assessment; the recruiting team confirms the applicable stages. [Official guidance](https://www.accenture.com/in-en/careers/explore-careers/area-of-interest/journey-to-accenture).

### Amazon

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**How should I prepare examples?** Prepare real examples using Situation, Task, Action and Result. Connect your decisions and outcomes to the Leadership Principles; use the preparation material for your specific role. [Official guidance](https://www.amazon.jobs/content/en/faq/interview-process).

### ASSA ABLOY Group

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**How should I focus my CV?** The recruitment guidance asks candidates to show how their experience meets the opening’s requirements. Use evidence from your own work rather than unsupported skill claims. [Official guidance](https://www.assaabloy.com/career/en/open-positions/recruitment-process).

### BNP Paribas

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**How should I tailor my application?** The official preparation guidance emphasizes relating your skills and experience to the position. Use the local official application route for the opening you choose. [Official guidance](https://group.bnpparibas/en/careers/lets-prepare-to-apply).

### Capco

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**How can I check a recruiter contact?** Capco’s official job-search page warns about impersonation scams. Verify anyone claiming to recruit for Capco through official channels before continuing. [Official guidance](https://www.capco.com/Careers/Job-Search).

### Capgemini

Scope: UK. Reviewed 2026-11-11.

**Who might interview me?** The UK process describes conversations with recruiting, hiring managers, technical colleagues or future teammates depending on the position. This is UK guidance; ask the recruiter about other locations. [Official guidance](https://www.capgemini.com/gb-en/careers/join-capgemini/recruitment-process/).

### CGI

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**Do I need a new profile for every opening?** The careers FAQ describes creating a candidate profile that you can reuse and update. Search openings by keyword and use career alerts for relevant opportunities. [Official guidance](https://www.cgi.com/en/careers/faq).

### Cisco

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**How do I verify the recruitment route?** Cisco identifies its official careers site and Workday candidate portal. It warns against recruitment payments and offers made without an interview. [Official guidance](https://careers.cisco.com/global/en/how-we-hire).

### Cognizant

Scope: India. Reviewed 2026-11-11.

**Where do I check progress?** Use My Jobpage in the candidate portal. Returning employees follow the standard application process described in the hiring guidance. [Official guidance](https://careers.cognizant.com/india-en/pathways-to-cognizant/how-we-hire/).

**What should I practise?** Prepare examples tied to the job description using Situation, Task, Action and Result. Be ready to explain why Cognizant and how your skills contribute. [Official guidance](https://careers.cognizant.com/media/1gjpizmr/interview-preparation-tips.pdf).

### Deloitte

Scope: US. Reviewed 2026-11-11.

**How should I prepare my application?** The US recruiting tips recommend a clear account of relevant skills and experience and preparation for explaining your background. Use the actual opening to choose your examples. [Official guidance](https://www.deloitte.com/us/en/careers/join-deloitte/recruiting-tips.html).

### Ford Motor Company

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**How do I apply safely?** Use the official careers application route. Ford’s FAQ warns that it does not charge recruitment fees; verify the opening and communication before sharing information. [Official guidance](https://www.careers.ford.com/en/faqs).

### GlobalLogic

Scope: India. Reviewed 2026-11-11.

**What is the interview format?** The India careers guidance describes an initial phone screen followed by one or more team or hiring-manager interviews. Remote arrangements depend on the role and department. [Official guidance](https://www.globallogic.com/in/careers/).

### Google

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**Where can I check my application?** Use the application dashboard in your Google Careers account. The application help page explains what is submitted to recruiting and how to review your application. [Official guidance](https://support.google.com/googlecareers/answer/6095391?hl=en).

### GRUNDFOS

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**What should my application demonstrate?** Show how your experience and accomplishments fit the requirements. Use the official jobs portal and check the hiring FAQ for the applicable application steps. [Official guidance](https://www.grundfos.com/careers/how-we-hire/faq).

### HCLTech

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**What happens after applying?** The published process describes recruiting and technical or hiring-manager conversations before an offer. The stages depend on the position. [Official guidance](https://www.hcltech.com/careers/recruitment-process-hcl-tech).

### Logitech

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**What should I prepare for interviews?** The careers page describes conversations with hiring managers, teammates and leaders. Prepare to explain your relevant work and interest in the role. [Official guidance](https://www.logitech.com/en-us/careers).

### Luxoft

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**What should I prepare beyond technical skills?** The published process includes technical evaluation and a project-lead conversation. Prepare to discuss teamwork and your career expectations as well as your technical decisions. [Official guidance](https://career.luxoft.com/hiring-process).

### Microsoft

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**Where do I find interview and accessibility guidance?** Use Microsoft Careers hiring tips and hiring FAQs. Confirm role-specific interview arrangements with your recruiter; request an accommodation through the careers accessibility route. [Official guidance](https://careers.microsoft.com/v2/global/en/hiring-tips.html).

### NatWest Group

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**Which application guidance applies to me?** The official applying hub separates early-talent support from other vacancies. Follow the relevant path and its application-management guidance. [Official guidance](https://jobs.natwestgroup.com/pages/applying).

### Sopra Steria

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**What belongs in my CV?** Use accurate job titles, employers and dates. Prepare to explain why the company and position interest you, and request recruitment adjustments if needed. [Official guidance](https://careers.soprasteria.com/faq).

### Tata Consultancy Services

Scope: India. Reviewed 2026-11-11.

**Which application route should I use?** The India careers site separates entry-level and internship opportunities from lateral hiring. Check the exact program or requisition for its eligibility conditions. [Official guidance](https://www.tcs.com/careers/india).

**Are recruitment payments legitimate?** TCS warns that it does not charge recruitment fees. Use the official recruitment fraud guidance to verify suspicious communications. [Official guidance](https://www.tcs.com/careers/india/recruitment-fraud-alert).

### Verizon

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**How are interviews structured?** Verizon describes behavioral interviews that may take place by phone, video or in person depending on the role. Check Candidate Home for assigned assessment tasks. [Official guidance](https://mycareer.verizon.com/life-at-verizon/how-we-hire/).

### Vestas

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**Will there be a video assessment?** The published process says a HireVue on-demand interview may follow shortlisting. Follow the instructions for the actual role; graduate recruitment has separate guidance. [Official guidance](https://www.vestas.com/en/careers/our-recruitment-process).

### Wipro

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**Should I pay to receive an offer?** Wipro’s fraud-awareness guidance says it does not charge at any recruitment stage. Validate the vacancy on the careers portal and check the sender’s official identity. [Official guidance](https://careers.wipro.com/content/Fraud-Awareness/?locale=en_US).
