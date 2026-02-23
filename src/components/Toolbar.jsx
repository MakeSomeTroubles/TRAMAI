export default function Toolbar({ currentMode, image }) {
  return (
    <header className="h-10 bg-panel border-b border-border flex items-center px-4 justify-between select-none">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-accent tracking-wide uppercase">TRAMAI</span>
        <span className="text-border">|</span>
        <span className="text-xs text-text-secondary">{currentMode.label}</span>
      </div>

      <div className="flex items-center gap-4 text-xs text-text-secondary">
        {image && (
          <span className="text-text-muted">Ready</span>
        )}
        <button className="hover:text-text-primary transition-colors cursor-pointer bg-transparent border-0 text-xs text-text-secondary p-0">
          Export
        </button>
      </div>
    </header>
  );
}
