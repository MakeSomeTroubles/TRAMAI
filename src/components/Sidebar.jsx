import {
  FileText,
  ImageUp,
  Type,
  Sparkles,
  Copy,
  LayoutGrid,
  PenTool,
  Maximize,
  UserRound,
  Palette,
  LayoutDashboard,
  Download,
} from 'lucide-react';

const NODE_GROUPS = [
  {
    label: 'INPUT',
    color: 'var(--color-accent)',
    nodes: [
      { type: 'briefNode', icon: FileText, label: 'Brief' },
      { type: 'imageUploadNode', icon: ImageUp, label: 'Image Upload', disabled: true },
      { type: 'textPromptNode', icon: Type, label: 'Text Prompt' },
    ],
  },
  {
    label: 'GENERATE',
    color: 'var(--color-status-running)',
    nodes: [
      { type: 'generateNode', icon: Sparkles, label: 'Generate' },
      { type: 'variationsNode', icon: Copy, label: 'Variations', disabled: true },
      { type: 'batchNode', icon: LayoutGrid, label: 'Batch', disabled: true },
    ],
  },
  {
    label: 'REFINE',
    color: 'var(--color-text-secondary)',
    nodes: [
      { type: 'retouchNode', icon: PenTool, label: 'Retouch', disabled: true },
      { type: 'upscaleNode', icon: Maximize, label: 'Upscale', disabled: true },
      { type: 'faceSwapNode', icon: UserRound, label: 'Face Swap', disabled: true },
      { type: 'colorGradeNode', icon: Palette, label: 'Color Grade', disabled: true },
    ],
  },
  {
    label: 'OUTPUT',
    color: 'var(--color-status-done)',
    nodes: [
      { type: 'previewWallNode', icon: LayoutDashboard, label: 'Preview', disabled: true },
      { type: 'exportNode', icon: Download, label: 'Export', disabled: true },
    ],
  },
];

export default function Sidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/tramai-node', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside
      className="w-16 flex flex-col py-2 border-r shrink-0 overflow-y-auto"
      style={{
        background: 'var(--color-sidebar-bg)',
        borderColor: 'var(--color-node-border)',
      }}
    >
      {NODE_GROUPS.map((group, gi) => (
        <div key={group.label}>
          {gi > 0 && (
            <div className="mx-3 my-1.5 border-t" style={{ borderColor: 'var(--color-node-border)' }} />
          )}
          {group.nodes.map(({ type, icon: Icon, label, disabled }) => (
            <div
              key={type}
              draggable={!disabled}
              onDragStart={(e) => onDragStart(e, type)}
              className={`group relative flex flex-col items-center justify-center py-2 mx-1 rounded-lg transition-colors ${
                disabled
                  ? 'opacity-30 cursor-not-allowed'
                  : 'cursor-grab hover:bg-white/5 active:cursor-grabbing'
              }`}
              title={disabled ? `${label} (Phase 2/3)` : label}
            >
              <Icon
                size={18}
                style={{ color: disabled ? 'var(--color-text-muted)' : group.color }}
              />
              <span
                className="text-[9px] mt-0.5 leading-tight"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {label}
              </span>

              {/* Tooltip */}
              {!disabled && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded bg-node-header border border-node-border text-[11px] text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                  Drag to add {label}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}
