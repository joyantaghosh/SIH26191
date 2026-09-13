#!/usr/bin/env python3
"""
scripts/generate_zones.py — CLI Entrypoint for Disaster Risk Zone Data Pipeline

Command-line usage:
    python scripts/generate_zones.py
    python scripts/generate_zones.py --regions "Wayanad, Kerala, India" "Chamoli, Uttarakhand, India"
    python scripts/generate_zones.py --force
"""

import sys
import time
import argparse
import re
from pathlib import Path

# Add scripts directory to python path for modular imports
sys.path.insert(0, str(Path(__file__).parent))

from google import genai

from generator import (
    API_KEY,
    OUTPUT_DIR,
    MODEL_ID,
    DEFAULT_REGIONS,
    MAX_RETRIES,
    BETWEEN_REGION_DELAY,
    ValidationError,
    transform_to_bson_js,
    retrieve_and_validate,
)


def safe_filename(region: str) -> str:
    """Generates a safe filename slug from a region string."""
    clean = region.lower().replace(",", "").replace(" ", "_")
    clean = re.sub(r"[^a-z0-9_]", "", clean)
    return f"{clean}_mock_data.js"


def write_seed_file(filepath: Path, js_code: str) -> None:
    """Writes the generated JavaScript code to the target output file."""
    filepath.parent.mkdir(parents=True, exist_ok=True)
    filepath.write_text(js_code, encoding="utf-8")


def parse_cli_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate grounded multi-hazard MongoDB seed scripts for disaster monitoring."
    )
    parser.add_argument(
        "--regions",
        nargs="+",
        default=DEFAULT_REGIONS,
        help="List of target regions to process.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Bypass local file cache and force API regeneration for all regions.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_cli_args()

    if not API_KEY:
        print("ERROR: GEMINI_API_KEY environment variable is not set.", file=sys.stderr)
        print("Copy .env.example -> .env and add your key.", file=sys.stderr)
        sys.exit(1)

    client = genai.Client(api_key=API_KEY)
    regions: list[str] = args.regions
    total = len(regions)

    print(f"▸ Model           : {MODEL_ID}")
    print(f"▸ Output directory : {OUTPUT_DIR.resolve()}")
    print(f"▸ Target regions   : {total}")
    print("═" * 60)

    succeeded = 0
    failed = 0

    for idx, region in enumerate(regions, start=1):
        filename = safe_filename(region)
        filepath = OUTPUT_DIR / filename

        print(f"\n[{idx}/{total}] Processing: {region}")

        # Local File Cache check
        if filepath.exists() and not args.force:
            print(f"  ⏭ SKIPPED (Cached) — file already exists → {filepath}")
            succeeded += 1
            continue

        success = False
        for attempt in range(1, MAX_RETRIES + 1):
            print(f"  Stage 1: Querying Gemini API (Attempt {attempt}/{MAX_RETRIES})...")
            try:
                data = retrieve_and_validate(client, region)
                print("  ✓ Stage 1 succeeded — Data retrieved and validated.")

                print("  Stage 2: Transforming into MongoDB BSON shell script...")
                js_code = transform_to_bson_js(data)

                write_seed_file(filepath, js_code)
                print(f"  ✓ Stage 2 succeeded — Seed script written to {filepath}")
                succeeded += 1
                success = True
                break
            except ValidationError as exc:
                print(f"  ❌ Validation failed: {exc}", file=sys.stderr)
            except Exception as exc:
                print(f"  ❌ Unexpected error: {exc}", file=sys.stderr)

        if not success:
            print(f"  ❌ SKIPPED {region} after {MAX_RETRIES} failed attempts.", file=sys.stderr)
            failed += 1

    print("\n" + "═" * 60)
    print(f"Done.  {succeeded} succeeded, {failed} failed.")


if __name__ == "__main__":
    main()
