import { HfInference } from "@huggingface/inference";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.HF_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'HF_TOKEN not configured. Add it in Vercel environment variables.' });
  }

  const hf = new HfInference(token);
  const { prompt, model } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const image = await hf.textToImage({
      model: model || "black-forest-labs/FLUX.1-dev",
      inputs: prompt,
    });

    const buffer = Buffer.from(await image.arrayBuffer());
    return res.json({ image: `data:image/png;base64,${buffer.toString('base64')}` });
  } catch (err) {
    console.error('HuggingFace generate error:', err);
    return res.status(500).json({ error: err.message || 'HuggingFace generation failed' });
  }
}
