/**
 * Fal.ai image generation handler.
 * Uses direct REST API calls instead of the deprecated @fal-ai/serverless-client.
 *
 * Flow: submit to queue → poll status → fetch result
 * Docs: https://fal.ai/docs/model-endpoints/queue
 */

const FAL_QUEUE_URL = 'https://queue.fal.run';

// Fal.ai uses specific image_size strings
const ASPECT_RATIO_MAP = {
  '1:1': 'square_hd',
  '16:9': 'landscape_16_9',
  '9:16': 'portrait_16_9',
  '4:5': 'portrait_4_3',
  '3:2': 'landscape_4_3',
};

// Models to try in order (fallback chain)
const MODELS = [
  'fal-ai/flux/dev',          // Free tier / dev-friendly
  'fal-ai/flux-pro/v1.1',    // Pro (requires paid plan)
];

async function falFetch(url, apiKey, options = {}) {
  const resp = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Key ${apiKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await resp.text();
  let json;
  try { json = JSON.parse(body); } catch { json = null; }

  if (!resp.ok) {
    const msg = json?.detail || json?.message || body || `HTTP ${resp.status}`;
    const err = new Error(msg);
    err.status = resp.status;
    err.body = json || body;
    throw err;
  }
  return json;
}

async function generateWithModel(model, apiKey, input) {
  // Step 1: Submit to queue
  console.log(`[fal] Submitting to ${model}...`);
  const submitUrl = `${FAL_QUEUE_URL}/${model}`;
  const submission = await falFetch(submitUrl, apiKey, {
    method: 'POST',
    body: JSON.stringify(input),
  });

  const requestId = submission.request_id;
  if (!requestId) {
    throw new Error('No request_id returned from Fal.ai queue submission');
  }
  console.log(`[fal] Queued: request_id=${requestId}`);

  // Step 2: Poll for completion
  const statusUrl = `${FAL_QUEUE_URL}/${model}/requests/${requestId}/status`;
  const maxAttempts = 120; // 2 minutes at 1s intervals
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const status = await falFetch(statusUrl, apiKey, { method: 'GET' });
    console.log(`[fal] Poll ${i + 1}: status=${status.status}`);

    if (status.status === 'COMPLETED') {
      break;
    }
    if (status.status === 'FAILED') {
      throw new Error(`Fal.ai generation failed: ${status.error || 'unknown error'}`);
    }
    // IN_QUEUE or IN_PROGRESS — keep polling
  }

  // Step 3: Fetch result
  const resultUrl = `${FAL_QUEUE_URL}/${model}/requests/${requestId}`;
  const result = await falFetch(resultUrl, apiKey, { method: 'GET' });
  console.log(`[fal] Result received, images: ${result?.images?.length || 0}`);
  return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    return res.status(401).json({
      error: 'No API key — set FAL_KEY in .env.local',
      code: 'NO_API_KEY',
    });
  }

  const { prompt, aspect_ratio, quality, image } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const input = {
    prompt,
    image_size: ASPECT_RATIO_MAP[aspect_ratio] || 'square_hd',
    num_inference_steps: quality === 'final' ? 28 : 4,
    guidance_scale: 3.5,
  };

  // If a reference image is provided, use img2img
  if (image) {
    input.image_url = image;
    input.strength = 0.75;
  }

  // Try models in order (fallback chain)
  let lastError = null;
  for (const model of MODELS) {
    try {
      const result = await generateWithModel(model, apiKey, input);

      if (!result?.images?.[0]?.url) {
        console.warn(`[fal] ${model} returned no images, trying next...`);
        continue;
      }

      console.log(`[fal] Success with ${model}`);
      return res.json({ image: result.images[0].url, model });
    } catch (err) {
      console.warn(`[fal] ${model} failed:`, err.message);
      lastError = err;

      // If it's an auth error, no point trying other models
      if (err.status === 401 || err.status === 403) {
        return res.status(err.status).json({
          error: 'Invalid API key or no access. Check your FAL_KEY in .env.local',
          code: 'AUTH_ERROR',
        });
      }

      // If it's a payment/credits error
      if (err.status === 402 || (err.message && err.message.toLowerCase().includes('credit'))) {
        return res.status(402).json({
          error: 'No API credits — add credits at fal.ai/dashboard',
          code: 'NO_CREDITS',
        });
      }

      // Model not found or other error — try next model
      continue;
    }
  }

  // All models failed
  console.error('[fal] All models failed. Last error:', lastError?.message);
  return res.status(500).json({
    error: lastError?.message || 'All Fal.ai models failed',
    code: 'GENERATION_FAILED',
  });
}
