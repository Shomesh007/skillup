# Company research and India job collection

Research date: 11 November 2026. This document is an operator reference, not public interface copy.

## Coverage

- 142 company names inventoried.
- 132 have official sources, including 13 company websites without a confirmed careers route.
- 39 have specific published guidance summarized with source links and country or programme scope.
- 10 identities or careers routes remain unresolved; no interview stages or eligibility rules were invented.
- 2568 India listings in the versioned snapshot across 18 sources. The public app reads the shared catalog and defaults to South India.

## Source snapshots

| Company | Method | Listings | Retrieved |
|---|---|---:|---|
| Zoho | zoho; ok | 2 | 2026-11-11T14:01:32.698Z |
| Freshworks | smartrecruiters; ok | 32 | 2026-11-11T14:01:33.174Z |
| UST | linkedin; ok | 60 | 2026-11-11T14:01:43.664Z |
| Hexaware | hexaware; ok | 96 | 2026-11-11T14:03:41.358Z |
| Tata Consultancy Services | linkedin; ok | 26 | 2026-11-11T14:01:47.191Z |
| HCLTech | linkedin; ok | 55 | 2026-11-11T14:01:48.021Z |
| Cognizant | linkedin; ok | 55 | 2026-11-11T14:01:49.398Z |
| Capgemini | linkedin; ok | 37 | 2026-11-11T14:01:50.221Z |
| Tech Mahindra | linkedin; ok | 17 | 2026-11-11T14:01:51.026Z |
| LTM | linkedin; ok | 25 | 2026-11-11T14:01:51.885Z |
| Accenture in India | accenture; ok | 251 | 2026-11-11T14:01:52.721Z |
| Infosys | infosys; ok | 1698 | 2026-11-11T14:02:03.178Z |
| Wipro | wipro; ok | 50 | 2026-11-11T14:02:04.513Z |
| Capco | greenhouse; ok | 129 | 2026-11-11T14:02:10.032Z |
| ValGenesis | lever; ok | 10 | 2026-11-11T14:02:12.131Z |
| Zuora | zuora; failed | 6 | 2026-11-11T13:43:55.884Z |
| Appian | greenhouse; ok | 14 | 2026-11-11T14:02:41.192Z |
| Poshmark | ashby; ok | 5 | 2026-11-11T14:02:42.369Z |

Accenture and Wipro use bounded recent-result windows across seven South Indian cities. Infosys collects its India lateral and fresher portal. Appian, Capco, Poshmark, ValGenesis and Zuora use official public board APIs or HTML. Zoho uses its public Zoho Recruit feed, Freshworks uses its paginated public SmartRecruiters board and posting details, and Hexaware uses its paginated Oracle careers board with explicit India country filtering. Seven additional employers, including UST, use public LinkedIn discovery cards: exact employer name and company slug, explicit India location and recent source date are required. LinkedIn coverage is the public first page from the past week, not an employer’s complete vacancy inventory. Country-only job locations remain unspecified at city level.

The shared collector is active on lotus-buzzer at 7:00 a.m. IST, with failed-source retries at 8:00 a.m. IST. It uses no model calls and does not require Codex to be open. See [job collection operations](JOB-COLLECTION-OPERATIONS.md) for deployment, security and failure handling. Frontend deployment remains separate from a repository push.

Refresh failures retain the last successful data. Listings absent from a successful source snapshot leave the current catalog; that does not prove the employer closed them, especially with bounded windows. Saved applications remain available. No salary, experience or work-mode guesses are added. Provider update dates are not posting dates.

## Unresolved names

- **Alien Design Agency** — Search completed; official careers route not confidently matched.
- **Cittabase Solutions** — Search completed; official careers route not confidently matched.
- **Golden Opportunities** — Search completed; official careers route not confidently matched.
- **Kavi India** — Search completed; official careers route not confidently matched.
- **Life@foodhub** — Possible Foodhub brand alias; canonical identity not confirmed.
- **Microgenn Software Solutions** — Search completed; official careers route not confidently matched.
- **MyCareernet** — Search completed; official careers route not confidently matched.
- **Nebula AI** — Ambiguous name in the original seed data; client identity needed.
- **Prognova** — Search completed; official careers route not confidently matched.
- **Uniserve** — Search completed; official careers route not confidently matched.

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
| American Express | Published guidance | Official careers source; local requirements vary | [Source](https://careers.americanexpress.com/en/sites/CX_1) |
| Appian | Source identified | Official careers source; local requirements vary | [Source](https://careers.appian.com/jobs) |
| AppViewX | Source identified | Official careers source; local requirements vary | [Source](https://www.appviewx.com/company/careers/) |
| Aspire Systems | Source identified | India-focused shortlist; confirm role location | [Source](https://www.aspiresys.com/careers) |
| ASSA ABLOY Group | Published guidance | Official careers source; local requirements vary | [Source](https://www.assaabloy.com/career/en/open-positions/recruitment-process) |
| AtkinsRéalis | Source identified | UK placements | [Source](https://careers.atkinsrealis.com/en/early-careers/uk/placements/selection-process) |
| Avantor | Source identified | Official careers source; local requirements vary | [Source](https://careers.avantorsciences.com/) |
| Bahwan CyberTek | Source identified | Official careers source; local requirements vary | [Source](https://www.bahwancybertek.com/careers/index.html) |
| Barclays | Published guidance | Official careers source; local requirements vary | [Source](https://search.jobs.barclays/faqs) |
| Barry-Wehmiller | Source identified | Official careers source; local requirements vary | [Source](https://www.barrywehmiller.com/careers) |
| Beroe Inc | Source identified | Official careers source; local requirements vary | [Source](https://www.beroeinc.com/careers/) |
| BigThinkCode | Source identified | Company website; careers route not confirmed | [Source](https://bigthinkcode.com/) |
| Blue Yonder | Published guidance | Official careers source; local requirements vary | [Source](https://careers.blueyonder.com/us/en/home) |
| BNP Paribas | Published guidance | Official careers source; local requirements vary | [Source](https://group.bnpparibas/en/careers/lets-prepare-to-apply) |
| BU Soft Tech | Source identified | Official careers source; local requirements vary | [Source](https://www.busofttech.com/careers) |
| Capco | Published guidance | Official careers source; local requirements vary | [Source](https://www.capco.com/Careers/Job-Search) |
| CapeStart | Source identified | Official careers source; local requirements vary | [Source](https://careers.capestart.com/capestart/) |
| Capgemini | Published guidance | India | [Source](https://www.capgemini.com/in-en/careers/join-capgemini/) |
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
| eClerx | Published guidance | Official careers source; local requirements vary | [Source](https://eclerx.com/careers/career-faq/) |
| Emerson | Source identified | Official careers source; local requirements vary | [Source](https://www.emerson.com/en/corporate/careers/career-opportunities) |
| Entropik | Source identified | Official careers source; local requirements vary | [Source](https://apply.workable.com/entropik/) |
| EPAM Systems | Source identified | Official careers source; local requirements vary | [Source](https://www.epam.com/careers) |
| EXL | Source identified | Official careers source; local requirements vary | [Source](https://www.exlservice.com/careers) |
| Expleo Group | Source identified | Official careers source; local requirements vary | [Source](https://careers.expleo.com/en/) |
| Exterro India | Source identified | Global Exterro careers; confirm the India location on each opening | [Source](https://www.exterro.com/about/careers) |
| FedEx ACC | Published guidance | FedEx parent careers; ACC is an imported organizational label | [Source](https://careers.fedex.com/) |
| Flowserve Corporation | Source identified | Official careers source; local requirements vary | [Source](https://careers.flowserve.com/career-opportunities/) |
| Foodhub | Source identified | Official careers source; local requirements vary | [Source](https://foodhubcareers.com/) |
| Ford Motor Company | Published guidance | Official careers source; local requirements vary | [Source](https://www.careers.ford.com/en/faqs) |
| Freshworks | Published guidance | Use India locations in the official job search | [Source](https://www.freshworks.com/company/careers/) |
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
| Hexaware | Published guidance | Official careers source; dynamic search requires browser access | [Source](https://hexaware.com/careers/) |
| Hitachi Energy | Published guidance | Official careers source; local requirements vary | [Source](https://www.hitachienergy.com/careers/about-us/recruitment-process) |
| HPE Aruba Networking | Source identified | HPE parent company; US FAQ | [Source](https://careers.hpe.com/us/en/FAQs) |
| Husky Technologies | Source identified | Official careers source; local requirements vary | [Source](https://www.husky.co/en/careers/portal/) |
| IDFC FIRST Bank | Published guidance | India | [Source](https://careers.idfcfirst.bank.in/in/en/faq) |
| IGT | Source identified | Official careers source; local requirements vary | [Source](https://www.igt.com/explore-igt/careers) |
| Improva | Source identified | Company website; careers route not confirmed | [Source](https://www.improva.io/about-us) |
| Infosys | Published guidance | India application routes | [Source](https://www.infosys.com/careers/apply/) |
| InFynd | Source identified | Company website; careers route not confirmed | [Source](https://infynd.com/about-us) |
| JUARA IT SOLUTIONS | Source identified | Official careers source; local requirements vary | [Source](https://juaraitsolutions.com/careers/) |
| Kaleris | Source identified | Official careers source; local requirements vary | [Source](https://kaleris.com/company/careers/) |
| Karix | Source identified | Official careers source; local requirements vary | [Source](https://www.karix.com/careers) |
| Kavi India | Unresolved | Search completed; official careers route not confidently matched | — |
| Kuehne+Nagel | Published guidance | Official careers source; local requirements vary | [Source](https://jobs.kuehne-nagel.com/global/en) |
| Kumaran Systems | Source identified | Official careers source; local requirements vary | [Source](https://careers.kumaran.com/) |
| L&T Technology Services | Source identified | India-focused shortlist; confirm role location | [Source](https://www.ltts.com/careers) |
| Larsen & Toubro-Vyoma | Source identified | Official careers source; local requirements vary | [Source](https://larsentoubrovyoma.com/careers) |
| LetzBizz | Source identified | Recruitment service; confirm the end employer on each opening | [Source](https://letzbizz.com/recruitment/) |
| LevelShift | Source identified | Official careers source; local requirements vary | [Source](https://levelshift.com/careers/current-job-openings) |
| Life@foodhub | Unresolved | Possible Foodhub brand alias; canonical identity not confirmed | — |
| Lincoln Electric | Source identified | Official careers source; local requirements vary | [Source](https://jobs.lincolnelectric.com/content/Hiring-Process/?locale=en_US) |
| Logitech | Published guidance | Official careers source; local requirements vary | [Source](https://www.logitech.com/en-us/careers) |
| LTM | Source identified | Official careers source; local requirements vary | [Source](https://www.ltm.com/careers) |
| Luxoft | Published guidance | Official careers source; local requirements vary | [Source](https://career.luxoft.com/hiring-process) |
| Megan Soft Inc | Source identified | Company website; careers route not confirmed | [Source](https://megansoft.com/) |
| Metayb | Source identified | Company website; careers route not confirmed | [Source](https://metayb.ai/) |
| Microgenn Software Solutions | Unresolved | Search completed; official careers route not confidently matched | — |
| Microsoft | Published guidance | Official careers source; local requirements vary | [Source](https://careers.microsoft.com/v2/global/en/hiringfaqs.html) |
| Movate | Source identified | Official careers source; local requirements vary | [Source](https://www.movate.com/careers-at-movate/) |
| Mphasis | Source identified | India careers; verify the exact vacancy | [Source](https://careers.mphasis.com/home.html) |
| MyCareernet | Unresolved | Search completed; official careers route not confidently matched | — |
| NatWest Group | Published guidance | Official careers source; local requirements vary | [Source](https://jobs.natwestgroup.com/pages/applying) |
| Nebula AI | Unresolved | Ambiguous name in the original seed data; client identity needed | — |
| NETGEAR | Source identified | San Jose, USA careers page | [Source](https://www.netgear.com/in/about/careers/sanjose-usa/) |
| Neurealm | Source identified | Official careers source; local requirements vary | [Source](https://www.neurealm.com/about-us/openings/) |
| Nokia | Source identified | Official careers source; local requirements vary | [Source](https://www.nokia.com/careers/) |
| Paperflite | Source identified | Company website; careers route not confirmed | [Source](https://www.paperflite.com/) |
| Pinnacle Group, Inc. | Published guidance | Staffing company recruitment-safety notice; verify the end employer | [Source](https://www.pinnacle1.com/fraud-alert-notice/) |
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
| Seyyone Group of Companies | Published guidance | Official careers source; local requirements vary | [Source](https://www.seyyone.com/careers) |
| Sopra Steria | Published guidance | Official careers source; local requirements vary | [Source](https://careers.soprasteria.com/faq) |
| Spait Infotech | Source identified | Official careers source; local requirements vary | [Source](https://spaitinfotech.com/career) |
| Staples India | Source identified | Official careers source; local requirements vary | [Source](https://staples.zohorecruit.in/jobs/careers) |
| SWITS DIGITAL Private Limited | Source identified | Company legal website; careers route not confirmed | [Source](https://www.switsdigital.com/terms) |
| Synechron | Source identified | Official careers source; local requirements vary | [Source](https://www.synechron.com/careers) |
| Tata Consultancy Services | Published guidance | India | [Source](https://www.tcs.com/careers/india) |
| Tech Data APAC | Source identified | Regional company website; careers route not confirmed | [Source](https://www.techdata.com/apac/en.html) |
| Tech Mahindra | Source identified | India careers; confirm city and experience on the requisition | [Source](https://careers.techmahindra.com/) |
| techjays | Source identified | Company website; careers route not confirmed | [Source](https://www.techjays.com/) |
| Tekion Corp | Source identified | Official careers source; local requirements vary | [Source](https://tekion.com/careers) |
| TheKalki | Source identified | Official careers source; local requirements vary | [Source](https://careers.thekalki.net/) |
| TVS Next | Source identified | Official careers source; local requirements vary | [Source](https://tvsnext.com/careers) |
| TwikiBot Technologies | Source identified | Official careers source; local requirements vary | [Source](https://www.twikibot.com/careers.html) |
| U.S. Bank | Source identified | Official careers source; local requirements vary | [Source](https://careers.usbank.com/global/en/recruitment-process) |
| Uniserve | Unresolved | Search completed; official careers route not confidently matched | — |
| UST | Published guidance | Official careers source; local requirements vary | [Source](https://www.ust.com/en/careers) |
| ValGenesis | Source identified | Official careers source; local requirements vary | [Source](https://jobs.lever.co/valgenesis) |
| Valor PayTech | Source identified | Official careers source; local requirements vary | [Source](https://valorpaytech.com/get-to-know-us/join-our-team/) |
| ValueMomentum | Source identified | Official careers source; local requirements vary | [Source](https://valuemomentum.com/careers/) |
| Verizon | Published guidance | Official careers source; local requirements vary | [Source](https://mycareer.verizon.com/life-at-verizon/how-we-hire/) |
| Vestas | Published guidance | Official careers source; local requirements vary | [Source](https://www.vestas.com/en/careers/our-recruitment-process) |
| Virtusa | Source identified | Official careers source; local requirements vary | [Source](https://www.virtusa.com/careers) |
| Visteon Corporation | Source identified | Official careers source; local requirements vary | [Source](https://www.visteon.com/careers/join-us/default.aspx) |
| VMC Soft Technologies, Inc | Source identified | Company website; careers route not confirmed | [Source](https://vmcsofttech.com/about-vmc-soft-technologies/) |
| WhiteBlue | Source identified | Official careers source; local requirements vary | [Source](https://www.whiteblue.com/careers) |
| Willsmarg Technologies LLC | Source identified | Official careers source; local requirements vary | [Source](https://willsmarg.com/MainPage/Careers) |
| Wipro | Published guidance | Official careers source; local requirements vary | [Source](https://careers.wipro.com/content/Fraud-Awareness/?locale=en_US) |
| Wood | Source identified | Official careers source; local requirements vary | [Source](https://ehif.fa.em2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/jobs) |
| ZF Group | Source identified | India | [Source](https://www.zf.com/india/en/careers/careers.html) |
| Zocket | Source identified | Official careers source; local requirements vary | [Source](https://www.zocket.com/careers) |
| Zoho | Published guidance | India-focused company shortlist; vacancy-specific location and requirements | [Source](https://www.zoho.com/careers/) |
| Zorba AI | Source identified | Zorba Consulting India website; confirm the named employer on the vacancy | [Source](https://www.zorbaconsulting.in/) |
| Zuan Education | Source identified | Official careers source; local requirements vary | [Source](https://www.zuaneducation.com/careers/) |
| Zuora | Source identified | Official careers source; local requirements vary | [Source](https://www.zuora.com/careers-search-jobs/) |

## Published guidance summaries

### Zoho

Scope: India-focused company shortlist; vacancy-specific location and requirements. Reviewed 2026-11-11.

**Where should I apply for a Zoho opening?** Use View Open Roles on Zoho Careers, open the position that fits your skills, and follow its application link to the Zoho candidate portal. [Official guidance](https://www.zoho.com/careers/).

**Can I hear about future openings?** Zoho’s careers page offers candidate-portal registration for notifications about new roles that match your skills. Registering for updates is separate from choosing an opening and applying. [Official guidance](https://www.zoho.com/careers/).

**How do I choose the right location?** Read Job Information on the individual opening. If it lists only India, confirm the work city with the recruiting team before making relocation plans; an office address is not a job assignment. [Official guidance](https://www.zoho.com/careers/jobdetails/?job_id=193779000024445975).

**What should my application demonstrate?** Zoho says it values diverse interests, skills and a willingness to learn. Show relevant work you can explain, and check the qualifications on your chosen opening rather than assuming one eligibility rule applies to every role. [Official guidance](https://www.zoho.com/careers/).

### Freshworks

Scope: Use India locations in the official job search. Reviewed 2026-11-11.

**Where can I find Freshworks jobs in India?** Follow Explore jobs from Freshworks Careers to its SmartRecruiters board, then choose an Indian location and review the individual posting before applying. [Official guidance](https://careers.smartrecruiters.com/Freshworks).

**Are opportunities limited to software engineering?** The careers page includes Product & Engineering, Sales & Marketing, Customer Service & Success, and Corporate roles. Choose an opening whose responsibilities match your experience. [Official guidance](https://www.freshworks.com/company/careers/).

**What requirements should I use to tailor my resume?** Use the Qualifications and Job Description sections of the exact posting. Education and experience are role-specific; demonstrate the requested responsibilities with accurate examples from your own work. [Official guidance](https://jobs.smartrecruiters.com/Freshworks/744000161047199-senior-analyst-order-management).

**Which examples are useful when preparing?** Freshworks describes customer focus, ownership, high standards, smart risks and teamwork as its values. Prepare real examples of those behaviours alongside evidence for the role’s technical or functional requirements. [Official guidance](https://www.freshworks.com/company/careers/).

### Hexaware

Scope: Official careers source; dynamic search requires browser access. Reviewed 2026-11-11.

**How do I find Hexaware openings in India?** Use Hexaware’s careers board and select India in the location filter. Open the specific requisition to review its responsibilities and apply through that listing. [Official guidance](https://fa-etqo-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/jobs?location=India&locationId=300000000446279&locationLevel=country&mode=location).

**Does an India listing guarantee a particular city?** No. Some requisitions list India without a city. Use the location on your chosen requisition and confirm the actual work city and arrangement with the recruiter before making plans. [Official guidance](https://fa-etqo-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/jobs?location=India&locationId=300000000446279&locationLevel=country&mode=location).

**Can I reuse an older campus drive’s eligibility rules?** Check the year and programme before using a campus notice. Hexaware’s Superset page includes criteria explicitly marked for 2023 pass-outs; those do not establish eligibility for a current opening. Follow the current role or campus invitation. [Official guidance](https://app.joinsuperset.com/company/hexaware/).

### Seyyone Group of Companies

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**Where can I review the actual requirements?** Use Current Openings on Seyyone’s careers page, then open View Details for the individual role. The page provides filters for role, department, skill and other criteria. [Official guidance](https://www.seyyone.com/careers).

**Can I express interest without a matching opening?** The careers page offers a Send Your Resume route when no listed role matches. This expresses interest; it does not guarantee an interview or establish eligibility for a particular vacancy. [Official guidance](https://www.seyyone.com/careers).

### Pinnacle Group, Inc.

Scope: Staffing company recruitment-safety notice; verify the end employer. Reviewed 2026-11-11.

**Will I be asked to pay to be submitted for a role?** Pinnacle Group and PTR Global say applicants are not charged to be considered, submitted or selected, and are not asked to buy products, services or gift cards. [Official guidance](https://www.pinnacle1.com/fraud-alert-notice/).

**When would banking details be needed?** The published notice says successfully placed or hired candidates provide payroll banking details during official onboarding after accepting an offer. Verify suspicious recruitment communication using the contact details on the official notice. [Official guidance](https://www.pinnacle1.com/fraud-alert-notice/).

### FedEx ACC

Scope: FedEx parent careers; ACC is an imported organizational label. Reviewed 2026-11-11.

**Where should I confirm an opening?** Use the current FedEx careers search and verify the business unit, location and requisition. ACC is the label in the older import; it should not be treated as a separate guarantee of eligibility or an offer. [Official guidance](https://careers.fedex.com/).

### UST

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**Where should I start an application?** Use the official UST Careers page to find the position and follow its application route. Match the job title and location when checking a listing found on another portal. [Official guidance](https://www.ust.com/en/careers).

**Should I pay a recruiter or agency for a UST job?** No. UST says neither it nor its authorized agencies charge fees or request money from jobseekers. Verify suspicious contact through the official careers page. [Official guidance](https://www.ust.com/en/careers).

**Is an unsolicited offer without an application genuine?** UST says it does not send unsolicited employment offers to people who have not applied for a specific job through its Careers page. Treat such an offer as suspicious and verify it before sharing personal information. [Official guidance](https://www.ust.com/en/careers).

### Blue Yonder

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**Does joining the talent community apply me to a role?** No. Blue Yonder explicitly says talent-community registration is not an application for a particular position. Submit an application for the opening you want. [Official guidance](https://careers.blueyonder.com/us/en/jointalentcommunity).

**How can I recognize genuine hiring communication?** The talent-community page says role-related communications use a blueyonder.com email address, interviews use in-person or secure video meetings, and candidates are not asked to pay during hiring. [Official guidance](https://careers.blueyonder.com/us/en/jointalentcommunity).

### Kuehne+Nagel

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**What should I check before submitting?** Tailor your CV to the role, make your contact information clear, attach the requested documents and check the application for errors. [Official guidance](https://jobs.kuehne-nagel.com/global/en/candidate-zone).

**What should I prepare for the interview?** Be ready to explain why you want the job and how your experience fits it. The official preparation guidance encourages candidates to ask questions about the work and team. [Official guidance](https://jobs.kuehne-nagel.com/global/en/application-support).

### Accenture in India

Scope: India. Reviewed 2026-11-11.

**How do I find a specific opening?** Search the official India careers page by keyword or the job number provided by your recruiting contact. [Official guidance](https://www.accenture.com/in-en/careers/explore-careers/area-of-interest/journey-to-accenture).

**What happens after I apply?** Accenture sends a receipt email, reviews role fit, and contacts candidates selected for the next stage. [Official guidance](https://www.accenture.com/in-en/careers/explore-careers/area-of-interest/journey-to-accenture).

**Are degree requirements the same for every role?** No. The job description states the education, skills and experience required for that position. [Official guidance](https://www.accenture.com/in-en/careers/explore-careers/area-of-interest/journey-to-accenture).

**When will I hear back?** Timing varies by role and business area. Ask your recruiter about your application; no universal response time is promised. [Official guidance](https://www.accenture.com/in-en/careers/explore-careers/area-of-interest/journey-to-accenture).

**How do I request interview adjustments?** Tell your Accenture recruiting contact what adjustments you need. [Official guidance](https://www.accenture.com/in-en/careers/explore-careers/area-of-interest/journey-to-accenture).

**Can I have multiple applications?** The India hiring guidance allows one active application at a time. Choose the opening that best matches your experience. [Official guidance](https://www.accenture.com/in-en/careers/explore-careers/area-of-interest/journey-to-accenture).

**How many interviews should I expect?** The number depends on the role. Some roles also require an assessment; the recruiting team confirms the applicable stages. [Official guidance](https://www.accenture.com/in-en/careers/explore-careers/area-of-interest/journey-to-accenture).

### Amazon

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**How should I prepare examples?** Prepare real examples using Situation, Task, Action and Result. Connect your decisions and outcomes to the Leadership Principles; use the preparation material for your specific role. [Official guidance](https://www.amazon.jobs/content/en/faq/interview-process).

### American Express

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**How do I verify a recruitment message?** The US careers fraud guidance recommends confirming the opening on the official American Express careers site. Verify the role and recruitment contact before sharing personal information. [Official guidance](https://www.americanexpress.com/en-us/careers/recruitment-fraud/).

### ASSA ABLOY Group

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**How should I focus my CV?** The recruitment guidance asks candidates to show how their experience meets the opening’s requirements. Use evidence from your own work rather than unsupported skill claims. [Official guidance](https://www.assaabloy.com/career/en/open-positions/recruitment-process).

### Barclays

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**Can I apply to several graduate programmes?** The graduate and internship FAQ allows one application per candidate per year for those programmes. This is a programme-specific restriction, not a rule for every experienced-hire vacancy. [Official guidance](https://search.jobs.barclays/faqs).

**Which deadline should I follow?** For campus recruiting, check the deadline in your school’s careers system where applicable. Otherwise follow the programme page. Ask recruiting about adjustments if a disability affects the selection process. [Official guidance](https://search.jobs.barclays/faqs).

**Is the experienced-hire process the same?** Barclays publishes a separate experienced-hire application journey and candidate preparation guide. Use that guidance and the actual role instructions. [Official guidance](https://search.jobs.barclays/en/experienced-hire-applications).

### BNP Paribas

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**How should I tailor my application?** The official preparation guidance emphasizes relating your skills and experience to the position. Use the local official application route for the opening you choose. [Official guidance](https://group.bnpparibas/en/careers/lets-prepare-to-apply).

### Capco

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**How can I check a recruiter contact?** Capco’s official job-search page warns about impersonation scams. Verify anyone claiming to recruit for Capco through official channels before continuing. [Official guidance](https://www.capco.com/Careers/Job-Search).

### Capgemini

Scope: India. Reviewed 2026-11-11.

**Where should I start for India openings?** Use the India careers route and choose the appropriate career path. Review the actual requisition for location, experience and qualifications rather than applying rules from another country. [Official guidance](https://www.capgemini.com/in-en/careers/join-capgemini/).

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

### eClerx

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**How do I narrow my job search?** The careers FAQ recommends searching by job function, location or keywords. Review the specific opening before submitting your application. [Official guidance](https://eclerx.com/careers/career-faq/).

**What happens after the initial application?** The published guidance describes a recruiter conversation to discuss the role and working at eClerx. The job portal describes a separate early-professional assessment route; do not assume that assessment applies to every position. [Official guidance](https://eclerx.com/careers/job-portal/).

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

### Hitachi Energy

Scope: Official careers source; local requirements vary. Reviewed 2026-11-11.

**Can I finish an application later?** The official recruitment guidance says you can save an application and complete it later. The information requested may differ by country. [Official guidance](https://www.hitachienergy.com/careers/about-us/recruitment-process).

**Where do I check my application status?** Sign into the account used to apply and open Candidate Home. Use the official job search filters for location, job type and experience level. [Official guidance](https://www.hitachienergy.com/careers/about-us/recruitment-process).

### IDFC FIRST Bank

Scope: India. Reviewed 2026-11-11.

**Should I email my CV instead of applying?** The bank says it prefers applications through its careers website. Use the category, experience, title and location filters to find and apply to the specific vacancy. [Official guidance](https://careers.idfcfirst.bank.in/in/en/faq).

**When should I expect a response?** The FAQ says the timeline varies by role. Talent Acquisition contacts applicants selected for the position; no fixed response time is promised. [Official guidance](https://careers.idfcfirst.bank.in/in/en/faq).

**How does campus recruitment work?** Check with your college placement team. The bank says it works with placement teams for campus recruitment drives. [Official guidance](https://careers.idfcfirst.bank.in/in/en/faq).

**Will I need to pay for an interview or equipment?** The candidate guidelines say the bank does not ask applicants to pay for interviews, job offers, training or IT assets. Check the sender’s bank domain carefully. [Official guidance](https://careers.idfcfirst.bank.in/in/en/candidate-guidelines).

### Infosys

Scope: India application routes. Reviewed 2026-11-11.

**Which portal should I use for India?** The India portal is career.infosys.com. Its source configuration separates lateral and fresher openings; the global digital-careers portal is a different route. [Official guidance](https://career.infosys.com/jobs?countrycode=IN).

**Are all roles suitable for freshers?** No. Review the minimum and maximum experience stated on the individual India vacancy. A listing for an experienced consultant does not establish eligibility for a graduate applicant. [Official guidance](https://career.infosys.com/jobs?countrycode=IN).

**Where do I check role location and qualifications?** Open the official job description using its reference code. Confirm the city, educational requirements, skills and experience before applying. [Official guidance](https://www.infosys.com/careers/apply/).

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

**How do I find experienced roles?** Follow the lateral-hiring route to TCS iBegin. Search by skill or job ID, review the description, and use the official account-based application process. [Official guidance](https://www.tcs.com/careers/india/lateral-hiring).

**Where should students and freshers look?** Use TCS India’s Entry Level & Internships page. Check the current programme notice for cohort, qualification, eligibility and registration dates. [Official guidance](https://www.tcs.com/careers/india/entry-level).

**Is Rebegin a general fresher programme?** No. Rebegin is a return-to-work initiative for eligible women professionals. Read its own criteria rather than applying those rules to every TCS vacancy. [Official guidance](https://www.tcs.com/careers/india/rebegin-job-codes).

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

**Where can I search India roles?** Use Wipro’s official careers search and check the city and country on the requisition. [Official guidance](https://careers.wipro.com/search/?locationsearch=India).

**Should I pay to receive an offer?** Wipro’s fraud-awareness guidance says it does not charge at any recruitment stage. Validate the vacancy on the careers portal and check the sender’s official identity. [Official guidance](https://careers.wipro.com/content/Fraud-Awareness/?locale=en_US).
