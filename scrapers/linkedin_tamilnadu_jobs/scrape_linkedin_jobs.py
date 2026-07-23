from __future__ import annotations

import argparse
import csv
import hashlib
import json
import random
import re
import sys
import time
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, quote_plus, urlencode, urlparse

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException, TimeoutException
from selenium.webdriver import ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from sync_to_app import sync_to_app


try:
    sys.stdout.reconfigure(line_buffering=True)
except AttributeError:
    pass


DATE_FILTERS = {
    "any": "",
    "past_24_hours": "r86400",
    "past_week": "r604800",
    "past_month": "r2592000",
}


@dataclass
class JobRecord:
    id: str
    title: str
    company: str
    location: str
    division: str
    query: str
    linkedin_url: str
    source: str = "linkedin"
    description: str = ""
    posted_at: str = ""
    applicants: str = ""
    employment_type: str = ""
    seniority_level: str = ""
    job_function: str = ""
    industries: str = ""
    experience: str = ""
    salary: str = "Not disclosed"
    mode: str = "On-site"
    skills: list[str] = field(default_factory=list)
    scraped_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


def load_config(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    text = value
    if any(marker in text for marker in ("â€™", "â€“", "â€”", "â€œ", "â€")):
        try:
            text = text.encode("latin1").decode("utf-8")
        except UnicodeError:
            pass
    return re.sub(r"\s+", " ", text).strip()


def clean_description(value: str | None) -> str:
    text = clean_text(value)
    text = re.sub(r"^(?:[A-Za-z]\s+){4,}[A-Za-z]\s+", "", text).strip()
    stop_markers = [
        "Apply for this position",
        "Full Name *",
        "Are you interested in this role?",
        "FAQ's",
        "Frequently asked question",
        "Book Free Consultation",
        "Connect with us",
        "You still have a questions",
    ]
    lowered = text.lower()
    cut_points = [lowered.find(marker.lower()) for marker in stop_markers if lowered.find(marker.lower()) > 0]
    if cut_points:
        text = text[: min(cut_points)].strip()
    return text


def stable_id(*parts: str) -> str:
    raw = "|".join(clean_text(part).lower() for part in parts if part)
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:16]


def text_or_empty(root: WebElement | WebDriver, selectors: list[tuple[str, str]]) -> str:
    for by, selector in selectors:
        try:
            return clean_text(root.find_element(by, selector).text)
        except (NoSuchElementException, StaleElementReferenceException):
            continue
    return ""


def attr_or_empty(root: WebElement, attr: str) -> str:
    try:
        return clean_text(root.get_attribute(attr))
    except StaleElementReferenceException:
        return ""


def is_auth_wall_text(value: str) -> bool:
    return clean_text(value).lower() in {
        "sign in",
        "join linkedin",
        "linkedin login",
        "authwall",
    }


def infer_mode(location: str, description: str) -> str:
    text = f"{location} {description}".lower()
    if "remote" in text:
        return "Remote"
    if "hybrid" in text:
        return "Hybrid"
    return "On-site"


def infer_experience(description: str, title: str) -> str:
    text = f"{title} {description}".lower()
    patterns = [
        r"(\d+)\+?\s*[-–—]\s*(\d+)\+?\s*years?",
        r"(\d+)\+?\s*to\s*(\d+)\+?\s*years?",
        r"(\d+)\+?\s*years?\s*(?:of)?\s*experience",
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match and len(match.groups()) == 2:
            return f"{match.group(1)}-{match.group(2)} Years"
        if match:
            return f"{match.group(1)}+ Years"
    if any(word in text for word in ["fresher", "entry level", "graduate trainee"]):
        return "0-1 Years"
    return "Experience not listed"


def infer_salary(description: str) -> str:
    patterns = [
        r"(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*lpa",
        r"rs\.?\s*([\d,]+)\s*-\s*rs\.?\s*([\d,]+)",
        r"inr\s*([\d,]+)\s*-\s*([\d,]+)",
    ]
    lowered = description.lower()
    for pattern in patterns:
        match = re.search(pattern, lowered)
        if match:
            return clean_text(match.group(0)).upper().replace("RS.", "Rs.")
    return "Not disclosed"


def infer_skills(description: str, title: str = "") -> list[str]:
    skill_patterns = [
        ("React", r"\breact(?:\.js|js)?\b"),
        ("Angular", r"\bangular\b"),
        ("Vue", r"\bvue(?:\.js|js)?\b"),
        ("JavaScript", r"\bjava\s*script\b|\bjavascript\b|\bjs\b"),
        ("TypeScript", r"\btype\s*script\b|\btypescript\b|\bts\b"),
        ("HTML", r"\bhtml5?\b"),
        ("CSS", r"\bcss3?\b"),
        ("Node.js", r"\bnode(?:\.js|js)?\b"),
        ("Express", r"\bexpress(?:\.js|js)?\b"),
        ("Java", r"\bjava\b"),
        ("Spring Boot", r"\bspring\s*boot\b"),
        ("Python", r"\bpython\b"),
        ("Django", r"\bdjango\b"),
        ("Flask", r"\bflask\b"),
        ("C#", r"\bc#\b|\bc sharp\b"),
        (".NET", r"\.net\b|\bdotnet\b"),
        ("PHP", r"\bphp\b"),
        ("Laravel", r"\blaravel\b"),
        ("Go", r"\bgo(?:lang)?\b"),
        ("Rust", r"\brust\b"),
        ("SQL", r"\bsql\b"),
        ("MySQL", r"\bmysql\b"),
        ("PostgreSQL", r"\bpostgres(?:ql)?\b"),
        ("MongoDB", r"\bmongo\s*\.?\s*db\b|\bmongodb\b"),
        ("AWS", r"\baws\b"),
        ("Azure", r"\bazure\b"),
        ("GCP", r"\bgcp\b|\bgoogle cloud\b"),
        ("Docker", r"\bdocker\b"),
        ("Kubernetes", r"\bkubernetes\b|\bk8s\b"),
        ("Jenkins", r"\bjenkins\b"),
        ("Git", r"\bgit\b"),
        ("Selenium", r"\bselenium\b"),
        ("Cypress", r"\bcypress\b"),
        ("Playwright", r"\bplaywright\b"),
        ("JMeter", r"\bjmeter\b"),
        ("Manual Testing", r"\bmanual testing\b"),
        ("Automation Testing", r"\bautomation testing\b|\btest automation\b"),
        ("API Testing", r"\bapi testing\b"),
        ("REST", r"\brest(?:ful)?\b"),
        ("GraphQL", r"\bgraphql\b"),
        ("Power BI", r"\bpower\s*bi\b"),
        ("Tableau", r"\btableau\b"),
        ("Excel", r"\bexcel\b"),
        ("Linux", r"\blinux\b"),
        ("Networking", r"\bnetworking\b"),
        ("Security", r"\bsecurity\b"),
        ("Agile", r"\bagile\b"),
        ("Scrum", r"\bscrum\b"),
    ]
    found: list[str] = []
    haystack = f"{title} {description}".lower()
    for skill, pattern in skill_patterns:
        if re.search(pattern, haystack, flags=re.IGNORECASE) and skill not in found:
            found.append(skill)
    return found[:16]


def build_search_url(keyword: str, location: str, date_posted: str, start: int) -> str:
    params = {
        "keywords": keyword,
        "location": location,
        "start": str(start),
    }
    date_filter = DATE_FILTERS.get(date_posted, "")
    if date_filter:
        params["f_TPR"] = date_filter
    return "https://www.linkedin.com/jobs/search/?" + urlencode(params, quote_via=quote_plus)


def clear_stale_profile_locks(chrome_profile: Path) -> None:
    for lock_name in ("SingletonLock", "SingletonCookie", "SingletonSocket"):
        lock_path = chrome_profile / lock_name
        if lock_path.exists():
            try:
                lock_path.unlink()
            except OSError:
                pass


def create_driver(headless: bool, chrome_profile: Path, profile_directory: str | None) -> WebDriver:
    options = ChromeOptions()
    options.add_argument("--window-size=1440,1100")
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-popup-blocking")
    options.add_argument("--lang=en-US")
    options.add_argument("--no-first-run")
    options.add_argument("--no-default-browser-check")
    options.add_argument("--disable-dev-shm-usage")
    if headless:
        options.add_argument("--headless=new")
    chrome_profile.mkdir(parents=True, exist_ok=True)
    clear_stale_profile_locks(chrome_profile)
    options.add_argument(f"--user-data-dir={chrome_profile}")
    if profile_directory:
        options.add_argument(f"--profile-directory={profile_directory}")
    return webdriver.Chrome(options=options)


def polite_delay(config: dict[str, Any]) -> None:
    delay = config.get("delay_seconds", {})
    low = float(delay.get("min", 2.5))
    high = float(delay.get("max", 6.0))
    time.sleep(random.uniform(low, high))


def scroll_results(driver: WebDriver) -> None:
    for _ in range(4):
        driver.execute_script("window.scrollBy(0, Math.floor(window.innerHeight * 0.8));")
        time.sleep(0.8)


def find_job_cards(driver: WebDriver) -> list[WebElement]:
    selectors = [
        "li.jobs-search-results__list-item",
        "div.job-card-container",
        "div.base-search-card",
        "li div[data-job-id]",
    ]
    for selector in selectors:
        cards = driver.find_elements(By.CSS_SELECTOR, selector)
        if cards:
            return cards
    return []


def extract_card_summary(card: WebElement) -> dict[str, str]:
    title = text_or_empty(card, [
        (By.CSS_SELECTOR, ".job-card-list__title"),
        (By.CSS_SELECTOR, ".base-search-card__title"),
        (By.CSS_SELECTOR, "a[href*='/jobs/view/']"),
    ])
    company = text_or_empty(card, [
        (By.CSS_SELECTOR, ".job-card-container__primary-description"),
        (By.CSS_SELECTOR, ".base-search-card__subtitle"),
        (By.CSS_SELECTOR, "h4"),
    ])
    location = text_or_empty(card, [
        (By.CSS_SELECTOR, ".job-card-container__metadata-item"),
        (By.CSS_SELECTOR, ".job-search-card__location"),
        (By.CSS_SELECTOR, "span"),
    ])
    href = ""
    for selector in ["a.job-card-list__title--link", "a.base-card__full-link", "a[href*='/jobs/view/']"]:
        try:
            href = attr_or_empty(card.find_element(By.CSS_SELECTOR, selector), "href")
            if href:
                break
        except (NoSuchElementException, StaleElementReferenceException):
            continue
    job_id = attr_or_empty(card, "data-job-id")
    if not job_id and href:
        query = parse_qs(urlparse(href).query)
        job_id = (query.get("currentJobId") or [""])[0]
        if not job_id:
            match = re.search(r"/jobs/view/(\d+)", href)
            job_id = match.group(1) if match else ""
    return {"title": title, "company": company, "location": location, "href": href, "job_id": job_id}


def collect_card_summaries(cards: list[WebElement]) -> list[dict[str, str]]:
    summaries: list[dict[str, str]] = []
    seen: set[str] = set()
    for card in cards:
        try:
            summary = extract_card_summary(card)
        except StaleElementReferenceException:
            continue
        if not summary["title"] or not summary["company"] or is_auth_wall_text(summary["title"]):
            continue
        unique_key = summary["href"] or stable_id(summary["title"], summary["company"], summary["location"])
        if unique_key in seen:
            continue
        seen.add(unique_key)
        summaries.append(summary)
    return summaries


def ensure_detail_tab(driver: WebDriver, search_handle: str, detail_handle: str | None) -> str:
    if detail_handle and detail_handle in driver.window_handles:
        driver.switch_to.window(detail_handle)
        return detail_handle

    driver.switch_to.window(search_handle)
    driver.execute_script("window.open('about:blank', 'linkedin_job_detail');")
    detail_handle = driver.window_handles[-1]
    driver.switch_to.window(detail_handle)
    return detail_handle


def extract_criteria(driver: WebDriver) -> dict[str, str]:
    criteria: dict[str, str] = {}
    rows = driver.find_elements(By.CSS_SELECTOR, ".description__job-criteria-item, li.jobs-unified-top-card__job-insight")
    for row in rows:
        label = text_or_empty(row, [
            (By.CSS_SELECTOR, ".description__job-criteria-subheader"),
            (By.CSS_SELECTOR, "h3"),
        ]).lower()
        value = text_or_empty(row, [
            (By.CSS_SELECTOR, ".description__job-criteria-text"),
            (By.CSS_SELECTOR, "span"),
        ])
        if "seniority" in label:
            criteria["seniority_level"] = value
        elif "employment" in label:
            criteria["employment_type"] = value
        elif "function" in label:
            criteria["job_function"] = value
        elif "industr" in label:
            criteria["industries"] = value
    return criteria


def extract_job_detail(driver: WebDriver, summary: dict[str, str], division: str, query: str) -> JobRecord:
    WebDriverWait(driver, 12).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "body"))
    )
    title = text_or_empty(driver, [
        (By.CSS_SELECTOR, ".top-card-layout__title"),
        (By.CSS_SELECTOR, ".jobs-unified-top-card__job-title"),
        (By.CSS_SELECTOR, "h1"),
    ])
    if not title or is_auth_wall_text(title):
        title = summary["title"]

    company = text_or_empty(driver, [
        (By.CSS_SELECTOR, ".topcard__org-name-link"),
        (By.CSS_SELECTOR, ".jobs-unified-top-card__company-name"),
        (By.CSS_SELECTOR, "a[href*='/company/']"),
    ])
    if not company or is_auth_wall_text(company):
        company = summary["company"]

    location = text_or_empty(driver, [
        (By.CSS_SELECTOR, ".topcard__flavor--bullet"),
        (By.CSS_SELECTOR, ".jobs-unified-top-card__bullet"),
        (By.CSS_SELECTOR, ".jobs-unified-top-card__primary-description-container"),
    ]) or summary["location"]
    description = clean_description(text_or_empty(driver, [
        (By.CSS_SELECTOR, ".show-more-less-html__markup"),
        (By.CSS_SELECTOR, ".jobs-description-content__text"),
        (By.CSS_SELECTOR, "#job-details"),
    ]))
    posted_at = text_or_empty(driver, [
        (By.CSS_SELECTOR, ".posted-time-ago__text"),
        (By.CSS_SELECTOR, ".jobs-unified-top-card__posted-date"),
    ])
    applicants = text_or_empty(driver, [
        (By.CSS_SELECTOR, ".num-applicants__caption"),
        (By.CSS_SELECTOR, ".jobs-unified-top-card__applicant-count"),
    ])
    criteria = extract_criteria(driver)
    linkedin_url = driver.current_url or summary["href"]
    record_id = summary["job_id"] or stable_id(title, company, location, linkedin_url)

    return JobRecord(
        id=str(record_id),
        title=title,
        company=company,
        location=location,
        division=division,
        query=query,
        linkedin_url=linkedin_url,
        description=description,
        posted_at=posted_at,
        applicants=applicants,
        employment_type=criteria.get("employment_type", ""),
        seniority_level=criteria.get("seniority_level", ""),
        job_function=criteria.get("job_function", ""),
        industries=criteria.get("industries", ""),
        experience=infer_experience(description, title),
        salary=infer_salary(description),
        mode=infer_mode(location, description),
        skills=infer_skills(description, title),
    )


def scrape_query(driver: WebDriver, config: dict[str, Any], division: str, query: str, max_pages: int, max_jobs: int) -> list[JobRecord]:
    location = config.get("location", "Tamil Nadu, India")
    date_posted = config.get("date_posted", "past_month")
    records: list[JobRecord] = []
    seen_urls: set[str] = set()
    search_handle = driver.current_window_handle
    detail_handle: str | None = None

    for page in range(max_pages):
        url = build_search_url(query, location, date_posted, page * 25)
        print(f"[{division}] {query} page {page + 1}: {url}")
        driver.switch_to.window(search_handle)
        driver.get(url)
        try:
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        except TimeoutException:
            print("  timed out waiting for page body")
            continue

        polite_delay(config)
        scroll_results(driver)
        cards = find_job_cards(driver)
        summaries = collect_card_summaries(cards)
        print(f"  found {len(cards)} cards, {len(summaries)} usable summaries")

        for summary in summaries:
            if len(records) >= max_jobs:
                break
            try:
                if not summary["href"]:
                    print(f"  skipped card without detail URL: {summary['title']} | {summary['company']}")
                    continue
                unique_key = summary["href"] or stable_id(summary["title"], summary["company"], summary["location"])
                if unique_key in seen_urls:
                    continue
                seen_urls.add(unique_key)

                detail_handle = ensure_detail_tab(driver, search_handle, detail_handle)
                driver.get(summary["href"])
                polite_delay(config)
                record = extract_job_detail(driver, summary, division, query)
                records.append(record)
                print(f"  + {record.title} | {record.company} | {record.location}")
            except Exception as exc:
                print(f"  skipped card: {type(exc).__name__}: {exc}")

        driver.switch_to.window(search_handle)
        if len(records) >= max_jobs:
            break

    if detail_handle and detail_handle in driver.window_handles:
        driver.switch_to.window(detail_handle)
        driver.close()
        driver.switch_to.window(search_handle)

    return records


def dedupe(records: list[JobRecord]) -> list[JobRecord]:
    deduped: dict[str, JobRecord] = {}
    for record in records:
        key = record.id or stable_id(record.title, record.company, record.location)
        if key not in deduped:
            deduped[key] = record
    return list(deduped.values())


def to_app_job(record: JobRecord) -> dict[str, Any]:
    return {
        "id": record.id,
        "title": record.title,
        "company": record.company,
        "location": record.location,
        "experience": record.experience,
        "salary": record.salary,
        "mode": record.mode,
        "description": record.description,
        "linkedinUrl": record.linkedin_url,
        "division": record.division,
        "skills": record.skills,
        "postedAt": record.posted_at,
        "applicants": record.applicants,
        "employmentType": record.employment_type,
        "seniorityLevel": record.seniority_level,
        "jobFunction": record.job_function,
        "industries": record.industries,
    }


def write_outputs(records: list[JobRecord], output_dir: Path) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    raw_path = output_dir / "linkedin_jobs_raw.json"
    app_path = output_dir / "app_jobs.json"
    csv_path = output_dir / "linkedin_jobs.csv"

    raw_rows = [asdict(record) for record in records]
    raw_path.write_text(json.dumps(raw_rows, indent=2, ensure_ascii=False), encoding="utf-8")
    app_path.write_text(json.dumps([to_app_job(record) for record in records], indent=2, ensure_ascii=False), encoding="utf-8")

    fieldnames = list(asdict(records[0]).keys()) if records else list(JobRecord.__dataclass_fields__.keys())
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for record in raw_rows:
            row = {**record, "skills": ", ".join(record.get("skills", []))}
            writer.writerow(row)

    print(f"Wrote {len(records)} jobs")
    print(f"Raw JSON: {raw_path}")
    print(f"App JSON: {app_path}")
    print(f"CSV: {csv_path}")
    return raw_path.resolve()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Scrape LinkedIn IT jobs in Tamil Nadu for s4skillup.")
    parser.add_argument("--config", default="config.json", help="Path to config JSON.")
    parser.add_argument("--headless", action="store_true", help="Run Chrome without a visible window.")
    parser.add_argument(
        "--chrome-profile",
        help="Chrome user data directory. Defaults to a persistent .selenium_chrome_profile folder beside this script.",
    )
    parser.add_argument("--profile-directory", help="Chrome profile directory name, for example Default or Profile 1.")
    parser.add_argument("--max-pages", type=int, help="Override max pages per query.")
    parser.add_argument("--max-jobs", type=int, help="Override max jobs per query.")
    parser.add_argument("--only-division", help="Run only one configured division, for example testing_qa.")
    parser.add_argument("--only-query", help="Run only one search query, for example selenium tester.")
    parser.add_argument("--no-sync-app", action="store_true", help="Write scraper output only; do not update app data files.")
    parser.add_argument("--app-jobs-target", default="../../src/data/linkedinJobs.ts", help="Generated app jobs file.")
    parser.add_argument("--app-companies-target", default="../../src/data/linkedinCompanies.ts", help="Generated app companies file.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    config_path = Path(args.config)
    config = load_config(config_path)
    max_pages = args.max_pages or int(config.get("max_pages_per_query", 2))
    max_jobs = args.max_jobs or int(config.get("max_jobs_per_query", 40))
    output_dir = config_path.parent / config.get("output_dir", "output")
    chrome_profile = Path(args.chrome_profile).expanduser() if args.chrome_profile else Path(__file__).resolve().parent / ".selenium_chrome_profile"

    print(f"Using Chrome profile: {chrome_profile.resolve()}")
    driver = create_driver(args.headless, chrome_profile.resolve(), args.profile_directory)
    all_records: list[JobRecord] = []
    try:
        try:
            divisions = config.get("divisions", {})
            for division, queries in divisions.items():
                if args.only_division and division != args.only_division:
                    continue
                for query in queries:
                    if args.only_query and query.lower() != args.only_query.lower():
                        continue
                    all_records.extend(scrape_query(driver, config, division, query, max_pages, max_jobs))
        except KeyboardInterrupt:
            print("Interrupted. Writing partial results before shutdown...")
        finally:
            raw_path = write_outputs(dedupe(all_records), output_dir)
            if not args.no_sync_app:
                job_count, company_count = sync_to_app(raw_path, Path(args.app_jobs_target), Path(args.app_companies_target))
                print(f"Synced {job_count} jobs to app data")
                print(f"Synced {company_count} companies to app data")
    finally:
        try:
            driver.quit()
        except Exception as exc:
            print(f"Chrome was already closed or unreachable during shutdown: {type(exc).__name__}: {exc}")


if __name__ == "__main__":
    main()
