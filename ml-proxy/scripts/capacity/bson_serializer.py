import uuid
from datetime import datetime, timezone


def mongo_int(val: int) -> str:
    """Formats an integer as a MongoDB Shell BSON NumberInt type: NumberInt('100')"""
    return f"NumberInt('{int(val)}')"


def mongo_date(dt: datetime | None = None) -> str:
    """Formats a datetime as a MongoDB Shell BSON ISODate type."""
    if dt is None:
        dt = datetime.now(timezone.utc)
    iso = dt.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    return f"ISODate('{iso}')"


def generate_object_id() -> str:
    """Generates a valid 24-character hexadecimal ObjectId string."""
    return uuid.uuid4().hex[:24]


def generate_assessment_id(region: str) -> str:
    """Generates a standardized assessment ID like CAP-WAYANAD-894."""
    slug = region.split(",")[0].replace(" ", "").upper()[:8]
    suffix = str(uuid.uuid4().int % 900 + 100)
    return f"CAP-{slug}-{suffix}"


def escape_js(text: str) -> str:
    """Escapes quotes and backslashes for embedding inside JS string literals."""
    return (
        text.replace("\\", "\\\\")
            .replace('"', '\\"')
            .replace("\n", " ")
    )


def transform_to_capacity_bson_js(data: dict) -> str:
    """
    Transforms the carrying capacity assessment dict into a MongoDB shell (.js) script
    targeting the db.carryingcapacity collection.
    """
    now = datetime.now(timezone.utc)
    now_iso = now.strftime("%Y-%m-%dT%H:%M:%S.000Z")

    object_id = data.get("objectId") or generate_object_id()
    assessment_id = data.get("assessmentId") or generate_assessment_id(data["region"])
    sector_name = escape_js(data["sectorName"])

    inp = data["inputParameters"]
    calc = data["calculatedMetrics"]

    recs_js = "[\n" + ",\n".join(
        f'    "{escape_js(r)}"' for r in data["recommendations"]
    ) + "\n  ]"

    js_code = f"""// ─── Auto-generated MongoDB seed document ───────────────────────────
// Collection : db.carryingcapacity
// Region     : {data['region']}
// Generated  : {now_iso}
// ────────────────────────────────────────────────────────────────────

db.carryingcapacity.insertOne({{
  _id: ObjectId('{object_id}'),
  assessmentId: '{assessment_id}',
  sectorName: '{sector_name}',
  inputParameters: {{
    population: {mongo_int(inp['population'])},
    landHectares: {mongo_int(inp['landHectares'])},
    waterSupplyLitersDay: {mongo_int(inp['waterSupplyLitersDay'])},
    housingUnits: {mongo_int(inp['housingUnits'])},
    medicalBeds: {mongo_int(inp['medicalBeds'])}
  }},
  calculatedMetrics: {{
    maxSafeCapacity: {mongo_int(calc['maxSafeCapacity'])},
    availableCapacity: {mongo_int(calc['availableCapacity'])},
    populationSaturationPercent: {mongo_int(calc['populationSaturationPercent'])},
    waterUtilizationPercent: {mongo_int(calc['waterUtilizationPercent'])},
    housingUtilizationPercent: {mongo_int(calc['housingUtilizationPercent'])},
    healthUtilizationPercent: {mongo_int(calc['healthUtilizationPercent'])},
    stressLevel: '{calc['stressLevel']}'
  }},
  recommendations: {recs_js},
  createdAt: {mongo_date(now)},
  updatedAt: {mongo_date(now)},
  __v: {mongo_int(0)}
}});
"""
    return js_code
