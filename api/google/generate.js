import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GOOGLE_AI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GOOGLE_AI_KEY not configured. Add it in Vercel environment variables.' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;

    // Check if the response contains an image
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          const b64 = part.inlineData.data;
          const mime = part.inlineData.mimeType || 'image/png';
          return res.json({ image: `data:${mime};base64,${b64}` });
        }
      }
    }

    // Fallback: return text response if no image
    return res.status(500).json({
      error: 'Google AI did not return an image. This model may not support image generation with your current plan.',
    });
  } catch (err) {
    console.error('Google AI generate error:', err);
    return res.status(500).json({ error: err.message || 'Google AI generation failed' });
  }
}
