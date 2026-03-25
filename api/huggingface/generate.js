/**
 * HuggingFace Inference API image generation handler.
 * Requires a free HF_TOKEN (get one at huggingface.co/settings/tokens).
 * Uses SDXL which is free with a token — no paid plan needed.
 */

const HF_MODELS = [
  'black-forest-labs/FLUX.1-schnell',
  'stabilityai/stable-diffusion-3.5-large',
];

const HF_API_BASE = 'https://router.huggingface.co/hf-inference/models';

export default async function handler(req, res) {
  console.log('[HF DEBUG] request body:', JSON.stringify(req.body));

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, model } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const token = process.env.HF_TOKEN || '';

  if (!token) {
    return res.status(401).json({
      error: 'HuggingFace requires a free token. Get one at huggingface.co/settings/tokens and add HF_TOKEN to .env.local',
      code: 'NO_API_KEY',
    });
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const modelsToTry = model ? [model] : HF_MODELS;
  let lastError = null;

  for (const modelId of modelsToTry) {
    try {
      console.log(`[hf] Trying model: ${modelId}`);
      const url = `${HF_API_BASE}/${modelId}`;

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ inputs: prompt }),
      });

      // Model loading — wait and retry
      if (response.status === 503) {
        const info = await response.json().catch(() => ({}));
        const waitTime = info.estimated_time || 20;
        console.log(`[hf] Model ${modelId} is loading, wait ${waitTime}s...`);

        await new Promise((r) => setTimeout(r, Math.min(waitTime * 1000, 30000)));
        const retryResp = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ inputs: prompt }),
        });

        if (!retryResp.ok) {
          const errText = await retryResp.text().catch(() => '');
          throw new Error(`Model still loading: ${errText}`);
        }

        const imageBlob = await retryResp.arrayBuffer();
        const buffer = Buffer.from(imageBlob);
        console.log(`[hf] Success with ${modelId} (retry), ${buffer.length} bytes`);
        return res.json({
          image: `data:image/png;base64,${buffer.toString('base64')}`,
          model: modelId,
        });
      }

      // Rate limit
      if (response.status === 429) {
        return res.status(429).json({
          error: 'HuggingFace rate limit. Wait a minute and try again.',
          code: 'RATE_LIMITED',
        });
      }

      // Auth / gated model — try next
      if (response.status === 401 || response.status === 403) {
        console.warn(`[hf] Auth error on ${modelId}, trying next...`);
        lastError = new Error(`Auth required for ${modelId}`);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(errText || `HTTP ${response.status}`);
      }

      // Success — raw image bytes
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await response.json();
        if (json.error) throw new Error(json.error);
        throw new Error('Unexpected JSON response');
      }

      const imageBlob = await response.arrayBuffer();
      const buffer = Buffer.from(imageBlob);
      console.log(`[hf] Success with ${modelId}, ${buffer.length} bytes`);

      return res.json({
        image: `data:image/png;base64,${buffer.toString('base64')}`,
        model: modelId,
      });
    } catch (err) {
      console.warn(`[hf] ${modelId} failed:`, err.message);
      lastError = err;
      continue;
    }
  }

  console.error('[hf] All models failed:', lastError?.message);
  return res.status(500).json({
    error: lastError?.message || 'HuggingFace generation failed',
    code: 'GENERATION_FAILED',
  });
}
