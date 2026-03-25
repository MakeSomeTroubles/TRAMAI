# TRAMAI — BACKLOG

> Knowledge file per il progetto Claude TRAMAI.
> Qui vanno TUTTI i bug e le feature trovati fuori scope durante le Day Cards.
> Questo file viene consultato quando si pianificano nuove Day Cards.

---

## COME USARE QUESTO FILE

- Ogni item ha un ID univoco: `BUG-001`, `FEAT-001`, `TECH-001`
- BUG = bug trovato durante sviluppo
- FEAT = feature idea emersa durante sviluppo
- TECH = debito tecnico o refactoring necessario
- Priorità: P0 (bloccante, prossima card), P1 (importante), P2 (nice to have)
- Stato: OPEN / SCHEDULED (assegnato a una Day Card) / DONE

---

## BUGS

### BUG-001 — Canvas vuoto all'avvio, nessun nodo di default
- **Trovato durante:** Day Card #1
- **Priorità:** P2
- **Stato:** OPEN
- **Descrizione:** All'avvio TRAMAI mostra un canvas completamente vuoto. Il file `docs/DEFAULT_LAYOUT.ts` contiene layout pre-definiti (Hero Pipeline, Full Pipeline) ma non sono integrati nel codice. L'utente deve draggare manualmente ogni nodo.
- **Come riprodurre:** Aprire localhost:5173 senza workflow salvato in localStorage
- **File coinvolto:** `src/store/workflowStore.js`, `docs/DEFAULT_LAYOUT.ts`
- **Schedulato:** non ancora

### BUG-002 — Dot grid background fisso (non si muove con pan/zoom)
- **Trovato durante:** Day Card #1
- **Priorità:** P2
- **Stato:** OPEN
- **Descrizione:** Il dot grid è implementato come CSS `background-image` sul container `.react-flow`. Non si muove con pan/zoom del canvas. L'alternativa standard è il componente `<Background>` di React Flow che tracka il viewport.
- **Come riprodurre:** Pan/zoom sul canvas e osservare che i dots restano fermi
- **File coinvolto:** `src/index.css` (righe 67-71)
- **Schedulato:** non ancora

### BUG-003 — Generazione immagini non funziona senza proxy API
- **Trovato durante:** Day Card #1
- **Priorità:** P1
- **Stato:** OPEN
- **Descrizione:** Il backend proxy Express (`npm run dev:api`) richiede un file `.env` con API keys (Fal.ai, Google, HuggingFace). Senza proxy attivo, il pulsante Generate fallisce con errore di rete. Non esiste un file `.env.example` che documenti le variabili necessarie.
- **Come riprodurre:** Click su Generate senza `npm run dev:api` attivo
- **File coinvolto:** `dev-server.js`, `api/fal/generate.js`, `api/google/generate.js`, `api/huggingface/generate.js`
- **Schedulato:** non ancora

---

## FEATURES

```
[nessuna feature registrata ancora]
```

---

## TECH DEBT

### TECH-001 — Discrepanza React 19 vs documentazione React 18
- **Trovato durante:** Day Card #1
- **Priorità:** P1
- **Stato:** OPEN
- **Descrizione:** `package.json` installa React 19 (`^19.2.0`) ma `CLAUDE.md` e project instructions dichiarano React 18. La build funziona, ma la documentazione è disallineata dal codice.
- **Rischio se ignorato:** Confusione su quale versione è target, possibili breaking changes non documentati
- **Schedulato:** non ancora

### TECH-002 — File orfani da estensione Chrome nella root
- **Trovato durante:** Day Card #1
- **Priorità:** P2
- **Stato:** OPEN
- **Descrizione:** Nella root esistono file che non c'entrano con TRAMAI: `content.css`, `content.js`, `popup.html`, `popup.js`, `manifest.json`, `icon16.png`, `icon48.png`, `icon128.png`. Sembrano residui del progetto LuminaRetouch (estensione Chrome).
- **Rischio se ignorato:** Confusione nel repo, file inutili nella build/deploy
- **Schedulato:** non ancora

### TECH-003 — utils/storage.js duplica logica del workflowStore
- **Trovato durante:** Day Card #1
- **Priorità:** P2
- **Stato:** OPEN
- **Descrizione:** `src/utils/storage.js` contiene funzioni `saveToLocalStorage`, `loadFromLocalStorage`, `exportToJsonFile`, `importFromJsonFile` che duplicano la logica già presente in `workflowStore.js` (`saveWorkflow`, `loadWorkflow`, `exportWorkflow`, `importWorkflow`). Il file utils non è importato da nessuno.
- **Rischio se ignorato:** Codice morto, confusione su quale funzione usare
- **Schedulato:** non ancora
