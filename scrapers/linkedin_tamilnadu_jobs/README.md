# LinkedIn Tamil Nadu IT Jobs Scraper

Selenium scraper for collecting IT jobs across Tamil Nadu divisions such as development, QA/testing, data, cloud, security, support, and product/design.

This is intentionally a standalone folder. It does not modify the React app directly. It exports:

- `output/linkedin_jobs_raw.json`: rich records with description, criteria, URL, query, division, and scrape metadata.
- `output/app_jobs.json`: compact records matching the current app's `JobOpportunity` shape.
- `output/linkedin_jobs.csv`: spreadsheet-friendly export.

## Setup

```powershell
cd scrapers/linkedin_tamilnadu_jobs
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item config.example.json config.json
```

Selenium 4 can usually download/use the right Chrome driver through Selenium Manager.

## Run

Public LinkedIn pages:

```powershell
python scrape_linkedin_jobs.py --config config.json
```

By default the script reuses a local browser profile at `.selenium_chrome_profile`, so you should not get a fresh Chrome identity for every run.

For the first LinkedIn login, run without `--headless` and keep the Chrome window open until you finish signing in:

```powershell
python scrape_linkedin_jobs.py --config config.json --max-pages 1 --max-jobs 2 --only-query "full stack developer"
```

After that, the same `.selenium_chrome_profile` is reused by later runs, including headless runs.

Use an existing Chrome profile when LinkedIn requires normal sign-in:

```powershell
python scrape_linkedin_jobs.py --config config.json --chrome-profile "C:\Users\gurug\AppData\Local\Google\Chrome\User Data" --profile-directory "Default"
```

When using your normal Chrome profile, close regular Chrome first so ChromeDriver can attach to that profile cleanly.

Headless mode:

```powershell
python scrape_linkedin_jobs.py --config config.json --headless
```

Limit while testing:

```powershell
python scrape_linkedin_jobs.py --config config.json --max-pages 1 --max-jobs 10
```

Run one division or one query while testing:

```powershell
python scrape_linkedin_jobs.py --config config.json --only-division testing_qa --max-pages 1 --max-jobs 5
python scrape_linkedin_jobs.py --config config.json --only-query "selenium tester" --max-pages 1 --max-jobs 5
```

## Load Results Into The App

After scraping, generate the React data file:

```powershell
python sync_to_app.py
```

That writes `src/data/linkedinJobs.ts`. `JobListView` automatically uses those scraped jobs when the file has data, and falls back to the old mock jobs when it is empty.

## Check Output Quality

```powershell
python validate_output.py
```

This prints field completeness, description coverage, skill detection coverage, and a few sample rows.

## Notes

- This script does not bypass login, CAPTCHA, rate limits, or access controls.
- Keep delays enabled and scrape only what you need.
- LinkedIn markup changes often, so selectors are written with fallbacks in `scrape_linkedin_jobs.py`.
- Review LinkedIn's terms and your intended use before running this at scale.
