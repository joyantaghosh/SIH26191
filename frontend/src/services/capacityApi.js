const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'http://localhost:5000/api/v1');

const getBaseUrl = () => {
  let url = API_BASE_URL.trim().replace(/\/+$/, '');
  if (!url.includes('/api/v1') && !url.includes('/api')) {
    url = `${url}/api/v1`;
  }
  return url;
};

export async function fetchCapacitySectors({ signal } = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/capacity/sectors`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch capacity sectors: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

export async function calculateCarryingCapacity(payload, { signal } = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/capacity/calculate`, {
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
    throw new Error(errorBody.message || `Failed to calculate capacity: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

export async function fetchAssessmentHistory(limit = 10, { signal } = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/capacity/history?limit=${limit}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch capacity history: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

export default {
  fetchCapacitySectors,
  calculateCarryingCapacity,
  fetchAssessmentHistory,
};
