# BACKEND_LOG.md — API Pipeline Fix

**Date:** 2026-03-23
**Scope:** Fix the Brief -> Prompt -> Generate pipeline (500 error on Fal.ai)

---

## What Was Broken

### 1. Fal.ai handler used deprecated library with wrong parameters
- `api/fal/generate.js` imported `@fal-ai/serverless-client` (deprecated, replaced by `@fal-ai/client`)
- The library is CommonJS in an ESM project, causing interop issues at runtime
- The `image_size` mapping used wrong values (e.g., `'square'` instead of `'square_hd'`)
- The model `fal-ai/flux-pro/v1.1` requires a paid plan; most users will hit a 500

### 2. HuggingFace handler required token but none was set
- `api/huggingface/generate.js` required `HF_TOKEN` but `.env.local` had it empty
- The default model `black-forest-labs/FLUX.1-dev` is gated and needs approved access
- No fallback to a free public model

### 3. No CORS on dev server
- `dev-server.js` had no CORS headers, causing potential cross-origin issues

### 4. Error messages referenced Vercel instead of local dev setup
- All handlers said "Add it in Vercel environment variables" instead of ".env.local"

### 5. No request logging on dev server
- Hard to debug API issues without seeing request/response in the terminal

---

## What Was Fixed

### `api/fal/generate.js` — Complete rewrite
- **Removed** dependency on `@fal-ai/serverless-client` library
- Uses direct `fetch` calls to Fal.ai Queue REST API (`https://queue.fal.run`)
- Auth via `Authorization: Key <FAL_KEY>` header
- Flow: submit to queue -> poll status -> fetch result
- Correct `image_size` values: `square_hd`, `landscape_16_9`, `portrait_16_9`, etc.
- **Model fallback chain**: tries `fal-ai/flux/dev` first (free tier), then `fal-ai/flux-pro/v1.1` (paid)
- Proper error handling: auth errors, credit errors, model not found
- Full console logging for debugging

### `api/huggingface/generate.js` — Complete rewrite
- Uses direct `fetch` to HuggingFace Inference API (no library dependency)
- **Token is now optional** — free public models work without it
- **Model fallback chain**: tries `stabilityai/stable-diffusion-xl-base-1.0` (free, always available) first
- Handles model loading state (503 + retry)
- Handles rate limiting (429) with clear message
- Handles gated model auth errors by falling back to next model

### `dev-server.js` — Enhanced
- Added CORS headers for localhost origins
- Added request/response logging middleware with timestamps and duration
- Added `/api/health` endpoint to check which keys are loaded
- Loads both `.env.local` and `.env` (fallback)
- Startup message shows partial key values for verification

### `src/engine/apiRouter.js` — Better error handling
- Catches `fetch` network errors (server not running) with clear message
- Parses error codes from server responses
- Maps error codes to user-friendly messages:
  - `NO_API_KEY` -> "set the key in .env.local"
  - `NO_CREDITS` -> "add credits at fal.ai/dashboard"
  - `AUTH_ERROR` -> "check your key in .env.local"
  - `RATE_LIMITED` -> "wait a minute and try again"
  - Network error -> "is npm run dev:api running?"
- Console logging for debugging

### `api/google/describe.js` + `api/google/generate.js`
- Fixed error messages to reference `.env.local` instead of Vercel
- Returns proper HTTP 401 with `NO_API_KEY` error code

### `.env.example` — Created
- Template with all required/optional keys
- Comments explain where to get each key

---

## Files Modified

| File | Change |
|------|--------|
| `api/fal/generate.js` | Full rewrite — direct REST API, model fallback |
| `api/huggingface/generate.js` | Full rewrite — free fallback, optional token |
| `dev-server.js` | CORS, logging, health endpoint |
| `src/engine/apiRouter.js` | Error parsing, user-friendly messages |
| `api/google/describe.js` | Fixed error message |
| `api/google/generate.js` | Fixed error message |
| `.env.example` | New file — key template |

---

## Files NOT Touched (as required)

- No UI/CSS files modified
- No visual appearance changes to any node components
- `index.css`, `tailwind.config.js`, `nodes.css`, `Sidebar.jsx`, `TopBar.jsx`, `NodeShell.jsx` — untouched

---

## API Keys Setup

Copy `.env.example` to `.env.local` and fill in:

### Required for Fal.ai (paid, but has free tier)
```
FAL_KEY=<key_id>:<key_secret>
```
Get at: https://fal.ai/dashboard/keys

### Required for AD Assist (Google Gemini)
```
GOOGLE_AI_KEY=<your-key>
```
Get at: https://aistudio.google.com/apikey

### Optional — HuggingFace (free fallback)
```
HF_TOKEN=<your-token>
```
Get at: https://huggingface.co/settings/tokens
Note: SDXL works without a token. Token gives higher rate limits.

---

## How to Test the Pipeline

### 1. Start both servers
```bash
# Terminal 1: Vite dev server (frontend)
npm run dev

# Terminal 2: API proxy server (backend)
npm run dev:api
```

### 2. Check API server is running
Visit http://localhost:3001/api/health — should show which keys are loaded.

### 3. Test the pipeline in the browser
1. Open http://localhost:5173
2. Add a **Text Prompt** node and a **Generate** node
3. Connect Text Prompt output -> Generate input (prompt handle)
4. Type a prompt (e.g., "A golden retriever in a field of sunflowers")
5. In Generate node, select the backend:
   - **Fal.ai**: Requires FAL_KEY in .env.local
   - **HuggingFace**: Works without token (uses free SDXL model)
6. Click **Generate**
7. Image should appear in the Generate node

### 4. If you get errors
- "Cannot reach API server" -> make sure `npm run dev:api` is running
- "No API key" -> check `.env.local` has the right key
- "No API credits" -> add credits at fal.ai/dashboard
- "Rate limited" -> wait 60 seconds (HuggingFace free tier)

---

## Architecture Summary

```
Browser (localhost:5173)
  |
  | POST /api/fal/generate  (or /huggingface/generate)
  |
  v
Vite Dev Server (proxy config in vite.config.js)
  |
  | proxies /api/* to localhost:3001
  |
  v
Express Dev Server (dev-server.js, localhost:3001)
  |
  | routes to handler in api/ directory
  |
  v
api/fal/generate.js  ---fetch--->  Fal.ai REST API (queue.fal.run)
api/huggingface/generate.js  ---fetch--->  HuggingFace Inference API
api/google/describe.js  ---SDK--->  Google Gemini API
```
