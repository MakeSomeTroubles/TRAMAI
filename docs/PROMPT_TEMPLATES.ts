// TRAMAI — Prompt Template System
// Porting delle regole prompt testate con LUMIN.AI + nuovi template per advertising formats
// Questi template vanno nel Prompt Node come presets selezionabili

// ============================================================
// PROMPT RULES (da LUMIN.AI, testati e validati)
// ============================================================

export const PROMPT_RULES = {
  // REGOLA 1: Compartmentalizzazione
  // Mai mixare task tecnici con task di identità nello stesso prompt.
  // "Change background" e "preserve face identity" sono due istruzioni che confliggono.
  // Soluzione: pipeline sequenziale, un task per step.
  compartmentalization: true,

  // REGOLA 2: Verbi clinici, non estetici
  // "Remove blemish" > "make skin look better"
  // "Adjust white balance to 5500K" > "make colors warmer"
  // Il modello risponde meglio a istruzioni specifiche e tecniche.
  clinicalVerbs: true,

  // REGOLA 3: Negative prompt corti
  // NEG deve essere conciso: max 15-20 parole.
  // Negative lunghi confondono il modello più di quanto aiutino.
  // Focus su 3-5 keyword critiche, non liste enciclopediche.
  shortNegative: true,

  // REGOLA 4: Semantic Lock
  // Quando il prompt deve preservare un elemento specifico (volto, prodotto, layout),
  // usa un blocco dedicato all'inizio del prompt che "blocca" quell'elemento.
  // Es: "Maintaining exact product shape, color, and label positioning: [rest of prompt]"
  semanticLock: true,

  // REGOLA 5: Mai mixare FACE_LOCK con patch/removal
  // Se stai preservando un volto, non fare rimozione oggetti nello stesso step.
  // Due passaggi separati.
  noFaceLockWithRemoval: true,
};


// ============================================================
// NEGATIVE PROMPT DEFAULTS
// ============================================================

export const NEGATIVE_DEFAULTS = {
  // Universal (always include)
  universal: 'blurry, low quality, distorted, watermark, text overlay',

  // Per product photography
  product: 'blurry, distorted proportions, missing label, wrong colors, floating objects',

  // Per portraits/lifestyle
  portrait: 'distorted face, extra fingers, blurry, unnatural skin, crossed eyes',

  // Per clean advertising
  advertising: 'cluttered, busy background, low contrast, amateur lighting, stock photo feel',
};


// ============================================================
// TEMPLATE: PRODUCT SHOT
// ============================================================

export const TEMPLATE_PRODUCT_SHOT = {
  id: 'product-shot',
  name: 'Product Shot',
  description: 'Clean product photography with controlled lighting and background',
  category: 'advertising',

  // Structural template — {variables} get replaced by node inputs
  prompt: `{semantic_lock}Professional product photography of {product_description}. {surface_material} surface. {lighting_setup}. {camera_angle} angle. Sharp focus on product details. {color_mood}. Commercial quality, 8K resolution.`,

  variables: {
    semantic_lock: {
      default: 'Maintaining exact product proportions and label legibility:',
      description: 'Preservation instruction for product identity',
    },
    product_description: {
      default: 'a premium glass bottle with minimal label',
      description: 'What the product looks like',
    },
    surface_material: {
      default: 'Polished concrete',
      options: ['Polished concrete', 'White marble', 'Dark slate', 'Natural wood', 'Brushed metal', 'Matte black'],
    },
    lighting_setup: {
      default: 'Soft diffused key light from upper left, subtle rim light',
      options: [
        'Soft diffused key light from upper left, subtle rim light',
        'Hard directional light creating dramatic shadows',
        'Even flat lighting, no harsh shadows',
        'Warm golden hour backlight with fill',
        'Cool blue accent light with warm key',
      ],
    },
    camera_angle: {
      default: 'Slightly elevated 30-degree',
      options: ['Straight on eye-level', 'Slightly elevated 30-degree', '45-degree overhead', 'Low angle hero', 'Flat lay top-down'],
    },
    color_mood: {
      default: 'Neutral tones, clean whites',
      options: ['Neutral tones, clean whites', 'Warm earth tones', 'Cool minimal palette', 'Bold saturated colors', 'Muted desaturated editorial'],
    },
  },

  negative: NEGATIVE_DEFAULTS.product,

  // Fal.ai specific settings
  falSettings: {
    guidance_scale: 7.5,
    num_inference_steps: 30,
    image_size: { width: 1024, height: 1024 },
  },
};


// ============================================================
// TEMPLATE: LIFESTYLE
// ============================================================

export const TEMPLATE_LIFESTYLE = {
  id: 'lifestyle',
  name: 'Lifestyle Scene',
  description: 'Product in real-world context with human element',
  category: 'advertising',

  prompt: `{semantic_lock}Lifestyle photography, {person_description} {action} with {product_description}. {setting}. {lighting}. Natural candid moment. {mood}. Editorial quality, shallow depth of field.`,

  variables: {
    semantic_lock: {
      default: 'Maintaining natural human proportions and authentic expression:',
    },
    person_description: {
      default: 'a young professional in casual smart clothing',
      description: 'Who is in the scene',
    },
    action: {
      default: 'enjoying morning coffee',
      description: 'What they are doing',
    },
    product_description: {
      default: 'a branded ceramic mug',
      description: 'Product placement',
    },
    setting: {
      default: 'Bright modern apartment kitchen, morning light through large windows',
      options: [
        'Bright modern apartment kitchen, morning light through large windows',
        'Outdoor café terrace, European city street background',
        'Minimalist office space, clean desk setup',
        'Urban rooftop at golden hour',
        'Cozy living room, warm ambient lighting',
      ],
    },
    lighting: {
      default: 'Natural window light with soft shadows',
      options: [
        'Natural window light with soft shadows',
        'Golden hour warm backlight',
        'Overcast soft even lighting',
        'Mixed natural and warm artificial',
      ],
    },
    mood: {
      default: 'Relaxed, authentic, aspirational',
      options: ['Relaxed, authentic, aspirational', 'Energetic and dynamic', 'Quiet and contemplative', 'Joyful and social', 'Focused and productive'],
    },
  },

  negative: NEGATIVE_DEFAULTS.portrait,

  falSettings: {
    guidance_scale: 7.0,
    num_inference_steps: 30,
    image_size: { width: 1024, height: 1024 },
  },
};


// ============================================================
// TEMPLATE: UGC STYLE
// ============================================================

export const TEMPLATE_UGC = {
  id: 'ugc',
  name: 'UGC Style',
  description: 'User-generated content look — authentic, slightly imperfect, social media native',
  category: 'advertising',

  prompt: `{semantic_lock}Authentic user-generated content style photo. {person_description} {action}. {setting}. Shot on {device}. {lighting}. Slightly imperfect framing, genuine moment. Social media native aesthetic.`,

  variables: {
    semantic_lock: {
      default: 'Maintaining authentic imperfect quality, not studio-polished:',
    },
    person_description: {
      default: 'a real person, no model, diverse appearance',
    },
    action: {
      default: 'showing a product to camera with genuine enthusiasm',
    },
    setting: {
      default: 'Home environment, real messy background slightly blurred',
      options: [
        'Home environment, real messy background slightly blurred',
        'Walking down a city street',
        'At a café table with friends',
        'In front of bathroom mirror',
        'In a car, natural dashboard light',
      ],
    },
    device: {
      default: 'iPhone, front camera selfie angle',
      options: ['iPhone, front camera selfie angle', 'iPhone, rear camera', 'Webcam angle, eye-level', 'Ring light setup, influencer angle'],
    },
    lighting: {
      default: 'Natural mixed lighting, not color-corrected',
    },
  },

  negative: 'studio lighting, perfect skin, professional model, stock photo, overprocessed',

  falSettings: {
    guidance_scale: 6.0, // Lower guidance for more natural variation
    num_inference_steps: 25,
    image_size: { width: 1024, height: 1024 },
  },
};


// ============================================================
// TEMPLATE: HEADLINE / STAT CALLOUT
// ============================================================

export const TEMPLATE_HEADLINE = {
  id: 'headline',
  name: 'Headline Visual',
  description: 'Bold visual designed to support a headline or statistic overlay',
  category: 'advertising',

  prompt: `{semantic_lock}Advertising hero image designed for text overlay. {visual_description}. {composition}. Large area of {negative_space_position} for headline placement. {color_mood}. Bold, high-impact commercial photography.`,

  variables: {
    semantic_lock: {
      default: 'Maintaining clear negative space for text overlay:',
    },
    visual_description: {
      default: 'dramatic close-up of product with water droplets',
    },
    composition: {
      default: 'Subject positioned in lower right third',
      options: [
        'Subject positioned in lower right third',
        'Subject centered bottom, sky above',
        'Subject on left, open space right',
        'Extreme close-up with bokeh edges',
      ],
    },
    negative_space_position: {
      default: 'clean upper half',
      options: ['clean upper half', 'blurred left third', 'soft gradient right side', 'dark lower area'],
    },
    color_mood: {
      default: 'Bold contrast, vibrant color',
      options: ['Bold contrast, vibrant color', 'Minimal monochrome', 'Warm premium gold tones', 'Cool tech blue-silver', 'Earthy natural palette'],
    },
  },

  negative: NEGATIVE_DEFAULTS.advertising,

  falSettings: {
    guidance_scale: 8.0, // Higher guidance for more controlled composition
    num_inference_steps: 30,
    image_size: { width: 1024, height: 576 }, // 16:9 for hero banners
  },
};


// ============================================================
// TEMPLATE: US VS THEM / COMPARISON
// ============================================================

export const TEMPLATE_COMPARISON = {
  id: 'comparison',
  name: 'Us vs Them',
  description: 'Split visual for before/after or comparison advertising',
  category: 'advertising',

  prompt: `{semantic_lock}Split composition advertising image. Left side: {left_description}. Right side: {right_description}. Clear visual divide in center. {lighting}. High contrast between both halves. Commercial quality.`,

  variables: {
    semantic_lock: {
      default: 'Maintaining clear center divide between both halves:',
    },
    left_description: {
      default: 'dull, gray, cluttered, generic version of the scene',
    },
    right_description: {
      default: 'vibrant, clean, premium, elevated version of the same scene',
    },
    lighting: {
      default: 'Left side flat unflattering light, right side warm premium lighting',
    },
  },

  negative: 'blurry divide, merged halves, inconsistent scene between sides',

  falSettings: {
    guidance_scale: 8.0,
    num_inference_steps: 35,
    image_size: { width: 1024, height: 576 },
  },
};


// ============================================================
// ALL TEMPLATES (for import)
// ============================================================

export const ALL_TEMPLATES = [
  TEMPLATE_PRODUCT_SHOT,
  TEMPLATE_LIFESTYLE,
  TEMPLATE_UGC,
  TEMPLATE_HEADLINE,
  TEMPLATE_COMPARISON,
];


// ============================================================
// PROMPT BUILDER UTILITY
// ============================================================

/**
 * Builds a final prompt from a template + variable overrides
 *
 * Usage:
 *   const prompt = buildPrompt(TEMPLATE_PRODUCT_SHOT, {
 *     product_description: 'a matte black perfume bottle with gold cap',
 *     surface_material: 'Dark slate',
 *   });
 */
export function buildPrompt(
  template: typeof TEMPLATE_PRODUCT_SHOT,
  overrides: Record<string, string> = {}
): { prompt: string; negative: string } {
  let prompt = template.prompt;

  for (const [key, config] of Object.entries(template.variables)) {
    const value = overrides[key] || (typeof config === 'string' ? config : config.default);
    prompt = prompt.replace(`{${key}}`, value);
  }

  return {
    prompt,
    negative: typeof template.negative === 'string' ? template.negative : NEGATIVE_DEFAULTS.universal,
  };
}
