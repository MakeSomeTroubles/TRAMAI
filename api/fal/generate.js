import * as fal from "@fal-ai/serverless-client";

const ASPECT_RATIO_MAP = {
  '1:1': 'square',
  '16:9': 'landscape_16_9',
  '9:16': 'portrait_16_9',
  '4:5': 'portrait_4_3',
  '3:2': 'landscape_4_3',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'FAL_KEY not configured. Add it in Vercel environment variables.' });
  }

  fal.config({ credentials: apiKey });

  const { prompt, aspect_ratio, quality, image } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const input = {
      prompt,
      image_size: ASPECT_RATIO_MAP[aspect_ratio] || 'square',
      num_inference_steps: quality === 'final' ? 28 : 15,
      guidance_scale: 3.5,
    };

    // If a reference image is provided, use img2img
    if (image) {
      input.image_url = image;
      input.strength = 0.75;
    }

    const result = await fal.subscribe("fal-ai/flux-pro/v1.1", { input });

    if (!result?.images?.[0]?.url) {
      return res.status(500).json({ error: 'No image returned from Fal.ai' });
    }

    return res.json({ image: result.images[0].url });
  } catch (err) {
    console.error('Fal.ai generate error:', err);
    return res.status(500).json({ error: err.message || 'Fal.ai generation failed' });
  }
}
