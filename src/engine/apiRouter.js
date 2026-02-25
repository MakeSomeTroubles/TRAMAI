const routes = {
  fal: '/api/fal/',
  google: '/api/google/',
  huggingface: '/api/huggingface/',
};

export async function callBackend(backend, endpoint, payload) {
  const baseRoute = routes[backend];
  if (!baseRoute) {
    throw new Error(`Unknown backend: ${backend}`);
  }

  const response = await fetch(baseRoute + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  return response.json();
}
