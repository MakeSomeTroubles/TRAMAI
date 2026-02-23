const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function processImage(mode, imageData, params = {}) {
  return request('/process', {
    method: 'POST',
    body: JSON.stringify({ mode, image: imageData, params }),
  });
}

export async function getStatus(jobId) {
  return request(`/status/${jobId}`);
}

export async function getResult(jobId) {
  return request(`/result/${jobId}`);
}
