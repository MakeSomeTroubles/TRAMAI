import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local (primary) and .env (fallback)
dotenv.config({ path: resolve(__dirname, '.env.local') });
dotenv.config({ path: resolve(__dirname, '.env') });

const app = express();
app.use(express.json({ limit: '10mb' }));

// CORS — allow Vite dev server (port 5173) and any localhost origin
app.use((req, res, next) => {
  const origin = req.headers.origin || '';
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Log response on finish
  const origEnd = res.end;
  res.end = function (...args) {
    const elapsed = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} -> ${res.statusCode} (${elapsed}ms)`);
    origEnd.apply(this, args);
  };

  next();
});

// Dynamically import and mount each API handler
const routes = [
  ['/api/fal/generate',       './api/fal/generate.js'],
  ['/api/google/describe',    './api/google/describe.js'],
  ['/api/google/generate',    './api/google/generate.js'],
  ['/api/huggingface/generate', './api/huggingface/generate.js'],
];

for (const [path, file] of routes) {
  const mod = await import(file);
  const handler = mod.default;
  app.all(path, async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error(`[${path}] Unhandled error:`, err);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message || 'Internal server error' });
      }
    }
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    keys: {
      FAL_KEY: !!process.env.FAL_KEY,
      GOOGLE_AI_KEY: !!process.env.GOOGLE_AI_KEY,
      HF_TOKEN: !!process.env.HF_TOKEN,
    },
  });
});

const PORT = process.env.API_PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`\n  API proxy running at http://localhost:${PORT}`);
  console.log(`  Routes:`);
  routes.forEach(([path]) => console.log(`    POST ${path}`));
  console.log(`    GET  /api/health`);
  console.log(`\n  Keys loaded:`);
  console.log(`    FAL_KEY       = ${process.env.FAL_KEY ? 'YES (' + process.env.FAL_KEY.substring(0, 8) + '...)' : 'NOT SET'}`);
  console.log(`    GOOGLE_AI_KEY = ${process.env.GOOGLE_AI_KEY ? 'YES (' + process.env.GOOGLE_AI_KEY.substring(0, 8) + '...)' : 'NOT SET'}`);
  console.log(`    HF_TOKEN      = ${process.env.HF_TOKEN ? 'YES (' + process.env.HF_TOKEN.substring(0, 8) + '...)' : 'NOT SET'}`);
  console.log('');
});

// Keep process alive
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  server.close();
  process.exit(0);
});
