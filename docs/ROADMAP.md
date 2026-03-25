# TRAMAI — ROADMAP (Day Cards)

> Knowledge file per il progetto Claude TRAMAI.
> Aggiornare questo file alla chiusura di ogni Day Card.
> Le card sono in ordine di esecuzione. Non saltare senza motivo documentato.

---

## LEGENDA

- 🔒 LOCKED — completata e intoccabile
- ✅ APPROVED — completata, in attesa di lock
- 🔄 IN PROGRESS — card attiva oggi
- ⏳ QUEUED — prossima in lista
- 📋 PLANNED — pianificata ma non ancora dettagliata
- ❌ BLOCKED — richiede risoluzione prima di procedere
- ⏭️ SKIPPED — saltata con motivazione

---

## PHASE 1 — QA COMPLETION & FOUNDATION

### Day Card #1 — Audit dello stato attuale ⏳
**Scope:**
- Fare inventory completo di cosa funziona e cosa no nella build corrente
- Documentare ogni node: funziona? parziale? rotto?
- Documentare il flow Brief → Prompt → Generate: ogni step funziona?
- Verificare che `npm run build` passi clean

**Acceptance Criteria:**
- ✓ Lista completa dei 12 nodes con stato (working/partial/broken)
- ✓ Pipeline Brief → Prompt → Generate testata end-to-end
- ✓ Lista di tutti i bug/issue trovati
- ✓ Build passa clean

**Out of Scope:**
- Fixare qualsiasi bug trovato (vanno nel backlog)
- Toccare il codice
- Aggiungere feature

**File coinvolti:** tutti i file in src/ — READ ONLY

---

### Day Card #2 — Fix critical bugs (dalla lista Card #1) 📋
**Scope:** Da definire dopo Card #1
**Dipende da:** Card #1 APPROVED

---

### Day Card #3 — Fix remaining bugs 📋
**Scope:** Da definire dopo Card #2
**Dipende da:** Card #2 APPROVED

---

### Day Card #4 — UI Polish: Dot grid background 📋
**Scope:**
- Implementare sfondo dot grid sul canvas React Flow
- Colori e spacing consistenti con il design system
- Performance: il background non deve impattare lo scrolling/zooming

**Acceptance Criteria:**
- ✓ Dot grid visibile e esteticamente coerente
- ✓ Zero impatto performance su pan/zoom
- ✓ Build passa clean

**Out of Scope:**
- Modifiche ai nodi
- Modifiche alla sidebar
- Qualsiasi altra UI

---

### Day Card #5 — UI Polish: Color-coded ports 📋
**Scope:**
- Implementare colori diversi per tipo di porta (input/output)
- Definire palette colori per tipi di dato (text, image, prompt, settings)
- Applicare a tutti i 12 nodi

**Acceptance Criteria:**
- ✓ Ogni tipo di porta ha un colore distinto
- ✓ Palette documentata
- ✓ Tutti i nodi aggiornati
- ✓ Build passa clean

**Out of Scope:**
- Logica dei nodi
- Nuovi nodi
- Modifiche al background

**Dipende da:** Card #4 APPROVED (per evitare conflitti CSS)

---

### Day Card #6 — UI Polish: Undo/Redo 📋
**Scope:**
- Implementare undo/redo per azioni sul canvas (add/remove/move nodes, connections)
- Zustand middleware o custom implementation
- Keyboard shortcuts: Ctrl+Z / Ctrl+Shift+Z

**Acceptance Criteria:**
- ✓ Undo reverte l'ultima azione
- ✓ Redo ripristina l'azione annullata
- ✓ Funziona per: add node, remove node, move node, add connection, remove connection
- ✓ Keyboard shortcuts funzionanti
- ✓ Build passa clean

**Out of Scope:**
- Undo per contenuto dei nodi (text input, settings)
- Persistent undo history tra sessioni

---

## PHASE 2 — BATCH & TEMPLATES

### Day Card #7 — Architecture: Batch firing design 📋
**Scope:**
- Design document per batch firing a Fal.ai
- Definire: queue management, concurrency limits, error handling, retry logic
- NO implementazione — solo design

**Acceptance Criteria:**
- ✓ Design document completo con diagrammi
- ✓ API contract definita
- ✓ Error handling strategy documentata
- ✓ Roberto approva il design

---

### Day Card #8 — Batch firing implementation 📋
**Dipende da:** Card #7 APPROVED

---

### Day Card #9 — Prompt template system design 📋
**Scope:**
- Design del sistema di template per prompt per ad format
- Formati: headline, UGC, testimonial, stat callout, us vs them
- Porting delle regole prompt da LUMIN.AI (Semantic Lock, compartmentalizzazione, etc.)

---

### Day Card #10 — Prompt template implementation 📋
**Dipende da:** Card #9 APPROVED

---

### Day Card #11 — Product photo as reference input 📋
**Scope:**
- Node per upload/reference di product photo
- Integration con il prompt system per usare la foto come reference

---

## PHASE 3 — CREATIVE DIRECTOR

### Day Card #12+ — Creative Director Node design 📋
**Scope:** Design dell'integrazione Super Creative Director come nodo TRAMAI
**Note:** Viene dal concept di integrare il Super CD come feature TRAMAI invece di prodotto standalone

---

## BACKLOG

> Bug e feature trovati fuori scope durante le Day Cards.
> Ogni item ha un ID univoco per riferimento.

```
[vuoto — si popola durante lo sviluppo]
```

---

## NOTE

- Le card dalla #7 in poi sono bozze — verranno dettagliate man mano
- L'ordine può cambiare se emergono blockers
- Nuove card possono essere inserite dal backlog
- Il Mike Futia pipeline (brand URL → Brand DNA → templates → batch) è reference per Phase 2-3
