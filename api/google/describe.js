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

  const { image, text, mode, brief } = req.body;

  try {
    if (mode === 'ad_rewrite') {
      // Rewrite casual prompt into structured AD prompt
      const moodStr = brief?.moods?.join(', ') || 'professional';
      const styleStr = brief?.style || 'Editorial';

      const systemPrompt = `You are a Senior Art Director. Rewrite this casual image description into a structured photography prompt. Include: camera/lens, lighting setup, composition, color grading, mood. Keep it under 120 words. Brief context: style=${styleStr}, mood=${moodStr}`;

      const result = await model.generateContent([systemPrompt, text]);
      const responseText = result.response.text();

      return res.json({ prompt: responseText });
    } else {
      // Describe uploaded image
      if (!image) {
        return res.status(400).json({ error: 'Image data is required for description' });
      }

      // Strip data URL prefix if present
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

      const result = await model.generateContent([
        "Describe this image in detail for use as an AI image generation reference. Include: subject, composition, lighting, colors, mood, style.",
        { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
      ]);

      return res.json({ description: result.response.text() });
    }
  } catch (err) {
    console.error('Google AI error:', err);
    return res.status(500).json({ error: err.message || 'Google AI request failed' });
  }
}
