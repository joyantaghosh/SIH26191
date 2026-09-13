import hashlib
from .evaluator import calculate_priority_score


def generate_relocation_data(region: str, zone_data: dict | None = None, capacity_data: dict | None = None) -> dict:
    place_name = region.split(",")[0].strip()
    
    pop = zone_data.get("population", 50000) if zone_data else 50000
    sev = zone_data.get("severityIndex", 7.5) if zone_data else 7.5
    vuln = zone_data.get("vulnerabilityScore", 0.75) if zone_data else 0.75
    zone_id = zone_data.get("zoneId", f"ZONE-{hashlib.md5(region.encode()).hexdigest()[:8].upper()}") if zone_data else "ZONE-DEFAULT"

    vuln_pop = int(pop * 0.12)
    mobility_cnt = int(vuln_pop * 0.18)

    score, tier = calculate_priority_score(sev, vuln, vuln_pop, mobility_cnt)

    refuge_sec = capacity_data.get("sectorName", f"{place_name} Refuge Carrying Capacity Sector") if capacity_data else f"{place_name} Safe Refuge Sector"
    allocated_beds = capacity_data.get("inputParameters", {}).get("medicalBeds", 250) * 10 if capacity_data else 2500

    rel_id = f"REL-{hashlib.md5(f'{region}_rel'.encode()).hexdigest()[:8].upper()}"

    return {
        "relocationId": rel_id,
        "zoneId": zone_id,
        "region": region,
        "habitationName": f"{place_name} Vulnerable Settlement Sector 1",
        "vulnerablePopulation": vuln_pop,
        "priorityRank": 1,
        "priorityTier": tier,
        "priorityScore": score,
        "mobilityConstrainedCount": mobility_cnt,
        "destinationRefugeSector": refuge_sec,
        "allocatedShelterBeds": allocated_beds,
        "status": "PENDING_EVACUATION" if tier in ("CRITICAL_URGENT", "HIGH_PRIORITY") else "STAGED",
    }
