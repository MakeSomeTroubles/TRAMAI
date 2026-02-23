export default function StatusBar({ image }) {
  return (
    <footer className="h-6 bg-panel border-t border-border flex items-center px-4 justify-between text-[10px] text-text-muted select-none">
      <span>{image ? 'Image loaded' : 'No image'}</span>
      <span>TRAMAI v0.1.0</span>
    </footer>
  );
}
