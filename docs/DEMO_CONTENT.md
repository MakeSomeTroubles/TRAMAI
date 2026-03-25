# TRAMAI — Demo Content

> Contenuti pre-scritti per la demo, gli screenshots e il video.
> Ogni scenario è pensato per produrre immagini visivamente forti nel portfolio.

---

## SCENARIO A — "Premium Coffee Brand" (CONSIGLIATO PER VIDEO)

Questo è lo scenario migliore per la demo perché:
- Il prodotto è universale (tutti capiscono il caffè)
- I toni caldi sono fotogenici e Fal.ai li gestisce bene
- È credibile come lavoro reale di agenzia

### Brief Node content:
```
Client: KOVA Coffee
Product: Premium single-origin coffee beans
Format: Social media hero image (1:1)
Tone: Warm, minimal, premium
Target: Urban professionals 28-40
Key message: Ritual, not routine
Must include: Coffee bag or cup, warm morning light
Avoid: Generic stock photo feel, cluttered composition
```

### Expected Prompt (dopo il Prompt Node):
```
Professional product photography of a matte black coffee bag with minimal gold typography on a polished concrete surface. Soft warm morning light from upper left, subtle steam rising from a ceramic cup beside it. Shallow depth of field. Warm earth tones, clean composition. Commercial quality, 8K resolution.
```

### Negative:
```
blurry, distorted text, cluttered, busy background, cold tones, stock photo feel
```

---

## SCENARIO B — "Skincare Launch"

Buono per mostrare il Variations node — un prodotto, multiple angolazioni.

### Brief Node content:
```
Client: AURA Skincare
Product: Vitamin C serum in frosted glass dropper bottle
Format: Product hero + 3 variations
Tone: Clean, clinical-luxe, bright
Target: Women 25-35, skincare enthusiasts
Key message: Science meets sensory
Must include: The bottle, natural ingredients (citrus hints)
Avoid: Overly medical, cold, sterile
```

### Expected Prompt:
```
Maintaining exact product proportions and label legibility: Professional product photography of a frosted glass dropper bottle with vitamin C serum, golden liquid visible inside. White marble surface with scattered dried citrus slices. Bright even lighting, soft shadows. Clean minimal composition with negative space on top for text. Premium beauty advertising quality.
```

---

## SCENARIO C — "Sneaker Drop"

Buono per mostrare colori vividi e il Headline template.

### Brief Node content:
```
Client: STRIDE Athletics
Product: Limited edition running shoe, neon green/black
Format: Hero banner 16:9
Tone: Bold, energetic, street culture
Target: Gen Z runners and sneakerheads
Key message: Speed is a feeling
Must include: The shoe, dynamic angle, sense of motion
Avoid: Static flat lay, boring white background
```

### Expected Prompt:
```
Dynamic advertising hero image of a neon green and black running shoe. Low angle dramatic shot, shoe positioned in lower right third. Concrete texture ground with motion blur particles. Hard directional lighting creating dramatic shadows. Large clean dark area in upper left for headline text. Bold contrast, vibrant neon green against dark background. High-impact commercial photography, 8K.
```

---

## SCENARIO D — "UGC Campaign"

Buono per mostrare il UGC template e la differenza di stile.

### Brief Node content:
```
Client: DAILY Supplements
Product: Vitamin gummy bears in pastel jar
Format: UGC-style social content
Tone: Authentic, casual, relatable
Target: Health-conscious millennials
Key message: Wellness doesn't have to be boring
Must include: Real person, genuine reaction, product visible
Avoid: Perfect studio look, model agency faces
```

### Expected Prompt:
```
Authentic user-generated content style photo. A real person, no model, diverse appearance, holding a pastel jar of vitamin gummies and smiling at the camera with genuine enthusiasm. Home kitchen environment, real background slightly blurred. Shot on iPhone, front camera selfie angle. Natural mixed lighting, not color-corrected. Social media native aesthetic.
```

---

## PER GLI SCREENSHOTS — COSA MOSTRARE

### Screenshot 1: "The Full Flow" (hero image per portfolio)
- Layout A (Hero Pipeline): Brief → Prompt → Generate → Preview Wall
- Brief Node: Scenario A (KOVA Coffee) compilato
- Generate Node: con un'immagine generata visibile
- Connections: animate (teal per text, pink per images)
- Zoom: tutto visibile, sidebar inclusa
- **Questo è lo screenshot principale del portfolio**

### Screenshot 2: "Node Detail" (close-up)
- Zoom su Generate Node con immagine generata
- Mostra il glass effect sui bordi
- Mostra i port colorati
- Sidebar sfocata sullo sfondo (depth of field naturale del glass)

### Screenshot 3: "Preview Wall"
- Zoom su Preview Wall Node con 3-4 immagini
- Se non hai 4 generazioni reali, anche 1 reale + placeholder è ok
- Mostra la griglia di variazioni

### Screenshot 4: "The Workspace" (wide shot)
- Layout B (Full Pipeline) con tutti i nodi
- Leggermente zoomato out per mostrare la completezza
- Mostra che è un tool serio, non un toy
- Dot grid visibile, glass effect su tutto

### Screenshot opzionale 5: "Dark Mode Beauty"
- Close-up di due nodi connessi
- Focus sul glass effect: blur, bordi luminosi, ombre
- Questo è puramente per "wow factor" del design

---

## PER IL VIDEO — SCRIPT (15-30 secondi)

### Sequenza:
1. **Apertura** (2 sec): TRAMAI si apre, layout vuoto con dot grid → "wow, che UI"
2. **Brief** (4 sec): Click su Brief node, testo del coffee brief appare/è già scritto
3. **Connect** (3 sec): Connessione animata da Brief a Prompt a Generate (se non automatico, mostra le linee già fatte)
4. **Generate** (5 sec): Click "Generate", loading state visibile, immagine appare
5. **Result** (3 sec): Pan/zoom sull'immagine generata
6. **Wide shot** (3 sec): Zoom out per mostrare il flow completo

### Tips per il recording:
- Cursor nascosto o con un cursor elegante (es. macOS default)
- Movimenti del mouse lenti e deliberati
- Se c'è loading time da Fal.ai, va bene — mostra che è reale
- Risoluzione: registra a 2x e riduci (qualità migliore)
- No audio necessario
- Se vuoi: aggiungi label di testo in post (in Figma o in video editor) tipo "Brief → Generate in 8 seconds"

---

## PLACEHOLDER IMAGES (se la pipeline non genera)

Se per qualsiasi motivo non riesci a generare immagini reali entro il deadline,
usa questi come placeholder nei nodi:

- Unsplash: cerca "product photography coffee dark" → scarica 3-4
- Unsplash: cerca "minimal product shot" → scarica 2-3
- Dimensione: 1024x1024 o 1024x576 per hero banner
- Salvale in `/public/demo/` e referenziale nei nodi

Il portfolio caption diventa:
"TRAMAI — AI Production Tool for Advertising (in development, UI prototype)"

È 100% legittimo. Mostra la tua capacità di design thinking + UI + development.
L'immagine generata è un bonus, non il punto.
