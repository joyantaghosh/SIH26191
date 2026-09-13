import hashlib
from .evaluator import calculate_route_metrics


def generate_route_data(region: str, zone_data: dict | None = None) -> dict:
    place_name = region.split(",")[0].strip()
    
    sev = zone_data.get("severityIndex", 7.5) if zone_data else 7.5
    zone_id = zone_data.get("zoneId", f"ZONE-{hashlib.md5(region.encode()).hexdigest()[:8].upper()}") if zone_data else "ZONE-DEFAULT"

    coords = zone_data.get("coordinates", [85.31, 23.34]) if zone_data else [85.31, 23.34]
    orig_lng, orig_lat = coords[0], coords[1]

    dest_lng = round(orig_lng + 0.12, 4)
    dest_lat = round(orig_lat + 0.08, 4)

    wp1_lng = round(orig_lng + 0.04, 4)
    wp1_lat = round(orig_lat + 0.02, 4)

    wp2_lng = round(orig_lng + 0.08, 4)
    wp2_lat = round(orig_lat + 0.05, 4)

    dist_km = round(12.0 + (sev * 0.8), 1)
    transit_mins, safety_score, status = calculate_route_metrics(dist_km, sev)

    route_id = f"ROUTE-{hashlib.md5(f'{region}_route'.encode()).hexdigest()[:8].upper()}"

    return {
        "routeId": route_id,
        "zoneId": zone_id,
        "region": region,
        "routeName": f"{place_name} High-Ground Evacuation Corridor Alpha",
        "originCoordinates": [orig_lng, orig_lat],
        "destinationCoordinates": [dest_lng, dest_lat],
        "waypoints": [
            {"name": f"{place_name} Assembly Point 1", "coordinates": [wp1_lng, wp1_lat], "status": "CLEAR"},
            {"name": f"{place_name} Staging Post 2", "coordinates": [wp2_lng, wp2_lat], "status": "CAUTION" if sev > 7.0 else "CLEAR"},
        ],
        "distanceKm": dist_km,
        "estimatedTransitMinutes": transit_mins,
        "safetyScore": safety_score,
        "hazardBottlenecks": [
            f"Narrow terrain pass near km {round(dist_km*0.4, 1)}",
            f"Active weather hazard zone at km {round(dist_km*0.7, 1)}"
        ],
        "status": status,
    }
