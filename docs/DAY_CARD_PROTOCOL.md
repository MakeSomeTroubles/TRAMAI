# DAY CARD PROTOCOL — TRAMAI

> Knowledge file per il progetto Claude TRAMAI.
> Definisce il workflow giornaliero in dettaglio.

---

## FILOSOFIA

Una Day Card = una missione = un giorno.
Non di più, non di meno.
Quando è fatta, è FATTA. Locked. Intoccabile.
La prossima si sblocca domani.

Questo protocollo esiste perché:
- Roberto è ADHD e tende a inseguire bug fino alle 5 di mattina
- Sessioni lunghe e non strutturate producono più bug di quanti ne fixano
- La qualità viene dalla disciplina, non dalle ore

---

## ANATOMIA DI UNA DAY CARD

```
╔══════════════════════════════════════════════════╗
║  DAY CARD #[N] — [TITOLO BREVE]                 ║
║  Data: [data]                                    ║
║  Priorità: P0 (bloccante) / P1 / P2             ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  SCOPE                                           ║
║  Cosa si fa in questa card:                      ║
║  - [task 1 specifica e misurabile]               ║
║  - [task 2 specifica e misurabile]               ║
║  - [task 3 specifica e misurabile]               ║
║                                                  ║
║  ACCEPTANCE CRITERIA                             ║
║  La card è DONE quando:                          ║
║  ✓ [criterio 1 verificabile]                     ║
║  ✓ [criterio 2 verificabile]                     ║
║  ✓ [criterio 3 verificabile]                     ║
║  ✓ npm run build passa clean                     ║
║  ✓ Zero errori in console browser                ║
║                                                  ║
║  OUT OF SCOPE                                    ║
║  NON si tocca:                                   ║
║  ✗ [cosa specifica da non toccare]               ║
║  ✗ [componente/file che resta intatto]           ║
║  ✗ Qualsiasi cosa non listata in SCOPE           ║
║                                                  ║
║  FILE COINVOLTI                                  ║
║  - [path/file1.tsx] — modifica                   ║
║  - [path/file2.ts] — nuovo                       ║
║  - [path/file3.tsx] — READ ONLY (riferimento)    ║
║                                                  ║
║  DIPENDENZE                                      ║
║  - Richiede: Day Card #[N-1] APPROVED            ║
║  - Blocca: Day Card #[N+1]                       ║
║                                                  ║
╚══════════════════════════════════════════════════╝
```

---

## FLUSSO DELLA GIORNATA

### FASE 1 — Briefing (5 minuti, Roberto presente)

1. Roberto apre Claude Code e dice "day card"
2. Claude Code legge `docs/ROADMAP.md` e `docs/CHANGELOG.md`
3. Claude Code presenta la prossima card non completata
4. Roberto review:
   - **"go"** → si parte
   - **"adjust: [modifica]"** → Claude aggiorna la card e ri-presenta
   - **"skip"** → salta alla prossima card (annotare skip in CHANGELOG)
   - **"custom: [descrizione]"** → card personalizzata per oggi

**Alternativa:** Roberto può anche usare la chat Claude Project per pianificare/discutere la card, poi passare a Claude Code per l'implementazione.

### FASE 2 — Development Autonomo (Claude Code lavora)

Claude Code esegue la card nei file REALI del progetto. Roberto ha `npm run dev` attivo.

**Ordine di lavoro:**
1. Leggi i file coinvolti e comprendi lo stato attuale
2. Pianifica le modifiche PRIMA di toccare codice
3. Implementa fix-by-fix (una modifica alla volta)
4. Dopo ogni modifica: `npm run build` + type check
5. Se un check fallisce: fixa PRIMA di procedere
6. Se il fix richiede toccare file fuori scope: STOP, nota nel backlog
7. Roberto può vedere i cambiamenti in tempo reale nel browser (Vite HMR)

**Comunicazione durante lo sviluppo:**
- Aggiorna Roberto con messaggi brevi ogni 2-3 modifiche
- Formato: "✅ [cosa fatto] | Prossimo: [cosa faccio ora]"
- Se trovi un problema imprevisto: "⚠️ Trovato: [problema]. Opzioni: A) [soluzione in scope] B) [nota per backlog]. Consiglio: [A/B]"

**Cosa NON fare mai:**
- Creare file HTML/artifact come preview — il preview è il browser con dev server
- Modificare file non listati in "FILE COINVOLTI"
- Installare dipendenze non discusse nel briefing
- Refactorare codice che "potrebbe essere migliore" ma funziona
- Fare più di una modifica senza verificare che compili
- Ignorare un errore di build per "tornare dopo"
- Presentare un HTML preview come deliverable — i preview servono solo per decisioni di design. Il deliverable è SEMPRE nei file reali del progetto. Ogni cosa approvata in un preview DEVE essere implementata 1:1 nei file .jsx/.ts/.css

### FASE 3 — Day Delivery (Claude Code presenta)

Quando la card è completa, Claude Code presenta il Day Delivery.
**IMPORTANTE:** il delivery NON include mockup HTML. Roberto testa direttamente nel browser con `npm run dev` attivo (Vite HMR). Quello che vede nel browser È il codice reale.

```
## DAY DELIVERY — Card #[N]

### Modifiche effettuate
1. [File]: [cosa cambiato e perché]
2. [File]: [cosa cambiato e perché]

### Check automatici
- npm run build: ✅ PASS
- Type check: ✅ PASS
- Lint: ✅ PASS / ⚠️ [warnings non critici]

### Self-QA Checklist
- [x] Tutti gli Acceptance Criteria soddisfatti
- [x] Nessun file fuori scope toccato
- [x] Nessuna dipendenza nuova non approvata
- [x] Verificato nel browser con dev server
- [x] Console browser clean (zero errori)
- [x] Componenti isolati e riusabili

### Note
- [decisioni prese durante lo sviluppo]
- [trade-off accettati]

### Per il QA di Roberto (NEL BROWSER, non in un mockup)
Assicurati che `npm run dev` sia attivo, poi testa:
1. [scenario da testare nel browser — URL/route se applicabile]
2. [scenario da testare nel browser]
3. [edge case da verificare]
4. Apri console browser → zero errori
```

### FASE 4 — QA di Roberto (l'unico lavoro di Roberto)

Roberto testa nel browser e dà verdetto:

- **APPROVED** → Card locked. Claude scrive Day Close Note. Aggiorna CHANGELOG.md.
- **MINOR** → Roberto descrive il problema. Claude fixa SOLO quello. Ri-presenta solo il fix. Roberto ri-testa solo il fix.
- **BLOCKED** → Problema strutturale. Claude documenta tutto. Diventa la card di domani con contesto completo.

**Regola MINOR:** massimo 2 cicli MINOR per card. Al terzo, diventa BLOCKED automaticamente — significa che la card era mal definita e serve un re-scope domani.

### FASE 5 — Day Close & Lock

```
## DAY CLOSE — Card #[N] — [DATA]

### Verdetto: APPROVED ✅

### Componenti LOCKED (non toccare senza Day Card dedicata)
- [path/componente1.tsx]
- [path/componente2.ts]

### Backlog aggiunto oggi
- [BUG-xxx]: [descrizione bug trovato fuori scope]
- [FEAT-xxx]: [feature idea emersa durante sviluppo]

### Prossima card suggerita
- Day Card #[N+1]: [titolo]
- Rationale: [perché questa è la priorità]

### Handover per prossima sessione
- [info chiave che la prossima chat DEVE sapere]
```

---

## REGOLE DI LOCK

### Cosa significa LOCKED
- Il file/componente NON può essere modificato in nessuna sessione futura
- L'unico modo per sbloccare è una Day Card dedicata con "UNLOCK: [componente]" nello scope
- La card di unlock deve specificare PERCHÉ serve sbloccare e cosa cambia

### Registro Lock
Mantenere sempre aggiornato nel CHANGELOG.md:
```
## LOCKED COMPONENTS
- [data] src/components/Sidebar.tsx — Card #3
- [data] src/nodes/BriefNode.tsx — Card #5
- [data] src/store/flowStore.ts — Card #7
```

### Quando serve un unlock
- Bug critico nel componente locked (P0)
- Requisito architetturale che forza una modifica
- MAI per "miglioramenti", "refactoring", "cleanup"

---

## GESTIONE TEMPO E ADHD

### Segnali di allarme (Claude deve monitorare)
Se Roberto:
- Chiede di "aggiungere veloce una cosa" dopo il Day Delivery → **RIFIUTA**
- Vuole aprire una nuova card alla sera → **RIFIUTA** (domani)
- Dice "solo un secondo" o "quasi finito" alle 23:00+ → **PARK forzato**
- Mostra frustrazione per un bug e vuole inseguirlo → "Lo segno nel backlog. È una card futura. Chiudiamo questa."

### Risposte pre-approvate di Claude
- "Capisco la frustrazione, ma il protocollo dice no. Lo segno per domani."
- "Questo è esattamente il tipo di cosa che ci ha tenuti svegli fino alle 5 con LUMIN.AI. PARK."
- "Buona idea, ma è fuori scope. La metto nel backlog come [ID]. Domani o dopo."
- "La card di oggi è chiusa. Qualsiasi cosa ora è una nuova card. Ci vediamo domani."

### Timebox suggerito
- Briefing: 5-10 minuti
- Dev autonomo: 1-3 ore
- QA Roberto: 15-30 minuti
- Day Close: 5 minuti
- **TOTALE MASSIMO: 4 ore al giorno**
- Dopo le 22:00: PARK automatico (Roberto può override con "override orario")

---

## METRICHE

Tracciare nel CHANGELOG.md:
- Cards completate per settimana
- Ratio APPROVED vs MINOR vs BLOCKED
- Bug trovati fuori scope per card (indica qualità del planning)
- Cards che hanno richiesto UNLOCK (indica qualità dell'architettura)

Target:
- ≥80% APPROVED al primo tentativo
- ≤1 UNLOCK per settimana
- 0 sessioni oltre le 23:00
