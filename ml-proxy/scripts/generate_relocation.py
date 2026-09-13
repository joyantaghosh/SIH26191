import re
import sys
from pathlib import Path

# Add scripts directory to python path for modular imports
sys.path.insert(0, str(Path(__file__).parent))

from relocation.config import ALL_50_REGIONS, RISK_ZONES_DIR, CAPACITY_DIR, RELOCATION_OUTPUT_DIR
from relocation.client import generate_relocation_data
from relocation.bson_serializer import transform_to_relocation_bson_js


def slugify_region(region_name: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", region_name.lower())
    return re.sub(r"[-\s]+", "_", slug).strip("_")


def parse_js_file(filepath: Path) -> dict:
    if not filepath.exists():
        return {}
    text = filepath.read_text(encoding="utf-8")
    
    pop_m = re.search(r'population:\s*NumberInt\(["\']?(\d+)["\']?\)', text)
    sev_m = re.search(r'severityIndex:\s*Double\(["\']?([\d\.]+)["\']?\)', text)
    vuln_m = re.search(r'vulnerabilityScore:\s*Double\(["\']?([\d\.]+)["\']?\)', text)
    zoneid_m = re.search(r'zoneId:\s*["\']([^"\']+)["\']', text)
    sector_m = re.search(r'sectorName:\s*["\']([^"\']+)["\']', text)

    return {
        "population": int(pop_m.group(1)) if pop_m else 50000,
        "severityIndex": float(sev_m.group(1)) if sev_m else 7.5,
        "vulnerabilityScore": float(vuln_m.group(1)) if vuln_m else 0.75,
        "zoneId": zoneid_m.group(1) if zoneid_m else "ZONE-001",
        "sectorName": sector_m.group(1) if sector_m else "",
    }


def main():
    RELOCATION_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    total = len(ALL_50_REGIONS)
    succeeded, failed = 0, 0

    print("=" * 65)
    print(f"🚀 Starting Relocation Priority Seed Generation for {total} regions")
    print(f"   Output Directory: {RELOCATION_OUTPUT_DIR.resolve()}")
    print("=" * 65)

    for idx, region in enumerate(ALL_50_REGIONS, start=1):
        slug = slugify_region(region)
        out_filename = f"{slug}_relocation.js"
        out_path = RELOCATION_OUTPUT_DIR / out_filename

        print(f"\n[{idx}/{total}] Relocation Priority: {region}")

        zone_path = RISK_ZONES_DIR / f"{slug}_mock_data.js"
        capacity_path = CAPACITY_DIR / f"{slug}_capacity.js"

        zone_data = parse_js_file(zone_path)
        cap_data = parse_js_file(capacity_path)

        rel_dict = generate_relocation_data(region, zone_data, cap_data)
        rel_dict["priorityRank"] = idx

        bson_js = transform_to_relocation_bson_js(rel_dict)
        out_path.write_text(bson_js, encoding="utf-8")

        print(f"  ✓ Written to {out_path}")
        succeeded += 1

    print("\n" + "═" * 65)
    print(f"Done. {succeeded} relocation seed files created, {failed} failed.")


if __name__ == "__main__":
    main()
