// TRAMAI — Default Layout Positions
// Paste into the initial flow state (Zustand store or App.tsx)
// Optimized for: 1440x900 viewport, ~240px sidebar
// Canvas area: ~1200x900
// Layout: Left-to-right pipeline, slight vertical stagger for visual interest
// All positions assume React Flow coordinate system (0,0 = top-left of canvas)

// ============================================================
// LAYOUT A — "Hero Pipeline" (for demo & screenshots)
// Shows: Brief → Text Prompt → Generate → Preview Wall
// This is the default when TRAMAI opens.
// Clean, minimal, tells the story of the tool in one glance.
// ============================================================

export const DEFAULT_HERO_LAYOUT = {
  nodes: [
    {
      id: 'brief-1',
      type: 'briefNode',
      position: { x: 80, y: 200 },
      data: {
        label: 'Brief',
        // Pre-filled with demo content (see DEMO_CONTENT.md)
      },
    },
    {
      id: 'prompt-1',
      type: 'textPromptNode',
      position: { x: 420, y: 180 },
      data: {
        label: 'Text Prompt',
      },
    },
    {
      id: 'generate-1',
      type: 'generateNode',
      position: { x: 760, y: 200 },
      data: {
        label: 'Generate',
      },
    },
    {
      id: 'preview-1',
      type: 'previewWallNode',
      position: { x: 1100, y: 140 },
      data: {
        label: 'Preview Wall',
      },
    },
  ],

  edges: [
    {
      id: 'e-brief-prompt',
      source: 'brief-1',
      target: 'prompt-1',
      sourceHandle: 'text-out',
      targetHandle: 'text-in',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#4FD1C5', strokeWidth: 2 }, // teal for text connections
    },
    {
      id: 'e-prompt-generate',
      source: 'prompt-1',
      target: 'generate-1',
      sourceHandle: 'prompt-out',
      targetHandle: 'prompt-in',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#4FD1C5', strokeWidth: 2 },
    },
    {
      id: 'e-generate-preview',
      source: 'generate-1',
      target: 'preview-1',
      sourceHandle: 'image-out',
      targetHandle: 'image-in',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#E879A8', strokeWidth: 2 }, // pink for image connections
    },
  ],
};


// ============================================================
// LAYOUT B — "Full Pipeline" (for advanced demo)
// Shows the full production flow with post-processing
// Brief → Prompt → Generate → Variations → Upscale → Preview Wall
//                                        → Color Grade ↗
// Use this if all nodes are working
// ============================================================

export const DEFAULT_FULL_LAYOUT = {
  nodes: [
    // Row 1: Main pipeline (y: ~180-220)
    {
      id: 'brief-1',
      type: 'briefNode',
      position: { x: 80, y: 220 },
      data: { label: 'Brief' },
    },
    {
      id: 'prompt-1',
      type: 'textPromptNode',
      position: { x: 380, y: 200 },
      data: { label: 'Text Prompt' },
    },
    {
      id: 'generate-1',
      type: 'generateNode',
      position: { x: 680, y: 220 },
      data: { label: 'Generate' },
    },

    // Row 2: Post-processing branch (y: ~100 and ~380)
    {
      id: 'variations-1',
      type: 'variationsNode',
      position: { x: 980, y: 100 },
      data: { label: 'Variations' },
    },
    {
      id: 'upscale-1',
      type: 'upscaleNode',
      position: { x: 980, y: 340 },
      data: { label: 'Upscale' },
    },

    // Row 3: Final output
    {
      id: 'preview-1',
      type: 'previewWallNode',
      position: { x: 1280, y: 180 },
      data: { label: 'Preview Wall' },
    },
  ],

  edges: [
    {
      id: 'e-brief-prompt',
      source: 'brief-1',
      target: 'prompt-1',
      sourceHandle: 'text-out',
      targetHandle: 'text-in',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#4FD1C5', strokeWidth: 2 },
    },
    {
      id: 'e-prompt-generate',
      source: 'prompt-1',
      target: 'generate-1',
      sourceHandle: 'prompt-out',
      targetHandle: 'prompt-in',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#4FD1C5', strokeWidth: 2 },
    },
    {
      id: 'e-generate-variations',
      source: 'generate-1',
      target: 'variations-1',
      sourceHandle: 'image-out',
      targetHandle: 'image-in',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#E879A8', strokeWidth: 2 },
    },
    {
      id: 'e-generate-upscale',
      source: 'generate-1',
      target: 'upscale-1',
      sourceHandle: 'image-out',
      targetHandle: 'image-in',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#E879A8', strokeWidth: 2 },
    },
    {
      id: 'e-variations-preview',
      source: 'variations-1',
      target: 'preview-1',
      sourceHandle: 'image-out',
      targetHandle: 'image-in',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#E879A8', strokeWidth: 2 },
    },
    {
      id: 'e-upscale-preview',
      source: 'upscale-1',
      target: 'preview-1',
      sourceHandle: 'image-out',
      targetHandle: 'image-in',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#E879A8', strokeWidth: 2 },
    },
  ],
};


// ============================================================
// LAYOUT NOTES
// ============================================================
//
// Spacing logic:
// - Horizontal gap between nodes: ~300px (enough for connection curves)
// - Vertical stagger: ±20-40px (breaks monotony, feels organic)
// - Branching nodes: offset ±120-160px vertically from main line
//
// For screenshots:
// - Layout A fits perfectly in a single 1440x900 screenshot
// - Layout B may need slight zoom out (0.85-0.9) to fit
// - The left-to-right flow reads naturally (Western reading direction)
// - Vertical stagger creates depth and visual interest
//
// Node sizes (approximate, depends on content):
// - Brief: ~280w x 200h
// - Text Prompt: ~260w x 180h
// - Generate: ~260w x 280h (includes image preview)
// - Preview Wall: ~320w x 360h (grid of thumbnails)
// - Variations: ~260w x 200h
// - Upscale: ~240w x 180h
//
// React Flow default viewport:
// - Set defaultViewport={{ x: 0, y: 0, zoom: 1 }} for consistent opening
// - Or use fitView with padding: <ReactFlow fitView fitViewOptions={{ padding: 0.15 }} />
// - fitView is safer if node sizes vary
