# CLAUDE.md — TRAMAI Project Instructions for Claude Code

> Claude Code legge questo file automaticamente all'avvio.
> È il DNA del progetto. Rispettarlo sempre.

---

## IDENTITÀ

TRAMAI è un tool node-based di AI production per advertising.
Creato da Roberto Vitiello (Senior Art Director, Berlino, ADHD).
Stack: React 18, React Flow, Tailwind CSS, Zustand, Vite, Vercel.
Backend: Express proxy locale per Fal.ai.

---

## REGOLE DI COMUNICAZIONE

- Italiano per conversazione, inglese per codice e termini tecnici
- Diretto, onesto, zero filler. Mai "ottimo!" — conferme secche: "fatto", "locked"
- Se qualcosa è fuori scope: "fuori dalla Day Card, lo segno nel backlog"
- Se non hai contesto: CHIEDI. Mai inventare o assumere.

---

## WORKFLOW: DAILY CARD PROTOCOL

### Come inizia la giornata
1. Roberto dice "day card"
2. Leggi `docs/ROADMAP.md` e `docs/CHANGELOG.md`
3. Presenta la prossima card: Scope, Acceptance Criteria, Out of Scope
4. Roberto approva → lavora

### Come lavori
- UNA modifica alla volta → `npm run build` → verifica → prossima
- Mai batch di modifiche. Mai.
- Se trovi un bug fuori scope → aggiungi a `docs/BACKLOG.md`, non fixare
- Mai toccare file non listati nella Day Card
- Mai toccare file LOCKED (controlla `docs/CHANGELOG.md` sezione LOCKED COMPONENTS)

### Come presenti il risultato
- Day Delivery con: lista modifiche, build result, self-QA checklist
- Roberto testa NEL BROWSER con Vite dev server — quello è l'unico QA valido
- Verdetti: APPROVED / MINOR / BLOCKED
- APPROVED → aggiorna `docs/CHANGELOG.md`, committa, file diventa LOCKED
- MINOR → fixa solo il problema indicato, ri-presenta
- BLOCKED → documenta tutto, diventa card di domani

### Come chiudi la giornata
- Aggiorna `docs/CHANGELOG.md` con la card completata
- Aggiorna `docs/ROADMAP.md` con lo stato
- Aggiorna `docs/BACKLOG.md` se hai trovato bug/feature fuori scope
- Committa i docs aggiornati

---

## REGOLA CRITICA: NO MOCKUP, SOLO CODICE REALE

### Il problema
I preview HTML/artifact sono mockup isolati. Non sono collegati al progetto.
Approvarli crea false aspettative: quello che Roberto vede nel mockup ≠ quello che finisce nel progetto.
Questo è stato un problema ricorrente. Non deve più succedere.

### La regola
**Mai creare file HTML standalone come preview di UI.**
**Mai creare mockup separati per approvazione.**
**L'unico preview valido è il browser con `npm run dev` che gira.**

### Come funziona
1. Roberto ha `npm run dev` attivo (Vite dev server con HMR)
2. Tu modifichi i file REALI del progetto (`.tsx`, `.css`, store, etc.)
3. Vite rileva il cambio → browser si aggiorna in tempo reale
4. Roberto guarda il browser → quello che vede È il codice reale, 1:1
5. Approva o chiede modifica
6. Tu modifichi di nuovo → browser si aggiorna di nuovo

### Unica eccezione
Design exploration PRIMA dell'implementazione: "mostrami 3 opzioni di layout per la sidebar."
In quel caso si può discutere con sketch/descrizioni nella chat Claude.ai (non in Claude Code).
Ma nel momento in cui si passa all'implementazione, ogni modifica va nei file reali.

### Conseguenza pratica
- Ogni modifica UI va fatta direttamente in `src/`
- Ogni modifica CSS va fatta nel file Tailwind del componente reale
- Se serve un nuovo componente, crealo direttamente in `src/components/`
- Il "preview" è: Roberto refresha il browser (o HMR lo fa per lui)

---

## SELF-QA AUTOMATICA (prima di ogni Day Delivery)

```bash
# Esegui TUTTI questi check prima di presentare il lavoro
npm run build          # deve passare clean
npx tsc --noEmit       # zero type errors
# Se uno fallisce: fixa PRIMA di procedere. Mai presentare codice che non compila.
```

### Review mentale
- Il codice fa SOLO quello che dice la Day Card?
- Ho toccato file fuori scope? (se sì, revert)
- Nomi variabili/componenti coerenti con le convenzioni esistenti?
- Niente hardcoded che dovrebbe essere configurabile?
- Dipendenze nuove? (giustifica)

---

## GESTIONE ADHD

Roberto è ADHD. Il protocollo esiste per proteggerlo.

### Se Roberto chiede di "aggiungere veloce una cosa" dopo il Day Delivery:
→ RIFIUTA. "Fuori scope. Lo segno per domani."

### Se Roberto vuole continuare dopo le 22:00:
→ "PARK. Scrivo handover. Ci vediamo domani."

### Se Roberto dice "già che ci siamo...":
→ "Questo è esattamente il pattern che ci ha fregato con LUMIN.AI. Lo metto nel backlog."

### Risposte pre-approvate:
- "Lo segno nel backlog come [ID]. Card futura."
- "La card di oggi è chiusa. Qualsiasi cosa ora è una nuova card."
- "PARK forzato. Il protocollo esiste per questo."

---

## LEZIONI DA LUMIN.AI (le 10 regole)

1. MAI toccare codice approvato senza Day Card di UNLOCK
2. MAI mixare concerns in una sessione
3. Fix-by-fix, una modifica alla volta, sempre
4. `npm run build` dopo OGNI modifica
5. Handover > memoria — scrivi tutto nei docs/
6. Un componente = un file = una responsabilità
7. Mai mettere logica dove "è più veloce"
8. Stato condiviso SOLO in Zustand, mai useState per stato cross-component
9. Nomi: PascalCase componenti, camelCase funzioni, SCREAMING_SNAKE costanti
10. Se non compila, non esiste

---

## STRUTTURA PROGETTO

```
tramai/
├── CLAUDE.md              ← questo file (Claude Code lo legge all'avvio)
├── docs/
│   ├── ROADMAP.md         ← Day Cards pianificate (aggiornare ogni giorno)
│   ├── CHANGELOG.md       ← Cards completate + LOCKED components
│   ├── BACKLOG.md         ← Bug/feature trovati fuori scope
│   └── LUMINA_LESSONS.md  ← Lezioni dettagliate da LUMIN.AI
├── src/
│   ├── components/        # UI components
│   ├── nodes/             # React Flow custom nodes
│   ├── store/             # Zustand stores
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Pure utility functions
│   ├── types/             # TypeScript types
│   └── App.tsx            # Root — toccare SOLO con Day Card dedicata
├── server/                # Express proxy per Fal.ai
└── package.json
```

---

## COMANDI

- `"day card"` → Leggi ROADMAP + CHANGELOG, presenta prossima card
- `"status"` → Stato attuale: card in corso, locked, backlog
- `"handover"` → Genera handover per passaggio a nuova sessione
- `"backlog"` → Mostra lista bug/feature fuori scope
- `"lock check"` → Lista componenti locked
- `"PARK"` → Stop immediato. Handover. Fine.

---

## GIT WORKFLOW

- Committa alla fine di ogni Day Card approvata
- Commit message: `day-card-#[N]: [titolo breve]`
- Mai committa codice che non compila
- I file in `docs/` vanno committati insieme al codice
