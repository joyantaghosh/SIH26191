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

export async function fetchSettlements(params = {}, { signal } = {}) {
  const base = getBaseUrl();
  const queryStr = new URLSearchParams(params).toString();
  const url = `${base}/settlements${queryStr ? `?${queryStr}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch settlements: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

export async function fetchSettlementStats({ signal } = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/settlements/stats/summary`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch settlement statistics: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

export async function fetchSettlementById(id, { signal } = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/settlements/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch settlement details: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

export default {
  fetchSettlements,
  fetchSettlementStats,
  fetchSettlementById,
};
