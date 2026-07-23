from __future__ import annotations

import argparse
import json
from pathlib import Path


def normalize_job(job: dict) -> dict:
    return {
        "id": job.get("id", ""),
        "title": job.get("title", ""),
        "company": job.get("company", ""),
        "location": job.get("location", ""),
        "experience": job.get("experience", "Experience not listed"),
        "salary": job.get("salary", "Not disclosed"),
        "mode": job.get("mode", "On-site"),
        "description": job.get("description", ""),
        "linkedinUrl": job.get("linkedin_url") or job.get("linkedinUrl", ""),
        "division": job.get("division", ""),
        "skills": job.get("skills", []),
        "postedAt": job.get("posted_at") or job.get("postedAt", ""),
        "applicants": job.get("applicants", ""),
        "employmentType": job.get("employment_type") or job.get("employmentType", ""),
        "seniorityLevel": job.get("seniority_level") or job.get("seniorityLevel", ""),
        "jobFunction": job.get("job_function") or job.get("jobFunction", ""),
        "industries": job.get("industries", ""),
    }


def company_category(division: str) -> str:
    if division in {"cloud_devops", "data_ai", "software_development", "testing_qa"}:
        return "PRODUCT"
    if division == "security_networking":
        return "SERVICE"
    return "STARTUP"


def clean_company_description(description: str, job_title: str = "") -> str:
    """Clean job description to extract company information only."""
    if not description or len(description) < 50:
        return ""
    
    import re
    
    # Remove "HIRING |" prefix
    description = re.sub(r"^HIRING\s*\|?\s*", "", description, flags=re.IGNORECASE)
    
    # Remove job title if it appears at the start
    if job_title:
        # Try exact match first
        if description.lower().startswith(job_title.lower()):
            description = description[len(job_title):].strip()
            # Remove leading punctuation
            description = re.sub(r"^[:\-|]+\s*", "", description)
    
    # Remove common metadata lines at start (e.g., "Job Title: ... Location: ...")
    lines = description.split("\n")
    cleaned_lines = []
    skip_initial_metadata = True
    
    for line in lines:
        line_stripped = line.strip()
        if not line_stripped:
            continue
            
        # Check if line is metadata (starts with common labels)
        is_metadata = bool(re.match(
            r"^(job title|position|role|location|experience|employment type|notice period|salary|company|industry):",
            line_stripped,
            re.IGNORECASE
        ))
        
        if skip_initial_metadata and is_metadata:
            continue  # Skip initial metadata lines
        else:
            skip_initial_metadata = False  # Found content, stop skipping
            cleaned_lines.append(line_stripped)
    
    description = " ".join(cleaned_lines)
    
    # Remove common job posting prefixes
    prefixes_to_remove = [
        r"^job description:?\s*",
        r"^position summary:?\s*",
        r"^about the role:?\s*",
        r"^we are looking for:?\s*",
        r"^role overview:?\s*",
        r"^overview:?\s*",
    ]
    
    for pattern in prefixes_to_remove:
        description = re.sub(pattern, "", description, flags=re.IGNORECASE)
    
    description = description.strip()
    
    # Check if what's left starts with responsibility lists or requirements
    invalid_starts = [
        "a ", "an ",
        "design,", "develop,", "build,", "create,", "implement,",
        "must have", "should have", "candidates must",
        "the candidate", "the ideal candidate",
        "required:", "qualifications:", "responsibilities:",
    ]
    
    desc_lower = description.lower()
    if any(desc_lower.startswith(start) for start in invalid_starts):
        return ""
    
    # Truncate at first section break that indicates requirements/qualifications
    stop_markers = [
        "\nrequirements",
        "\nqualifications",
        "\nresponsibilities",
        "\nkey responsibilities",
        "\nskills",
        "\nrequired skills",
        "\nwhat you'll do",
        "\nwhat we're looking for",
        "\nwhat you will do",
    ]
    
    desc_lower_full = "\n" + description.lower()
    earliest_idx = len(description)
    
    for marker in stop_markers:
        idx = desc_lower_full.find(marker)
        if 50 < idx < earliest_idx:  # Only cut if there's enough content before
            earliest_idx = idx - 1  # -1 to account for added \n
    
    if earliest_idx < len(description):
        description = description[:earliest_idx].strip()
    
    # Limit to 300 characters, break at word boundary
    if len(description) > 300:
        description = description[:300].rsplit(" ", 1)[0].strip() + "..."
    
    return description


def build_companies(jobs: list[dict]) -> list[dict]:
    companies: dict[str, dict] = {}
    for job in jobs:
        name = job.get("company", "").strip()
        if not name:
            continue
        key = name.lower()
        skills = job.get("skills") or []
        
        # Clean the job description to extract company info
        cleaned_desc = clean_company_description(
            job.get("description", ""),
            job.get("title", "")
        )
        
        # Score the description quality (higher is better)
        desc_score = 0
        if cleaned_desc:
            desc_score = len(cleaned_desc)
            # Bonus for company-related keywords
            company_keywords = ["company", "we", "our", "founded", "leading", "pioneering", "specializ"]
            if any(keyword in cleaned_desc.lower() for keyword in company_keywords):
                desc_score += 100
            # Penalty for job-related keywords at start
            job_keywords = ["experience:", "looking for", "candidate", "responsible for"]
            if any(cleaned_desc.lower().startswith(keyword) for keyword in job_keywords):
                desc_score -= 50
        
        # Use cleaned description or fallback
        if desc_score >= 50:
            about_text = cleaned_desc
        else:
            about_text = f"{name} is actively hiring for {job.get('title', 'IT roles')} in Tamil Nadu."
        
        existing = companies.get(key)
        if not existing:
            existing = {
                "id": key.replace(" ", "-").replace(".", "").replace(",", ""),
                "name": name,
                "tagline": f"Hiring for {job.get('title', 'IT roles')}",
                "logo": "business",
                "rating": 4.5,
                "location": job.get("location", "Tamil Nadu, India"),
                "salary": job.get("salary", "Not disclosed"),
                "experience": job.get("experience", "Experience not listed"),
                "category": company_category(job.get("division", "")),
                "isHiring": True,
                "about": about_text,
                "stack": {
                    "frontend": skills,
                    "backend": [],
                    "database": [],
                    "cloud": [],
                },
                "timeline": [
                    {"step": "Apply on LinkedIn", "duration": job.get("postedAt", "Recent")},
                    {"step": "Resume screening", "duration": job.get("employmentType", "Role dependent")},
                ],
                "linkedInUrl": job.get("linkedinUrl", ""),
                "openRoles": 0,
                "aboutScore": desc_score,  # Track quality for comparison
            }
            companies[key] = existing
        else:
            # Update about if current job has better description (higher score)
            new_desc = clean_company_description(
                job.get("description", ""),
                job.get("title", "")
            )
            new_score = 0
            if new_desc:
                new_score = len(new_desc)
                company_keywords = ["company", "we", "our", "founded", "leading", "pioneering", "specializ"]
                if any(keyword in new_desc.lower() for keyword in company_keywords):
                    new_score += 100
                job_keywords = ["experience:", "looking for", "candidate", "responsible for"]
                if any(new_desc.lower().startswith(keyword) for keyword in job_keywords):
                    new_score -= 50
                    
            if new_score > existing.get("aboutScore", 0):
                existing["about"] = new_desc
                existing["aboutScore"] = new_score

        existing["openRoles"] += 1
        merged_skills = list(dict.fromkeys(existing["stack"]["frontend"] + skills))
        existing["stack"]["frontend"] = merged_skills[:12]

    # Remove the internal aboutScore field before returning
    for company in companies.values():
        company.pop("aboutScore", None)

    return list(companies.values())


def write_typescript_data(target_path: Path, type_name: str, export_name: str, rows: list[dict]) -> None:
    target_path.parent.mkdir(parents=True, exist_ok=True)
    content = (
        f"import {{ {type_name} }} from '../../types';\n\n"
        "// Generated by scrapers/linkedin_tamilnadu_jobs/sync_to_app.py\n"
        f"export const {export_name}: {type_name}[] = "
        + json.dumps(rows, indent=2, ensure_ascii=False)
        + ";\n"
    )
    target_path.write_text(content, encoding="utf-8")


def sync_to_app(input_path: Path, target_path: Path, companies_target_path: Path) -> tuple[int, int]:
    base_dir = Path(__file__).resolve().parent
    input_path = input_path.resolve() if not input_path.is_absolute() else input_path
    target_path = (base_dir / target_path).resolve() if not target_path.is_absolute() else target_path
    companies_target_path = (base_dir / companies_target_path).resolve() if not companies_target_path.is_absolute() else companies_target_path

    jobs = json.loads(input_path.read_text(encoding="utf-8"))
    normalized = [normalize_job(job) for job in jobs]
    companies = build_companies(normalized)

    write_typescript_data(target_path, "JobOpportunity", "LINKEDIN_JOBS", normalized)
    write_typescript_data(companies_target_path, "Company", "LINKEDIN_COMPANIES", companies)
    return len(normalized), len(companies)


def main() -> None:
    parser = argparse.ArgumentParser(description="Copy scraped LinkedIn jobs into the React app data file.")
    parser.add_argument("--input", default="output/linkedin_jobs_raw.json", help="Scraper raw JSON path.")
    parser.add_argument(
        "--target",
        default="../../src/data/linkedinJobs.ts",
        help="Target TypeScript data file, relative to this folder by default.",
    )
    parser.add_argument(
        "--companies-target",
        default="../../src/data/linkedinCompanies.ts",
        help="Target TypeScript company data file, relative to this folder by default.",
    )
    args = parser.parse_args()

    base_dir = Path(__file__).resolve().parent
    target_path = (base_dir / args.target).resolve()
    companies_target_path = (base_dir / args.companies_target).resolve()
    job_count, company_count = sync_to_app(Path(args.input), Path(args.target), Path(args.companies_target))
    print(f"Wrote {job_count} jobs to {target_path}")
    print(f"Wrote {company_count} companies to {companies_target_path}")


if __name__ == "__main__":
    main()
