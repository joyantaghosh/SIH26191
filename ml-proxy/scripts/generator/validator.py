import json
import re


class ValidationError(Exception):
    """Raised when Stage 1 output fails sanity checks."""


def extract_json(text: str) -> dict:
    """
    Attempts to extract a JSON object from the model's response,
    handling optional markdown code-fences.
    """
    cleaned = re.sub(r"```(?:json)?\s*", "", text)
    cleaned = cleaned.strip().rstrip("`")

    start = cleaned.find("{")
    end = cleaned.rfind("}") + 1
    if start == -1 or end == 0:
        raise ValidationError("No JSON object found in model response.")

    try:
        return json.loads(cleaned[start:end])
    except json.JSONDecodeError as exc:
        raise ValidationError(f"Malformed JSON: {exc}") from exc


def validate_zone_data(data: dict) -> dict:
    """
    Enforces all sanity constraints on the retrieved data.
    Raises ValidationError with a human-readable reason on failure.
    Returns the (possibly lightly cleaned) data on success.
    """
    # ── Required keys ─────────────────────────────────────────────────────
    required_top = [
        "name", "region", "description", "hazardTypes", "riskLevel",
        "vulnerabilityScore", "severityIndex", "metrics", "population",
        "households", "distanceToHazardKm", "center", "radiusMeters",
    ]
    missing = [k for k in required_top if k not in data]
    if missing:
        raise ValidationError(f"Missing keys: {missing}")

    required_metrics = ["severity", "density", "soilRisk"]
    missing_m = [k for k in required_metrics if k not in data["metrics"]]
    if missing_m:
        raise ValidationError(f"Missing metrics keys: {missing_m}")

    for coord_key in ("longitude", "latitude"):
        if coord_key not in data.get("center", {}):
            raise ValidationError(f"center.{coord_key} is missing.")

    # ── Type coercions ────────────────────────────────────────────────────
    data["population"] = int(data["population"])
    data["households"] = int(data["households"])
    data["radiusMeters"] = int(data["radiusMeters"])
    data["vulnerabilityScore"] = float(data["vulnerabilityScore"])
    data["severityIndex"] = float(data["severityIndex"])
    data["distanceToHazardKm"] = float(data["distanceToHazardKm"])
    data["center"]["longitude"] = float(data["center"]["longitude"])
    data["center"]["latitude"] = float(data["center"]["latitude"])
    data["metrics"]["severity"] = float(data["metrics"]["severity"])
    data["metrics"]["density"] = float(data["metrics"]["density"])
    data["metrics"]["soilRisk"] = float(data["metrics"]["soilRisk"])

    # ── Population sanity ─────────────────────────────────────────────────
    pop = data["population"]
    if not (1_000 < pop < 500_000_000):
        raise ValidationError(
            f"population={pop} is out of realistic range (1 000 – 500 000 000)."
        )

    # ── Household estimate ────────────────────────────────────────────────
    hh = data["households"]
    expected_low = pop / 4 * 0.7
    expected_high = pop / 4 * 1.3
    if not (expected_low <= hh <= expected_high):
        raise ValidationError(
            f"households={hh} is inconsistent with population={pop}. "
            f"Expected roughly {int(pop / 4)} (±30 %)."
        )

    # ── Hazard distance must be > 0 ───────────────────────────────────────
    dist = data["distanceToHazardKm"]
    if dist <= 0.0:
        raise ValidationError(
            f"distanceToHazardKm={dist} — safe zones cannot have 0.0 km "
            "distance to hazard."
        )

    # ── Severity / risk-level consistency ─────────────────────────────────
    risk = data["riskLevel"].lower()
    sev = data["severityIndex"]
    msev = data["metrics"]["severity"]
    if risk in ("high", "critical"):
        if sev < 5.0:
            raise ValidationError(
                f"severityIndex={sev} is too low for riskLevel='{risk}' "
                "(must be ≥ 5.0)."
            )
        if msev < 5.0:
            raise ValidationError(
                f"metrics.severity={msev} is too low for riskLevel='{risk}' "
                "(must be ≥ 5.0)."
            )

    # ── Allowed enum values ───────────────────────────────────────────────
    allowed_hazards = {
        "earthquake", "landslide", "flood", "cyclone", "tsunami", "volcanic",
        "flash_flood", "glof", "debris_flow",
    }
    ht = data["hazardTypes"]
    if not isinstance(ht, list) or len(ht) == 0:
        raise ValidationError(
            f"hazardTypes must be a non-empty list, got: {ht}"
        )
    if len(ht) > 5:
        raise ValidationError(
            f"hazardTypes has {len(ht)} entries (max 5)."
        )
    for i, h in enumerate(ht):
        if h.lower() not in allowed_hazards:
            raise ValidationError(
                f"hazardTypes[{i}]='{h}' is not in {allowed_hazards}."
            )
    data["hazardTypes"] = [h.lower() for h in ht]

    allowed_risks = {"low", "moderate", "high", "critical"}
    if risk not in allowed_risks:
        raise ValidationError(
            f"riskLevel='{data['riskLevel']}' is not in {allowed_risks}."
        )
    data["riskLevel"] = risk

    # ── Vulnerability score range ─────────────────────────────────────────
    vs = data["vulnerabilityScore"]
    if not (0.0 <= vs <= 1.0):
        raise ValidationError(
            f"vulnerabilityScore={vs} is outside [0.0, 1.0]."
        )

    # ── Soil risk range ───────────────────────────────────────────────────
    sr = data["metrics"]["soilRisk"]
    if not (0.0 <= sr <= 1.0):
        raise ValidationError(f"metrics.soilRisk={sr} is outside [0.0, 1.0].")

    # ── Seismic zone validity assertion (IS 1893: max Zone V) ─────────────
    text_to_check = f"{data['name']} {data['description']}"
    if re.search(r"\bzone\s*(?:6|vi|6\+|vi\+)\b", text_to_check, re.IGNORECASE):
        raise ValidationError(
            "Invalid seismic zone detected! IS 1893 guidelines define seismic "
            "zones strictly up to Zone V (5). References to Zone 6 / VI are invalid."
        )

    # ── Tsunami relevance assertion for inland regions ─────────────────────
    inland_keywords = [
        "uttarakhand", "himachal", "assam", "bihar", "wayanad", "leh", "ladakh",
        "darjeeling", "joshimath", "chamoli", "kathmandu", "pokhara", "mustang",
        "solukhumbu", "chitwan", "rajasthan", "barmer", "cachar", "shimla"
    ]
    reg_lower = data["region"].lower()
    if "tsunami" in data["hazardTypes"]:
        if any(ik in reg_lower for ik in inland_keywords):
            raise ValidationError(
                f"Invalid hazardType 'tsunami' specified for inland region '{data['region']}'."
            )

    return data
