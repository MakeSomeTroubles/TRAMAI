# LEZIONI DA LUMIN.AI — Non ripetere questi errori

> Knowledge file per il progetto Claude TRAMAI.
> Ogni lezione viene da ore perse, bug creati, o sessioni alle 5 di mattina.
> Leggere PRIMA di ogni decisione architetturale.

---

## ERRORI ARCHITETTURALI

### 1. Il monolite IIFE
**Cosa è successo:** LUMIN.AI era un singolo file JavaScript minificato (IIFE) iniettato come Chrome extension. Ogni modifica era chirurgia su una singola linea gigante usando `str.replace()` con anchor unici.

**La lezione per TRAMAI:** L'architettura modulare (React + componenti separati) è un vantaggio enorme, MA solo se viene rispettata. Il momento in cui inizi a mettere "logica temporanea" in un file che non le appartiene, stai ricostruendo il monolite.

**Regola:** Un componente, un file, una responsabilità. Nessuna eccezione.

### 2. CSS conflicts e Shadow DOM
**Cosa è successo:** Higgsfield.ai iniettava CSS che sovrascriveva gli stili di LUMIN.AI. Ore perse a debuggare stili che "funzionavano in isolamento ma non nel sito". La soluzione era Shadow DOM, ma è arrivata tardi.

**La lezione per TRAMAI:** TRAMAI gira standalone (non è un'extension), quindi il rischio CSS è minore. MA: mai usare classi CSS generiche. Tailwind con prefix, oppure CSS modules. Testare sempre nel contesto reale, non in isolamento.

### 3. State management improvvisato
**Cosa è successo:** LUMIN.AI ha accumulato stato in variabili globali, closures, e DOM attributes. Debugging dello stato era un incubo perché non c'era una single source of truth.

**La lezione per TRAMAI:** Zustand è già la scelta giusta. Regole: tutto lo stato in Zustand. Zero `useState` per stato condiviso. Se due componenti leggono lo stesso dato, quel dato sta in Zustand. Nessuna eccezione.

---

## ERRORI DI PROCESSO

### 4. "Già che ci siamo..."
**Cosa è successo:** Le sessioni peggiori sono quelle dove dopo aver fixato il bug target, "già che ci siamo" toccavamo un'altra cosa. Che creava un nuovo bug. Che richiedeva un fix. Che toccava un terzo file. Cascata.

**La lezione per TRAMAI:** Il Daily Card Protocol esiste per questo. Lo scope della card è un muro. Niente passa quel muro senza una nuova card.

### 5. Fix batch invece di fix singoli
**Cosa è successo:** "Faccio queste 3 modifiche insieme perché sono collegate." Risultato: quando qualcosa si rompeva, non sapevi quale delle 3 era la causa. Ore di debug per distinguere.

**La lezione per TRAMAI:** Fix-by-fix. Una modifica, build, verifica, conferma, prossima. Sempre. Il tempo "perso" nel verificare ogni singolo fix è 10x inferiore al tempo perso a debuggare un batch.

### 6. Ri-toccare codice approvato
**Cosa è successo:** Un fix approvato nel QS3 veniva "leggermente modificato" nel QS4 per accomodare una nuova feature. Il "leggero" cambiamento rompeva il fix originale. Ore per capire cosa era regredito.

**La lezione per TRAMAI:** LOCKED means LOCKED. Il sistema di lock non è una suggestione — è una regola. Se serve toccare codice locked, serve una Day Card dedicata con unlock esplicito. Mai "aggiustare veloce" qualcosa che era già approvato.

### 7. Sessioni notturne
**Cosa è successo:** Alle 2 di notte il cervello ADHD è in hyperfocus mode. Sembra produttivo. In realtà stai creando bug che domattina impiegherai il triplo del tempo a capire. Le sessioni fino alle 5 di mattina hanno sempre prodotto più lavoro da rifare che lavoro netto.

**La lezione per TRAMAI:** PARK alle 22:00. Non "quasi finito." PARK. Il protocollo include un hard stop. Claude deve rifiutare di continuare.

---

## ERRORI TECNICI

### 8. Non testare dopo ogni patch
**Cosa è successo:** `node --check` dopo ogni patch ha salvato LUMIN.AI decine di volte. Ogni volta che lo saltavamo "perché è una modifica piccola", c'era un errore sintattico.

**La lezione per TRAMAI:** `npm run build` dopo ogni modifica. Non dopo un gruppo di modifiche. Dopo OGNI singola modifica. Il build è la verità. Se non compila, la modifica non esiste.

### 9. Assumere che la prossima chat sappia
**Cosa è successo:** Chiudevamo una sessione pensando "nella prossima chat riprendiamo da dove eravamo." La prossima chat non sapeva niente. Ore perse a ricostruire contesto.

**La lezione per TRAMAI:** Handover documents sono obbligatori. Ogni sessione chiude con un handover che dice esattamente: cosa è stato fatto, cosa è locked, cosa resta, cosa sa la prossima chat. Il CHANGELOG.md e il ROADMAP.md sono la memoria tra sessioni.

### 10. Prompt engineering per Fal.ai
**Cosa è successo con Higgsfield:** I prompt builders di LUMIN.AI v15 hanno regole precise (dal testing con Gemini): "Semantic Lock" per mode tecnico, mai mixare FACE_LOCK con patch/removal, verbi clinici non estetici, NEG corti, compartmentalizzare task tecnici da identity task.

**La lezione per TRAMAI:** Quando TRAMAI Phase 2 implementerà i prompt templates per Fal.ai, queste regole vanno rispettate. Non reinventare — portare i prompt rules testati. Creare una card dedicata per il porting dei prompt rules.

### 11. HTML preview ≠ codice reale
**Cosa è successo:** Claude mostrava preview HTML bellissimi nella chat. Roberto approvava. Ma quei preview erano file isolati — non toccavano i .jsx, .css, o lo store del progetto. Il risultato: "avevo approvato una cosa diversa da quello che c'è nel progetto." Ore perse a riallineare.

**La lezione per TRAMAI:** I preview HTML servono SOLO per decisioni di design ("questa direzione va bene?"). Il deliverable è SEMPRE il file reale. Il QA si fa su localhost, mai sull'artifact. Se qualcosa funziona nel preview ma non è replicabile 1:1 in React/Tailwind, va detto PRIMA dell'approvazione.

---

## CHECKLIST PRE-MODIFICA (da usare ogni volta)

Prima di toccare qualsiasi file, chiediti:

1. ☐ Questo file è nella lista "FILE COINVOLTI" della Day Card?
2. ☐ Questo file è LOCKED? (controlla CHANGELOG.md)
3. ☐ Sto facendo UNA modifica o sto raggruppando?
4. ☐ Se questa modifica rompe qualcosa, saprò immediatamente che è stata lei?
5. ☐ Ho letto il file prima di modificarlo? (mai modificare alla cieca)
6. ☐ La modifica fa SOLO quello che dice la card?
7. ☐ Sto modificando i file REALI del progetto, non solo un preview HTML?

Se la risposta a qualsiasi domanda è NO → STOP. Riconsidera.

---

## PATTERN CHE HANNO FUNZIONATO

Non tutto in LUMIN.AI è stato un errore. Questi pattern vanno portati:

1. **Anchor-based patching** → In TRAMAI si traduce in: modifica chirurgica con context preciso. Mai replace globali.
2. **Handover documents** → Diventano Day Close Notes + CHANGELOG.md
3. **QS (Quality Sessions) strutturate** → Diventano la Fase 3 del Daily Card Protocol
4. **Naming conventions rigide** → Mantenere in TRAMAI: PascalCase per componenti, camelCase per funzioni/variabili, SCREAMING_SNAKE per costanti
5. **"Approved fixes are LOCKED"** → Identico in TRAMAI, con registro formale
