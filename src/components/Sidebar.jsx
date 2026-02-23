import ModeIcon from './ModeIcon';

export default function Sidebar({ modes, activeMode, onSelectMode }) {
  return (
    <aside className="w-16 bg-panel flex flex-col items-center py-3 border-r border-border">
      <div className="mb-4 flex items-center justify-center w-10 h-10 rounded-lg bg-accent text-white font-bold text-sm select-none">
        T
      </div>

      <nav className="flex-1 flex flex-col gap-1 w-full px-1.5">
        {modes.map((mode) => {
          const isActive = mode.id === activeMode;
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              title={`${mode.label} (${mode.shortcut})`}
              className={`
                group relative flex flex-col items-center justify-center
                w-full aspect-square rounded-lg transition-all duration-150
                cursor-pointer border-0 outline-none
                ${isActive
                  ? 'bg-accent/20 text-accent'
                  : 'text-text-secondary hover:bg-panel-lighter hover:text-text-primary'
                }
              `}
            >
              <ModeIcon icon={mode.icon} />
              <span className="text-[9px] mt-0.5 leading-tight truncate w-full text-center">
                {mode.label}
              </span>

              {/* Tooltip */}
              <div className="
                absolute left-full ml-2 px-2.5 py-1.5 rounded-md
                bg-panel-lighter text-text-primary text-xs whitespace-nowrap
                opacity-0 pointer-events-none group-hover:opacity-100
                transition-opacity duration-150 z-50 shadow-lg border border-border
              ">
                {mode.description}
                <span className="ml-2 text-text-muted font-mono">{mode.shortcut}</span>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
