# Vercel Serverless Fix Log

**Data:** 2026-03-25

## Problema

Il backend Express non funziona su Vercel. I file in `/api/` devono essere Vercel Serverless Functions con signature `export default async function handler(req, res)`.

## Analisi

Controllati tutti i file API:

| File | Stato | Azione |
|------|-------|--------|
| `api/huggingface/generate.js` | Già in formato Vercel (`export default async function handler`) | Nessuna modifica |
| `api/fal/generate.js` | Già in formato Vercel (`export default async function handler`) | Nessuna modifica |
| `api/google/generate.js` | Già in formato Vercel (`export default async function handler`) | Nessuna modifica |
| `api/google/describe.js` | Già in formato Vercel (`export default async function handler`) | Nessuna modifica |

Nessun file usava Express router. Tutti erano già nel formato corretto.

## vercel.json

Aggiornato (sessione precedente) da configurazione con `builds` + `routes` a:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Rimossi `version`, `builds`, e `routes` — Vercel rileva automaticamente le serverless functions nella directory `api/` e il frontend statico in `dist/`.

## Build

`npm run build` passata clean. Nessun errore.

## Note

- Le serverless functions in `api/` vengono rilevate automaticamente da Vercel senza bisogno di configurazione in `vercel.json`
- Il rewrite `/(.*) → /index.html` serve per il client-side routing di React (SPA fallback)
- Le route `/api/*` hanno priorità automatica sui rewrites in Vercel
