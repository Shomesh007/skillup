from __future__ import annotations

import argparse
import json
from pathlib import Path


REQUIRED_FIELDS = [
    "id",
    "title",
    "company",
    "location",
    "division",
    "query",
    "linkedin_url",
    "description",
    "experience",
    "salary",
    "mode",
]


def is_present(value) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, list):
        return len(value) > 0
    return True


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate LinkedIn scraper output completeness.")
    parser.add_argument("--input", default="output/linkedin_jobs_raw.json")
    parser.add_argument("--sample", type=int, default=5)
    args = parser.parse_args()

    path = Path(args.input)
    if not path.exists():
        raise SystemExit(f"Output file not found: {path}")

    rows = json.loads(path.read_text(encoding="utf-8"))
    total = len(rows)
    print(f"Jobs: {total}")
    if total == 0:
        return

    for field in REQUIRED_FIELDS:
      filled = sum(1 for row in rows if is_present(row.get(field)))
      print(f"{field}: {filled}/{total} ({filled / total:.0%})")

    with_description = sum(1 for row in rows if len((row.get("description") or "").strip()) >= 120)
    with_skills = sum(1 for row in rows if row.get("skills"))
    auth_wall_titles = [row for row in rows if (row.get("title") or "").strip().lower() in {"sign in", "join linkedin"}]

    print(f"description >= 120 chars: {with_description}/{total} ({with_description / total:.0%})")
    print(f"skills detected: {with_skills}/{total} ({with_skills / total:.0%})")
    print(f"auth-wall-looking titles: {len(auth_wall_titles)}")

    print("\nSample:")
    for row in rows[: args.sample]:
        print(
            f"- {row.get('title')} | {row.get('company')} | {row.get('location')} | "
            f"desc={len(row.get('description') or '')} chars | skills={', '.join(row.get('skills') or [])}"
        )


if __name__ == "__main__":
    main()
