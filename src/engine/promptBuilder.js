const styleMap = {
  Editorial: 'High-end editorial photography.',
  Beauty: 'Beauty campaign photograph, skin detail preserved.',
  Street: 'Urban street photography, candid energy.',
  Cinematic: 'Cinematic still frame, dramatic lighting.',
  Product: 'Clean product photography, studio lighting.',
  Minimal: 'Minimalist composition, negative space.',
};

export function buildPrompt({ rawPrompt, briefData, nodeSettings }) {
  const parts = [];

  // Style prefix from Brief
  if (briefData?.style && briefData.style !== 'Custom' && styleMap[briefData.style]) {
    parts.push(styleMap[briefData.style]);
  }

  // The user's actual prompt
  if (rawPrompt) {
    parts.push(rawPrompt);
  }

  // Mood keywords
  if (briefData?.moods?.length) {
    parts.push(`Mood: ${briefData.moods.join(', ')}.`);
  }

  // Color palette
  if (briefData?.colors?.length) {
    const validColors = briefData.colors.filter((c) => c && c !== '#000000');
    if (validColors.length > 0) {
      const colorDesc = validColors.slice(0, 3).join(', ');
      parts.push(`Dominant color palette: ${colorDesc}.`);
    }
  }

  // Brand name mention
  if (briefData?.brandName) {
    parts.push(`Brand: ${briefData.brandName}.`);
  }

  return parts.join(' ');
}
