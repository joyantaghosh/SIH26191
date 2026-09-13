#!/usr/bin/env python3
"""
scripts/generate_capacity.py — CLI Entrypoint for Carrying Capacity Assessment Generator

Command-line usage:
    python scripts/generate_capacity.py
    python scripts/generate_capacity.py --force
"""

import sys
import os
import re
import time
import argparse
from pathlib import Path

# Add scripts directory to python path for modular imports
sys.path.insert(0, str(Path(__file__).parent))

from google import genai

from capacity import (
    API_KEY,
    RISK_ZONES_DIR,
    CAPACITY_OUTPUT_DIR,
    MODEL_ID,
    ALL_20_REGIONS,
    BETWEEN_REGION_DELAY,
    retrieve_capacity_data,
    transform_to_capacity_bson_js,
)


def safe_filename(region: str) -> str:
    """Generates a safe filename slug for capacity output files."""
    clean = region.lower().replace(",", "").replace(" ", "_")
    clean = re.sub(r"[^a-z0-9_]", "", clean)
    return f"{clean}_capacity.js"


def parse_risk_zone_file(filepath: Path) -> dict:
    """Parses basic context (region, population, name) from existing risk zone JS files."""
    if not filepath.exists():
        return {}

    content = filepath.read_text(encoding="utf-8")
    data = {}

    pop_match = re.search(r"population:\s*NumberInt\('(\d+)'\)", content)
    if pop_match:
        data["population"] = int(pop_match.group(1))

    name_match = re.search(r'name:\s*"(.*?)"', content)
    if name_match:
        data["name"] = name_match.group(1)

    reg_match = re.search(r'region:\s*"(.*?)"', content)
    if reg_match:
        data["region"] = reg_match.group(1)

    risk_match = re.search(r'riskLevel:\s*"(.*?)"', content)
    if risk_match:
        data["riskLevel"] = risk_match.group(1)

    desc_match = re.search(r'description:\s*"(.*?)"', content)
    if desc_match:
        data["description"] = desc_match.group(1)

    ht_match = re.search(r"hazardTypes:\s*\[(.*?)\]", content, re.DOTALL)
    if ht_match:
        data["hazardTypes"] = re.findall(r'"(.*?)"', ht_match.group(1))

    return data


def parse_cli_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate Carrying Capacity Assessment BSON seed scripts for all 20 regions."
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing cached capacity files in outputs/capacity_output_data/.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_cli_args()

    client = None
    if API_KEY:
        try:
            client = genai.Client(api_key=API_KEY)
        except Exception as exc:
            print(f"⚠️ Warning: Could not initialize Gemini client ({exc}). Using offline grounding engine.", file=sys.stderr)

    CAPACITY_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    regions = ALL_20_REGIONS
    total = len(regions)

    print("═" * 65)
    print(" CARRYING CAPACITY ASSESSMENT PIPELINE GENERATOR")
    print(f"▸ Model           : {MODEL_ID if client else 'Offline Derivation'}")
    print(f"▸ Output directory : {CAPACITY_OUTPUT_DIR.resolve()}")
    print(f"▸ Target regions   : {total}")
    print("═" * 65)

    succeeded = 0

    for idx, region in enumerate(regions, start=1):
        out_filename = safe_filename(region)
        out_filepath = CAPACITY_OUTPUT_DIR / out_filename

        print(f"\n[{idx}/{total}] Processing Capacity Assessment: {region}")

        if out_filepath.exists() and not args.force:
            print(f"  ⏭ SKIPPED (Cached) — file already exists → {out_filepath}")
            succeeded += 1
            continue

        # Load existing risk zone file for grounding
        rz_filename = safe_filename(region).replace("_capacity.js", "_mock_data.js")
        rz_filepath = RISK_ZONES_DIR / rz_filename
        zone_data = parse_risk_zone_file(rz_filepath)

        # Retrieve/Derive capacity data and compute calculatedMetrics
        cap_data = retrieve_capacity_data(client, region, zone_data)

        # Transform into BSON shell JS script
        js_code = transform_to_capacity_bson_js(cap_data)

        out_filepath.write_text(js_code, encoding="utf-8")
        print(f"  ✓ Succeeded — Assessment written to {out_filepath}")
        succeeded += 1

    print("\n" + "═" * 65)
    print(f"Done. {succeeded}/{total} Carrying Capacity Assessment seed files ready.")
    print("═" * 65)


if __name__ == "__main__":
    main()
