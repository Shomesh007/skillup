-- Public source configuration only. Apply after deploying the matching collector.
-- Preserve refresh state, leases and previous successful jobs on repeat execution.
insert into public.skillup_job_sources(id,company,provider,board,careers_url,enabled,coverage) values
 ('zoho:zohocorp','Zoho','zoho','zohocorp','https://www.zoho.com/careers/',true,'Published India openings from the public feed linked by Zoho Careers; missing cities remain unspecified'),
 ('smartrecruiters:Freshworks','Freshworks','smartrecruiters','Freshworks','https://careers.smartrecruiters.com/Freshworks',true,'Paginated public India postings and their details from the official Freshworks SmartRecruiters board'),
 ('linkedin:ust','UST','linkedin','ust','https://www.linkedin.com/jobs/search/?keywords=UST&location=India&f_TPR=r604800',true,'LinkedIn discovery: public first-page India cards from the past week; partial coverage, confirm on the source'),
 ('hexaware:hexaware','Hexaware','hexaware','hexaware','https://jobs.hexaware.com/',true,'Paginated public Hexaware Oracle CX_1 board, filtered by explicit India country metadata')
on conflict(id) do update set company=excluded.company,provider=excluded.provider,board=excluded.board,careers_url=excluded.careers_url,coverage=excluded.coverage,enabled=true;
