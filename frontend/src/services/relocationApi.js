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
 * Fetch available relocation start points, safe shelters & hazard perimeters
 */
export async function getRelocationOptions({ signal } = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/relocation/options`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch relocation options: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

/**
 * Calculate relocation routes between start and safe destination
 */
export async function calculateRelocation(startLocationId, destinationLocationId, { signal } = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/relocation/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ startLocationId, destinationLocationId }),
    signal,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Failed to calculate relocation route: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

/**
 * Get recent relocation history runs
 */
export async function getRelocationHistory(limit = 10, { signal } = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/relocation/history?limit=${limit}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch relocation history: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

/**
 * Get relocation calculation by ID
 */
export async function getRelocationById(id, { signal } = {}) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/relocation/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch relocation run: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

/**
 * Fetch ranked relocation priorities
 */
export async function fetchRelocationPriorities(params = {}, { signal } = {}) {
  const base = getBaseUrl();
  const queryStr = new URLSearchParams(params).toString();
  const url = `${base}/relocation/priorities${queryStr ? `?${queryStr}` : ''}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch relocation priorities: HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.data || json;
}

export default {
  getRelocationOptions,
  fetchRelocationPriorities,
  calculateRelocation,
  getRelocationHistory,
  getRelocationById,
};

