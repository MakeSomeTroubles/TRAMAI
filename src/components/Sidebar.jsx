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
    color: '#4FD1C5',
    nodes: [
      { type: 'briefNode', icon: FileText, label: 'Brief', desc: 'Project brief & brand settings' },
      { type: 'imageUploadNode', icon: ImageUp, label: 'Image Upload', desc: 'Upload reference images' },
      { type: 'textPromptNode', icon: Type, label: 'Text Prompt', desc: 'Write image generation prompt' },
    ],
  },
  {
    label: 'GENERATE',
    color: '#e8a848',
    nodes: [
      { type: 'generateNode', icon: Sparkles, label: 'Generate', desc: 'AI image generation' },
      { type: 'variationsNode', icon: Copy, label: 'Variations', desc: 'Create image variations' },
      { type: 'batchNode', icon: LayoutGrid, label: 'Batch', desc: 'Batch generation pipeline' },
    ],
  },
  {
    label: 'REFINE',
    color: '#8888a0',
    nodes: [
      { type: 'retouchNode', icon: PenTool, label: 'Retouch', desc: 'AI-powered retouching' },
      { type: 'upscaleNode', icon: Maximize, label: 'Upscale', desc: 'Upscale resolution' },
      { type: 'faceSwapNode', icon: UserRound, label: 'Face Swap', desc: 'Swap faces in images' },
      { type: 'colorGradeNode', icon: Palette, label: 'Color Grade', desc: 'Color correction & grading' },
    ],
  },
  {
    label: 'OUTPUT',
    color: '#4ead6a',
    nodes: [
      { type: 'previewWallNode', icon: LayoutDashboard, label: 'Preview', desc: 'Preview all outputs' },
      { type: 'exportNode', icon: Download, label: 'Export', desc: 'Export final assets' },
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
      className="flex flex-col shrink-0 overflow-y-auto"
      style={{
        width: 240,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[13px] font-semibold" style={{ color: '#1a1a2e' }}>Node Types</h2>
        <p className="text-[11px] mt-0.5" style={{ color: '#9ca3af' }}>Drag nodes to the canvas</p>
      </div>

      {NODE_GROUPS.map((group, gi) => (
        <div key={group.label} className="px-3 pb-1">
          {gi > 0 && (
            <div className="my-2 border-t" style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }} />
          )}
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.1em] px-1 mb-1 block"
            style={{ color: group.color }}
          >
            {group.label}
          </span>

          {group.nodes.map(({ type, icon: Icon, label, desc }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => onDragStart(e, type)}
              className="flex items-start gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all cursor-grab hover:bg-black/[0.03] active:cursor-grabbing active:scale-[0.98]"
              title={`Drag to add ${label}`}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background: `${group.color}12`,
                  border: `1px solid ${group.color}25`,
                }}
              >
                <Icon size={16} style={{ color: group.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[12px] font-medium block leading-tight" style={{ color: '#1a1a2e' }}>
                  {label}
                </span>
                <span className="text-[10px] block leading-tight mt-0.5" style={{ color: '#9ca3af' }}>
                  {desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}
