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

export async function fetchEvacuationOptions({ signal } = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/evacuation/options`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch evacuation options: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

export async function calculateEvacuationPlan(payload, { signal } = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/evacuation/calculate`, {
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
    throw new Error(errorBody.message || `Failed to calculate evacuation plan: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

export async function fetchRecentEvacuationPlans(limit = 10, { signal } = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/evacuation/plans?limit=${limit}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch evacuation plans: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

export default {
  fetchEvacuationOptions,
  calculateEvacuationPlan,
  fetchRecentEvacuationPlans,
};
