import { useState, useCallback, useEffect } from 'react';
import { useMode } from './modes/useMode';
import { fileToBase64 } from './utils/helpers';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import StatusBar from './components/StatusBar';

export default function App() {
  const { activeMode, selectMode, currentMode, modes } = useMode();
  const [image, setImage] = useState(null);

  const handleImageLoad = useCallback(async (file) => {
    const dataUrl = await fileToBase64(file);
    setImage(dataUrl);
  }, []);

  // Keyboard shortcuts for mode switching
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const mode = modes.find((m) => m.shortcut.toLowerCase() === e.key.toLowerCase());
      if (mode) selectMode(mode.id);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modes, selectMode]);

  return (
    <div className="h-screen w-screen flex flex-col bg-surface text-text-primary">
      <Toolbar currentMode={currentMode} image={image} />

      <div className="flex flex-1 min-h-0">
        <Sidebar modes={modes} activeMode={activeMode} onSelectMode={selectMode} />
        <Canvas image={image} onImageLoad={handleImageLoad} />
        <PropertiesPanel currentMode={currentMode} />
      </div>

      <StatusBar image={image} />
    </div>
  );
}
