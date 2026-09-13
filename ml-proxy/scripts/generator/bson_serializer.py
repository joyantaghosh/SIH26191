import uuid
from datetime import datetime, timezone


def mongo_double(val: float | int) -> str:
    """Formats a float as a MongoDB Shell BSON Double type: Double('12.34')"""
    return f"Double('{float(val):.4g}')" if isinstance(val, float) else f"Double('{val}')"


def mongo_int(val: int) -> str:
    """Formats an integer as a MongoDB Shell BSON NumberInt type: NumberInt('100')"""
    return f"NumberInt('{int(val)}')"


def mongo_date(dt: datetime | None = None) -> str:
    """Formats a datetime as a MongoDB Shell BSON ISODate type."""
    if dt is None:
        dt = datetime.now(timezone.utc)
    iso = dt.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    return f"ISODate('{iso}')"


def format_js_string_array(str_list: list[str]) -> str:
    """Formats a Python list of strings into a JavaScript array string."""
    formatted_items = [f'"{s}"' for s in str_list]
    return f"[{', '.join(formatted_items)}]"


def escape_js(text: str) -> str:
    """Escapes quotes and backslashes for embedding inside JS string literals."""
    return (
        text.replace("\\", "\\\\")
            .replace('"', '\\"')
            .replace("\n", " ")
    )


def transform_to_bson_js(data: dict) -> str:
    """
    Transforms the Stage 1 output dictionary into a MongoDB shell (.js) script.
    The output contains a db.riskzones.insertOne({...}) statement using BSON wrappers.
    """
    now = datetime.now(timezone.utc)
    now_iso = now.strftime("%Y-%m-%dT%H:%M:%S.000Z")

    short_id = uuid.uuid4().hex[:8].upper()
    zone_id = f"ZONE-{short_id}"

    lon = data["center"]["longitude"]
    lat = data["center"]["latitude"]

    name_clean = escape_js(data["name"])
    region_clean = escape_js(data["region"])
    desc_clean = escape_js(data["description"])
    hazard_types_js = format_js_string_array(data["hazardTypes"])

    js_code = f"""// ─── Auto-generated MongoDB seed document ───────────────────────────
// Region : {data['region']}
// Generated : {now_iso}
// ────────────────────────────────────────────────────────────────────

db.riskzones.insertOne({{
    zoneId: "{zone_id}",
    name: "{name_clean}",
    region: "{region_clean}",
    description: "{desc_clean}",
    hazardTypes: {hazard_types_js},
    riskLevel: "{data['riskLevel']}",
    vulnerabilityScore: {mongo_double(data['vulnerabilityScore'])},
    severityIndex: {mongo_double(data['severityIndex'])},
    metrics: {{
        severity: {mongo_double(data['metrics']['severity'])},
        density: {mongo_double(data['metrics']['density'])},
        soilRisk: {mongo_double(data['metrics']['soilRisk'])}
    }},
    population: {mongo_int(data['population'])},
    households: {mongo_int(data['households'])},
    distanceToHazardKm: {mongo_double(data['distanceToHazardKm'])},
    center: {{
        type: "Point",
        coordinates: [{mongo_double(lon)}, {mongo_double(lat)}]
    }},
    radiusMeters: {mongo_int(data['radiusMeters'])},
    isActive: true,
    lastTelemetryAt: {mongo_date(now)},
    __v: {mongo_int(0)},
    createdAt: {mongo_date(now)},
    updatedAt: {mongo_date(now)}
}});
"""
    return js_code
