"""
scripts/capacity/evaluator.py — Mathematical Metrics & Stress Level Calculator
"""

def calculate_capacity_metrics(input_params: dict) -> dict:
    """
    Computes precise, realistic calculatedMetrics for a Carrying Capacity Assessment.

    input_params dict keys:
      - population (int)
      - landHectares (int)
      - waterSupplyLitersDay (int)
      - housingUnits (int)
      - medicalBeds (int)
    """
    pop = int(input_params["population"])
    land = int(input_params["landHectares"])
    water = int(input_params["waterSupplyLitersDay"])
    housing = int(input_params["housingUnits"])
    beds = int(input_params["medicalBeds"])

    # 1. Max safe capacity based on land density threshold (~4.8 to 5 people per hectare reserve limit)
    # or population headroom calculation
    max_safe = max(pop + 500, int(land * 4.8))
    available_cap = max(0, max_safe - pop)

    # 2. Saturation percentage
    pop_sat_pct = int(round((pop / max_safe) * 100)) if max_safe > 0 else 100

    # 3. Resource utilization percentages
    # Water standard: ~120 liters / person / day baseline
    water_util_pct = int(round((pop * 120) / water * 100)) if water > 0 else 100
    water_util_pct = min(100, max(1, water_util_pct))

    # Housing standard: ~2.5 persons / housing unit
    housing_req = pop / 2.5
    housing_util_pct = int(round((housing_req / housing) * 100)) if housing > 0 else 100
    housing_util_pct = min(100, max(1, housing_util_pct))

    # Health standard: ~5% emergency triage vulnerability factor relative to beds
    beds_req = pop * 0.05
    health_util_pct = int(round((beds_req / beds) * 100)) if beds > 0 else 100
    health_util_pct = min(100, max(1, health_util_pct))

    # 4. Stress level classification
    if pop_sat_pct >= 95:
        stress_level = "CRITICAL"
    elif pop_sat_pct >= 80:
        stress_level = "HIGH"
    elif pop_sat_pct >= 60:
        stress_level = "ELEVATED"
    else:
        stress_level = "NORMAL"

    return {
        "maxSafeCapacity": max_safe,
        "availableCapacity": available_cap,
        "populationSaturationPercent": pop_sat_pct,
        "waterUtilizationPercent": water_util_pct,
        "housingUtilizationPercent": housing_util_pct,
        "healthUtilizationPercent": health_util_pct,
        "stressLevel": stress_level,
    }
