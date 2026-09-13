def calculate_route_metrics(dist_km: float, severity_index: float) -> tuple[int, float, str]:
    """
    Calculates estimated transit minutes, safety score, and status.
    """
    speed_kmh = max(15.0, 45.0 - severity_index * 2.5)
    transit_mins = int((dist_km / speed_kmh) * 60.0)

    safety_score = round(max(1.0, min(10.0, 10.0 - severity_index * 0.45)), 1)

    if safety_score >= 7.5:
        status = "ACTIVE_SAFE"
    elif safety_score >= 5.0:
        status = "CAUTION_CONGESTED"
    else:
        status = "BLOCKED_IMPASSABLE"

    return transit_mins, safety_score, status
