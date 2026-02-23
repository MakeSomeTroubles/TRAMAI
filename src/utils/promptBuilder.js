/**
 * Builds an AI prompt payload based on the current mode and user-selected parameters.
 */
export function buildPrompt(mode, params = {}) {
  const base = {
    mode: mode.id,
    strength: params.strength ?? 0.5,
    preserveDetails: params.preserveDetails ?? true,
  };

  switch (mode.id) {
    case 'enhance':
      return { ...base, autoColor: true, autoContrast: true, ...params };
    case 'retouch':
      return { ...base, smoothness: params.smoothness ?? 0.6, ...params };
    case 'background':
      return { ...base, action: params.action ?? 'remove', ...params };
    case 'upscale':
      return { ...base, scale: params.scale ?? 2, ...params };
    case 'generative-fill':
      return { ...base, prompt: params.prompt ?? '', mask: params.mask, ...params };
    case 'color-grade':
      return { ...base, lut: params.lut ?? 'cinematic', ...params };
    case 'denoise':
      return { ...base, level: params.level ?? 'medium', ...params };
    case 'object-remove':
      return { ...base, selection: params.selection, ...params };
    case 'style-transfer':
      return { ...base, style: params.style ?? 'oil-painting', ...params };
    default:
      return base;
  }
}
