import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
dotenv.config({ path: resolve(__dirname, '.env.local') });

const app = express();
app.use(express.json({ limit: '10mb' }));

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n  API proxy running at http://localhost:${PORT}`);
  console.log(`  Routes:`);
  routes.forEach(([path]) => console.log(`    POST ${path}`));
  console.log(`\n  Keys loaded: FAL_KEY=${process.env.FAL_KEY ? '✓' : '✗'}  GOOGLE_AI_KEY=${process.env.GOOGLE_AI_KEY ? '✓' : '✗'}  HF_TOKEN=${process.env.HF_TOKEN ? '✓' : '✗'}\n`);
});
