# TRAMAI — Personal AI Production Desk

Node-based AI image generation and editing tool built for art directors.

## Stack

- React 18 + Vite
- React Flow (`@xyflow/react`) — node canvas
- Tailwind CSS — styling
- Zustand — state management
- Lucide React — icons

## AI Backends

- **Fal.ai** — Flux Pro generation, upscaling, inpainting, face swap
- **Google AI Studio** — Gemini vision (image description, AD Assist prompt rewriting)
- **HuggingFace** — Flux Dev, SDXL via Inference API

## Getting Started

```bash
npm install
npm run dev
```

Set API keys in `.env.local`:
```
FAL_KEY=your_fal_api_key
GOOGLE_AI_KEY=your_google_ai_studio_key
HF_TOKEN=your_huggingface_token
```

## Deployment

Deploy to Vercel — set environment variables in the Vercel dashboard.
