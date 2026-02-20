# LuminaRetouch Chrome Extension - Project Documentation

## Overview
Chrome extension that injects into higgsfield.ai, providing professional image editing controls that generate optimized prompts for Nano Banana Pro model. Glassmorphism UI with 9 editing modes.

## Architecture
- **manifest.json** - Chrome extension manifest v3, content script injection on higgsfield.ai
- **content.js** - Main logic: MODES data, state management, rendering, Higgsfield integration
- **content.css** - Glassmorphism styling, panel layout, all UI components
- **popup.html/js** - Simple popup (status only)
- **icon16/48/128.png** - Extension icons

## 9 Modes (content.js MODES array)
1. **Retouch** (R, #F472B6) - Skin Smoothing, Spot Removal, Wrinkle Reduction, Ultra Realistic
2. **Face Swap** (F, #EC4899) - Surgical face replacement with detail/skin-tone/blending controls
3. **Composition** (C, #60A5FA) - Background Replace (2 images), Object Removal
4. **Pose Swap** (P, #A78BFA) - Multi-reference (up to 10), target image
5. **Move in Space** (M, #14B8A6) - Extend Image (direction grid), Move Object (3D room grid overlay)
6. **Color Grading** (G, #FB923C) - 7 tasks: Brightness/Contrast, Exposure, Hue/Sat, Color Balance, Replace Color, B&W, Photo Filter
7. **Create Image** (I, #34D399) - Text to Image with multi-ref, 7 styles
8. **Clone Style** (S, #FBBF24) - Multi-ref source, tags system (Camera/Lights/Treatment/Quality/Colors)
9. **Upscale** (U, #818CF8) - 2x/4x/8x with denoise slider

## Key Features
- **Face Lock** - Toggle on every task, inserts FACE_LOCK prompt for identity preservation
- **Real Skin** - Auto-appended to Ultra Realistic task
- **Negative Prompt** - Default NEG_PROMPT appended to all prompts
- **Spatial Reference** - Every prompt includes LEFT/RIGHT/TOP/BOTTOM spatial awareness
- **JSON Prompt** - Toggle between Text and JSON format output
- **Multi-Reference** - `multifile` step type, up to 10 images (Pose Swap, Create Image, Clone Style)
- **Gallery Picker** - Click images on Higgsfield page to import (Primary/Secondary/Multi-ref)
- **Auto-Unlimited** - Enables Unlimited mode before generating
- **Additive Upload** - Images uploaded sequentially to HF reference slots, not replacing
- **3D Grid** - Perspective room grid overlay on scene image, click+drag positioning
- **macOS Dots** - Red(close), Yellow(minimize), Green(enlarge +50%)
- **Output Ratio** - All 11 Higgsfield ratios on every task

## Step Types in MODES
- `file` - Primary image upload → state.imgB64
- `file2` - Secondary image → state.img2B64
- `multifile` - Multi-reference array → state.multiImgs[]
- `slider` - Range input with min/max/step
- `select` - Button group selection
- `toggle` - On/off switch (used for Face Lock, HDR)
- `prompt` - Textarea with placeholder
- `tags` - Multi-select with removable chips
- `color` - Color picker
- `direction` - 3x3 directional grid (Extend Image)
- `grid3d` - Perspective room grid overlay (Move Object)

## Higgsfield Integration Functions
- `findHFInput()` - Finds prompt textarea
- `findHFGenerateBtn()` - Finds Generate/Recreate button
- `enableUnlimited()` - Enables Unlimited toggle
- `uploadRefToHF(b64,mime)` - Uploads reference image additively
- `insertPrompt(text)` - Writes prompt to HF textarea
- `insertAndGenerate(text)` - Full flow: unlimited → ratio → prompt → upload refs → generate
- `injectToolbarButton()` - Injects 🚀 LR button next to Draw

## Known Issues / TODO
- Toolbar button injection: MutationObserver + retry every 2s. 3 strategies (Draw btn, Save/Insert area, toolbar container). May need DOM inspection if HF changes layout.
- Generate click: Double-fire (click + MouseEvent). May need adjustment if HF updates.
- Gallery picker: Uses fetch on img.src, may hit CORS on some images.
- Multi-ref upload: 800ms delay between uploads, may need tuning.

## File Paths
- Extension folder: luminaretouch-ext/
- Install: chrome://extensions → Developer mode → Load unpacked
- Test: Navigate to higgsfield.ai/image/nano_banana_2

## Prompts
- FACE_LOCK: Identity preservation prompt
- REAL_SKIN: Ultra-realistic skin rendering prompt  
- NEG_PROMPT: Default negative prompt for all generations
- Spatial: "Use LEFT/RIGHT/TOP/BOTTOM/NEAR/FAR" added to all prompts
