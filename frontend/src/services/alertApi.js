const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'https://safezones-backend.onrender.com/api/v1');


const getBaseUrl = () => {
  let url = API_BASE_URL.trim().replace(/\/+$/, '');
  if (!url.includes('/api/v1') && !url.includes('/api')) {
    url = `${url}/api/v1`;
  }
  return url;
};

/**
 * Fetch list of weather and hazard alerts from backend MongoDB
 */
export async function fetchAlerts(params = {}, { signal } = {}) {
  const base = getBaseUrl();
  const queryStr = new URLSearchParams(params).toString();
  const url = `${base}/alerts${queryStr ? `?${queryStr}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch alerts: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

/**
 * Fetch live weather telemetry & calculated hazard confidence score
 */
export async function fetchLiveTelemetry(lat = -6.2, lng = 106.8, { signal } = {}) {
  const base = getBaseUrl();
  const url = `${base}/alerts/telemetry?lat=${lat}&lng=${lng}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch live telemetry: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

/**
 * Trigger an on-demand real-time weather scan and threshold evaluation
 */
export async function triggerWeatherScan(payload = {}, { signal } = {}) {
  const base = getBaseUrl();
  const url = `${base}/alerts/scan`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Failed to execute weather scan: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

/**
 * Dismiss or resolve an active alert
 */
export async function dismissAlert(id, { signal } = {}) {
  const base = getBaseUrl();
  const url = `${base}/alerts/${encodeURIComponent(id)}/dismiss`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to dismiss alert: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

/**
 * Fetch single alert details by ID
 */
export async function fetchAlertById(id, { signal } = {}) {
  const base = getBaseUrl();
  const url = `${base}/alerts/${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch alert details: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

export default {
  fetchAlerts,
  fetchLiveTelemetry,
  triggerWeatherScan,
  dismissAlert,
  fetchAlertById,
};
