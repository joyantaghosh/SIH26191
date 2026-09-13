from datetime import datetime, timezone


def generate_object_id(text: str) -> str:
    import hashlib
    raw_hash = hashlib.md5(text.encode("utf-8")).hexdigest()
    return raw_hash[:24]


def transform_to_route_bson_js(data: dict) -> str:
    route_id = data.get("routeId", "ROUTE-001")
    obj_id = generate_object_id(route_id)
    iso_now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

    orig_lng, orig_lat = data["originCoordinates"]
    dest_lng, dest_lat = data["destinationCoordinates"]

    waypoints_str = ",\n        ".join(
        [
            f"{{ name: '{wp['name']}', coordinates: [Double('{wp['coordinates'][0]}'), Double('{wp['coordinates'][1]}')], status: '{wp['status']}' }}"
            for wp in data["waypoints"]
        ]
    )

    bottlenecks_str = ", ".join([f"'{b}'" for b in data.get("hazardBottlenecks", [])])

    return f"""// ─── Auto-generated MongoDB seed document ───────────────────────────
// Region : {data['region']}
// Collection : db.evacuationroutes
// Generated : {iso_now}
// ────────────────────────────────────────────────────────────────────

db.evacuationroutes.insertOne({{
    _id: ObjectId('{obj_id}'),
    routeId: '{route_id}',
    zoneId: '{data.get('zoneId', 'ZONE-001')}',
    region: '{data['region']}',
    routeName: '{data['routeName']}',
    originCoordinates: {{
        type: "Point",
        coordinates: [Double('{orig_lng}'), Double('{orig_lat}')]
    }},
    destinationCoordinates: {{
        type: "Point",
        coordinates: [Double('{dest_lng}'), Double('{dest_lat}')]
    }},
    waypoints: [
        {waypoints_str}
    ],
    distanceKm: Double('{data['distanceKm']}'),
    estimatedTransitMinutes: NumberInt('{data['estimatedTransitMinutes']}'),
    safetyScore: Double('{data['safetyScore']}'),
    hazardBottlenecks: [{bottlenecks_str}],
    status: '{data['status']}',
    createdAt: ISODate('{iso_now}'),
    updatedAt: ISODate('{iso_now}'),
    __v: NumberInt('0')
}});
"""
