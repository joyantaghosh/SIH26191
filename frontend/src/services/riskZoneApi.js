const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'https://safezones-backend.onrender.com/api/v1');


// Helper to normalize base URL ensuring it includes /api/v1 if root host provided
const getBaseUrl = () => {
  let url = API_BASE_URL.trim().replace(/\/+$/, '');
  if (!url.includes('/api/v1') && !url.includes('/api')) {
    url = `${url}/api/v1`;
  }
  return url;
};

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Normalizes a raw risk zone object from MongoDB / Express backend
 */
export function normalizeZone(zone, index = 0) {
  if (!zone) return null;

  const coords = zone.center?.coordinates || [];
  // GeoJSON coordinates are [longitude, latitude]
  const lng = zone.lng ?? zone.longitude ?? zone.lon ?? (coords.length >= 2 ? coords[0] : 106.8);
  const lat = zone.lat ?? zone.latitude ?? (coords.length >= 2 ? coords[1] : -6.2);
  const radius = toNumber(zone.radiusMeters ?? zone.radius, 800);
  const riskLevel = String(zone.riskLevel ?? zone.level ?? 'warning').toLowerCase();

  // Determine color based on riskLevel
  let color = '#7A9A6E'; // default green/safe
  if (riskLevel === 'critical' || riskLevel === 'high') {
    color = '#EF4444'; // Red
  } else if (riskLevel === 'warning' || riskLevel === 'medium' || riskLevel === 'med') {
    color = '#F59E0B'; // Amber/Gold
  } else if (riskLevel === 'safe' || riskLevel === 'low') {
    color = '#10B981'; // Green
  }

  // Format DMS coordinate string if not provided
  let coordinateLabel = zone.coordinateLabel;
  if (!coordinateLabel && lat != null && lng != null) {
    const latAbs = Math.abs(lat);
    const lngAbs = Math.abs(lng);
    const latDeg = Math.floor(latAbs);
    const latMin = Math.round((latAbs - latDeg) * 60);
    const lngDeg = Math.floor(lngAbs);
    const lngMin = Math.round((lngAbs - lngDeg) * 60);
    coordinateLabel = `${latDeg}°${String(latMin).padStart(2, '0')}'${lat >= 0 ? 'N' : 'S'} ${lngDeg}°${String(lngMin).padStart(2, '0')}'${lng >= 0 ? 'E' : 'W'}`;
  }

  return {
    id: zone._id ?? zone.id ?? zone.zoneId ?? `zone-${index}`,
    _id: zone._id ?? zone.id,
    zoneId: zone.zoneId ?? `ZONE-${String(index + 1).padStart(2, '0')}`,
    name: zone.name ?? zone.zoneName ?? `Risk Zone ${index + 1}`,
    region: zone.region ?? 'Unassigned Region',
    description: zone.description ?? 'Geospatial telemetry and terrain slope risk assessment sector.',
    hazardType: zone.hazardType ?? 'landslide',
    riskLevel,
    color,
    latitude: toNumber(lat),
    longitude: toNumber(lng),
    latLng: [toNumber(lat), toNumber(lng)],
    radius: toNumber(radius, 800),
    radiusMeters: toNumber(radius, 800),
    vulnerabilityScore: toNumber(zone.vulnerabilityScore, 50),
    severityIndex: toNumber(zone.severityIndex, 5),
    metrics: {
      severity: toNumber(zone.metrics?.severity, 50),
      density: toNumber(zone.metrics?.density, 50),
      soilRisk: toNumber(zone.metrics?.soilRisk, 50),
    },
    population: toNumber(zone.population, 0),
    households: toNumber(zone.households, 0),
    distanceToHazardKm: toNumber(zone.distanceToHazardKm, 0),
    isRiskZone: riskLevel === 'critical' || riskLevel === 'warning' || riskLevel === 'high',
    coordinateLabel: coordinateLabel || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    lastTelemetryAt: zone.lastTelemetryAt || new Date().toISOString(),
    raw: zone,
  };
}

/**
 * Fetch all risk zones from backend API
 */
export async function getRiskZones(params = {}, { signal } = {}) {
  const base = getBaseUrl();
  const queryStr = new URLSearchParams(params).toString();
  const url = `${base}/risk-zones${queryStr ? `?${queryStr}` : ''}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch risk zones: HTTP ${res.status}`);
    }

    const json = await res.json();
    const list = Array.isArray(json) ? json : json?.data ?? [];
    return list.map((zone, idx) => normalizeZone(zone, idx)).filter(Boolean);
  } catch (err) {
    console.error('[riskZoneApi] getRiskZones error:', err);
    throw err;
  }
}

/**
 * Fetch single risk zone by MongoDB ID or Zone ID (e.g. OKH-01)
 */
export async function getRiskZoneById(identifier, { signal } = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/risk-zones/${encodeURIComponent(identifier)}`, {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch risk zone "${identifier}": HTTP ${res.status}`);
  }

  const json = await res.json();
  return normalizeZone(json.data || json);
}

/**
 * Fetch GeoJSON FeatureCollection of risk zones
 */
export async function getRiskZonesGeoJSON(params = {}, { signal } = {}) {
  const base = getBaseUrl();
  const queryStr = new URLSearchParams(params).toString();
  const res = await fetch(`${base}/risk-zones/geojson${queryStr ? `?${queryStr}` : ''}`, {
    headers: { Accept: 'application/geo+json, application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch GeoJSON: HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch aggregated statistics summary
 */
export async function getRiskSummary({ signal } = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/risk-zones/stats/summary`, {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch risk summary: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

export default {
  getRiskZones,
  getRiskZoneById,
  getRiskZonesGeoJSON,
  getRiskSummary,
  normalizeZone,
};