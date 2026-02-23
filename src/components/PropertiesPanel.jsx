export default function PropertiesPanel({ currentMode }) {
  return (
    <aside className="w-64 bg-panel border-l border-border flex flex-col">
      {/* Mode header */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-medium text-text-primary">{currentMode.label}</h3>
        <p className="text-xs text-text-muted mt-0.5">{currentMode.description}</p>
      </div>

      {/* Properties */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        <div className="space-y-4">
          {/* Strength slider */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <label className="text-text-secondary">Strength</label>
              <span className="text-text-muted font-mono">50%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              className="w-full h-1 bg-panel-lighter rounded-full appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* Preserve details toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Preserve Details</span>
            <div className="w-8 h-4 bg-accent rounded-full relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>

          <hr className="border-border" />

          {/* Placeholder for mode-specific controls */}
          <p className="text-[11px] text-text-muted italic">
            Select an image to adjust {currentMode.label.toLowerCase()} settings.
          </p>
        </div>
      </div>

      {/* Apply button */}
      <div className="px-4 py-3 border-t border-border">
        <button className="w-full py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-lg transition-colors cursor-pointer border-0">
          Apply {currentMode.label}
        </button>
      </div>
    </aside>
  );
}
