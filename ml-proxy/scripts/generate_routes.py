import re
import sys
from pathlib import Path

# Add scripts directory to python path for modular imports
sys.path.insert(0, str(Path(__file__).parent))

from route.config import ALL_50_REGIONS, RISK_ZONES_DIR, ROUTE_OUTPUT_DIR
from route.client import generate_route_data
from route.bson_serializer import transform_to_route_bson_js


def slugify_region(region_name: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", region_name.lower())
    return re.sub(r"[-\s]+", "_", slug).strip("_")


def parse_js_file(filepath: Path) -> dict:
    if not filepath.exists():
        return {}
    text = filepath.read_text(encoding="utf-8")
    
    sev_m = re.search(r'severityIndex:\s*Double\(["\']?([\d\.]+)["\']?\)', text)
    zoneid_m = re.search(r'zoneId:\s*["\']([^"\']+)["\']', text)
    coords_m = re.search(r'coordinates:\s*\[\s*Double\(["\']?([-\d\.]+)["\']?\),\s*Double\(["\']?([-\d\.]+)["\']?\)\s*\]', text)

    return {
        "severityIndex": float(sev_m.group(1)) if sev_m else 7.5,
        "zoneId": zoneid_m.group(1) if zoneid_m else "ZONE-001",
        "coordinates": [float(coords_m.group(1)), float(coords_m.group(2))] if coords_m else [85.31, 23.34],
    }


def main():
    ROUTE_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    total = len(ALL_50_REGIONS)
    succeeded, failed = 0, 0

    print("=" * 65)
    print(f"🚀 Starting Evacuation Route Seed Generation for {total} regions")
    print(f"   Output Directory: {ROUTE_OUTPUT_DIR.resolve()}")
    print("=" * 65)

    for idx, region in enumerate(ALL_50_REGIONS, start=1):
        slug = slugify_region(region)
        out_filename = f"{slug}_route.js"
        out_path = ROUTE_OUTPUT_DIR / out_filename

        print(f"\n[{idx}/{total}] Evacuation Route: {region}")

        zone_path = RISK_ZONES_DIR / f"{slug}_mock_data.js"
        zone_data = parse_js_file(zone_path)

        route_dict = generate_route_data(region, zone_data)
        bson_js = transform_to_route_bson_js(route_dict)

        out_path.write_text(bson_js, encoding="utf-8")
        print(f"  ✓ Written to {out_path}")
        succeeded += 1

    print("\n" + "═" * 65)
    print(f"Done. {succeeded} route seed files created, {failed} failed.")


if __name__ == "__main__":
    main()
