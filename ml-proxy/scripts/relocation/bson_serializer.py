from datetime import datetime, timezone


def generate_object_id(text: str) -> str:
    import hashlib
    raw_hash = hashlib.md5(text.encode("utf-8")).hexdigest()
    return raw_hash[:24]


def transform_to_relocation_bson_js(data: dict) -> str:
    relocation_id = data.get("relocationId", "REL-001")
    obj_id = generate_object_id(relocation_id)
    iso_now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

    return f"""// ─── Auto-generated MongoDB seed document ───────────────────────────
// Region : {data['region']}
// Collection : db.relocationpriorities
// Generated : {iso_now}
// ────────────────────────────────────────────────────────────────────

db.relocationpriorities.insertOne({{
    _id: ObjectId('{obj_id}'),
    relocationId: '{relocation_id}',
    zoneId: '{data.get('zoneId', 'ZONE-001')}',
    region: '{data['region']}',
    habitationName: '{data['habitationName']}',
    vulnerablePopulation: NumberInt('{data['vulnerablePopulation']}'),
    priorityRank: NumberInt('{data['priorityRank']}'),
    priorityTier: '{data['priorityTier']}',
    priorityScore: Double('{data['priorityScore']}'),
    mobilityConstrainedCount: NumberInt('{data['mobilityConstrainedCount']}'),
    destinationRefugeSector: '{data['destinationRefugeSector']}',
    allocatedShelterBeds: NumberInt('{data['allocatedShelterBeds']}'),
    status: '{data.get('status', 'PENDING_EVACUATION')}',
    createdAt: ISODate('{iso_now}'),
    updatedAt: ISODate('{iso_now}'),
    __v: NumberInt('0')
}});
"""
