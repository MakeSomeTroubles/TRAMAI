const routes = {
  fal: '/api/fal/',
  google: '/api/google/',
  huggingface: '/api/huggingface/',
};

/**
 * Parse an error response into a user-friendly message.
 */
function parseErrorResponse(status, text) {
  let json;
  try { json = JSON.parse(text); } catch { json = null; }

  const serverMsg = json?.error || text || 'Unknown error';
  const code = json?.code || '';

  // Map known error codes to user-friendly messages
  if (code === 'NO_API_KEY' || status === 401) {
    return 'No API key — set the key in .env.local and restart dev:api';
  }
  if (code === 'NO_CREDITS' || status === 402) {
    return 'No API credits — add credits at fal.ai/dashboard';
  }
  if (code === 'AUTH_ERROR' || status === 403) {
    return 'Invalid API key — check your key in .env.local';
  }
  if (code === 'RATE_LIMITED' || status === 429) {
    return 'Rate limited — wait a minute and try again';
  }
  if (status === 0 || serverMsg.includes('Failed to fetch') || serverMsg.includes('NetworkError')) {
    return 'Cannot reach API server — is "npm run dev:api" running on port 3001?';
  }

  return `API error (${status}): ${serverMsg}`;
}

export async function callBackend(backend, endpoint, payload) {
  const baseRoute = routes[backend];
  if (!baseRoute) {
    throw new Error(`Unknown backend: ${backend}`);
  }

  const url = baseRoute + endpoint;
  console.log(`[apiRouter] POST ${url}`, { backend, endpoint });

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (networkErr) {
    // fetch itself failed — server not reachable
    throw new Error('Cannot reach API server — is "npm run dev:api" running on port 3001?');
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    const userMsg = parseErrorResponse(response.status, errorText);
    console.error(`[apiRouter] Error from ${url}:`, response.status, errorText);
    throw new Error(userMsg);
  }

  const data = await response.json();
  console.log(`[apiRouter] Success from ${url}`);
  return data;
}
