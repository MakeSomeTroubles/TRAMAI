import { useState, useCallback } from 'react';
import { MODES } from './modeConfig';

export function useMode() {
  const [activeMode, setActiveMode] = useState(MODES[0].id);

  const selectMode = useCallback((modeId) => {
    setActiveMode(modeId);
  }, []);

  const currentMode = MODES.find((m) => m.id === activeMode) || MODES[0];

  return { activeMode, selectMode, currentMode, modes: MODES };
}
