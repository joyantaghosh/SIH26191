import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

DATA_EXPORT_DIR = Path("./outputs/data")
DATA_EXPORT_DIR.mkdir(parents=True, exist_ok=True)


def parse_relocation_file(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    rel_id = re.search(r"relocationId:\s*['\"]([^'\"]+)['\"]", text)
    zone_id = re.search(r"zoneId:\s*['\"]([^'\"]+)['\"]", text)
    region = re.search(r"region:\s*['\"]([^'\"]+)['\"]", text)
    habitation = re.search(r"habitationName:\s*['\"]([^'\"]+)['\"]", text)
    pop = re.search(r"vulnerablePopulation:\s*NumberInt\(['\"]?(\d+)['\"]?\)", text)
    rank = re.search(r"priorityRank:\s*NumberInt\(['\"]?(\d+)['\"]?\)", text)
    tier = re.search(r"priorityTier:\s*['\"]([^'\"]+)['\"]", text)
    score = re.search(r"priorityScore:\s*Double\(['\"]?([\d\.]+)['\"]?\)", text)
    mobility = re.search(r"mobilityConstrainedCount:\s*NumberInt\(['\"]?(\d+)['\"]?\)", text)
    refuge = re.search(r"destinationRefugeSector:\s*['\"]([^'\"]+)['\"]", text)
    beds = re.search(r"allocatedShelterBeds:\s*NumberInt\(['\"]?(\d+)['\"]?\)", text)
    status = re.search(r"status:\s*['\"]([^'\"]+)['\"]", text)

    return {
        "relocationId": rel_id.group(1) if rel_id else "",
        "zoneId": zone_id.group(1) if zone_id else "",
        "region": region.group(1) if region else "",
        "habitationName": habitation.group(1) if habitation else "",
        "vulnerablePopulation": int(pop.group(1)) if pop else 0,
        "priorityRank": int(rank.group(1)) if rank else 0,
        "priorityTier": tier.group(1) if tier else "MEDIUM_PRIORITY",
        "priorityScore": float(score.group(1)) if score else 50.0,
        "mobilityConstrainedCount": int(mobility.group(1)) if mobility else 0,
        "destinationRefugeSector": refuge.group(1) if refuge else "",
        "allocatedShelterBeds": int(beds.group(1)) if beds else 0,
        "status": status.group(1) if status else "PENDING_EVACUATION",
    }


def parse_route_file(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    route_id = re.search(r"routeId:\s*['\"]([^'\"]+)['\"]", text)
    zone_id = re.search(r"zoneId:\s*['\"]([^'\"]+)['\"]", text)
    region = re.search(r"region:\s*['\"]([^'\"]+)['\"]", text)
    name = re.search(r"routeName:\s*['\"]([^'\"]+)['\"]", text)
    dist = re.search(r"distanceKm:\s*Double\(['\"]?([\d\.]+)['\"]?\)", text)
    mins = re.search(r"estimatedTransitMinutes:\s*NumberInt\(['\"]?(\d+)['\"]?\)", text)
    score = re.search(r"safetyScore:\s*Double\(['\"]?([\d\.]+)['\"]?\)", text)
    status = re.search(r"status:\s*['\"]([^'\"]+)['\"]", text)

    orig_m = re.search(r"originCoordinates:\s*\{\s*type:\s*[\"']Point[\"'],\s*coordinates:\s*\[\s*Double\(['\"]?([-\d\.]+)['\"]?\),\s*Double\(['\"]?([-\d\.]+)['\"]?\)\s*\]\s*\}", text)
    dest_m = re.search(r"destinationCoordinates:\s*\{\s*type:\s*[\"']Point[\"'],\s*coordinates:\s*\[\s*Double\(['\"]?([-\d\.]+)['\"]?\),\s*Double\(['\"]?([-\d\.]+)['\"]?\)\s*\]\s*\}", text)

    return {
        "routeId": route_id.group(1) if route_id else "",
        "zoneId": zone_id.group(1) if zone_id else "",
        "region": region.group(1) if region else "",
        "routeName": name.group(1) if name else "",
        "originCoordinates": [float(orig_m.group(1)), float(orig_m.group(2))] if orig_m else [0.0, 0.0],
        "destinationCoordinates": [float(dest_m.group(1)), float(dest_m.group(2))] if dest_m else [0.0, 0.0],
        "distanceKm": float(dist.group(1)) if dist else 10.0,
        "estimatedTransitMinutes": int(mins.group(1)) if mins else 30,
        "safetyScore": float(score.group(1)) if score else 8.0,
        "status": status.group(1) if status else "ACTIVE_SAFE",
    }


def parse_capacity_file(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    ass_id = re.search(r"assessmentId:\s*['\"]([^'\"]+)['\"]", text)
    sector = re.search(r"sectorName:\s*['\"]([^'\"]+)['\"]", text)
    pop = re.search(r"population:\s*NumberInt\(['\"]?(\d+)['\"]?\)", text)
    max_cap = re.search(r"maxSafeCapacity:\s*NumberInt\(['\"]?(\d+)['\"]?\)", text)
    avail = re.search(r"availableCapacity:\s*NumberInt\(['\"]?(\d+)['\"]?\)", text)
    stress = re.search(r"stressLevel:\s*['\"]([^'\"]+)['\"]", text)

    return {
        "assessmentId": ass_id.group(1) if ass_id else "",
        "sectorName": sector.group(1) if sector else "",
        "population": int(pop.group(1)) if pop else 0,
        "maxSafeCapacity": int(max_cap.group(1)) if max_cap else 0,
        "availableCapacity": int(avail.group(1)) if avail else 0,
        "stressLevel": stress.group(1) if stress else "NORMAL",
    }


def parse_risk_zone_file(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    zone_id = re.search(r"zoneId:\s*['\"]([^'\"]+)['\"]", text)
    name = re.search(r"name:\s*['\"]([^'\"]+)['\"]", text)
    region = re.search(r"region:\s*['\"]([^'\"]+)['\"]", text)
    desc = re.search(r"description:\s*['\"](.*?)['\"]", text, re.DOTALL)
    risk_level = re.search(r"riskLevel:\s*['\"]([^'\"]+)['\"]", text)
    vuln = re.search(r"vulnerabilityScore:\s*Double\(['\"]?([\d\.]+)['\"]?\)", text)
    sev = re.search(r"severityIndex:\s*Double\(['\"]?([\d\.]+)['\"]?\)", text)
    pop = re.search(r"population:\s*NumberInt\(['\"]?(\d+)['\"]?\)", text)
    households = re.search(r"households:\s*NumberInt\(['\"]?(\d+)['\"]?\)", text)
    rad = re.search(r"radiusMeters:\s*NumberInt\(['\"]?(\d+)['\"]?\)", text)

    hazards_match = re.search(r"hazardTypes:\s*\[(.*?)\]", text, re.DOTALL)
    hazards = []
    if hazards_match:
        hazards = [h.strip(' "\'\n') for h in hazards_match.group(1).split(",") if h.strip()]

    coords_match = re.search(
        r"coordinates:\s*\[\s*Double\(['\"]?([-\d\.]+)['\"]?\),\s*Double\(['\"]?([-\d\.]+)['\"]?\)\s*\]",
        text,
    )
    lng, lat = 78.96, 20.59
    if coords_match:
        lng = float(coords_match.group(1))
        lat = float(coords_match.group(2))

    return {
        "zoneId": zone_id.group(1) if zone_id else "",
        "name": name.group(1) if name else path.stem,
        "region": region.group(1) if region else "",
        "description": desc.group(1) if desc else "",
        "hazardTypes": hazards,
        "riskLevel": (risk_level.group(1) if risk_level else "moderate").lower(),
        "vulnerabilityScore": float(vuln.group(1)) if vuln else 0.5,
        "severityIndex": float(sev.group(1)) if sev else 5.0,
        "population": int(pop.group(1)) if pop else 0,
        "households": int(households.group(1)) if households else 0,
        "radiusMeters": int(rad.group(1)) if rad else 5000,
        "center": {
            "type": "Point",
            "coordinates": [lng, lat],
        },
    }


def main():
    print("Exporting datasets to outputs/data/...")

    risk_files = list(Path("./outputs/risk_zone_output_data").glob("*.js"))
    risk_data = [parse_risk_zone_file(f) for f in risk_files]
    (DATA_EXPORT_DIR / "riskZones.json").write_text(json.dumps(risk_data, indent=2), encoding="utf-8")
    print(f"  ✓ Exported {len(risk_data)} risk zone items.")

    rel_files = list(Path("./outputs/relocation_output_data").glob("*.js"))
    rel_data = [parse_relocation_file(f) for f in rel_files]
    (DATA_EXPORT_DIR / "relocationPriorities.json").write_text(json.dumps(rel_data, indent=2), encoding="utf-8")
    print(f"  ✓ Exported {len(rel_data)} relocation items.")

    route_files = list(Path("./outputs/route_output_data").glob("*.js"))
    route_data = [parse_route_file(f) for f in route_files]
    (DATA_EXPORT_DIR / "evacuationRoutes.json").write_text(json.dumps(route_data, indent=2), encoding="utf-8")
    print(f"  ✓ Exported {len(route_data)} route items.")

    cap_files = list(Path("./outputs/capacity_output_data").glob("*.js"))
    cap_data = [parse_capacity_file(f) for f in cap_files]
    (DATA_EXPORT_DIR / "carryingCapacity.json").write_text(json.dumps(cap_data, indent=2), encoding="utf-8")
    print(f"  ✓ Exported {len(cap_data)} capacity items.")


if __name__ == "__main__":
    main()

