import { MoreHorizontal } from 'lucide-react';
import { useState, useCallback } from 'react';
import useWorkflowStore from '../store/workflowStore';

const statusColors = {
  idle: 'bg-text-muted',
  running: 'bg-status-running animate-pulse',
  done: 'bg-status-done',
  error: 'bg-status-error',
};

export default function NodeShell({ id, icon: Icon, title, color, children, width = 280 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const nodeData = useWorkflowStore((s) => {
    const node = s.nodes.find((n) => n.id === id);
    return node?.data?.nodeData || {};
  });

  const status = nodeData.executionStatus || 'idle';
  const error = nodeData.error;

  const handleDelete = useCallback(() => {
    deleteNode(id);
    setMenuOpen(false);
  }, [id, deleteNode]);

  return (
    <div
      className="rounded-xl border border-node-border shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden"
      style={{ width, background: 'var(--color-node-bg)' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 select-none"
        style={{ background: 'var(--color-node-header)' }}
      >
        <div className={`w-2 h-2 rounded-full ${statusColors[status]} shrink-0`} />
        {Icon && <Icon size={14} style={{ color }} className="shrink-0" />}
        <span
          className="text-[13px] font-semibold flex-1 truncate"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title}
        </span>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-0.5 rounded hover:bg-white/5 text-text-muted hover:text-text-secondary transition-colors cursor-pointer bg-transparent border-0"
          >
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 bg-node-header border border-node-border rounded-lg py-1 shadow-xl min-w-[120px]">
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-1.5 text-xs text-status-error hover:bg-white/5 cursor-pointer bg-transparent border-0"
                >
                  Delete Node
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-3 space-y-3">{children}</div>

      {/* Error display */}
      {status === 'error' && error && (
        <div className="px-3 pb-2">
          <div className="text-[11px] text-status-error bg-status-error/10 rounded px-2 py-1.5 break-words">
            {error}
          </div>
        </div>
      )}

      {/* Running indicator */}
      {status === 'running' && (
        <div className="px-3 pb-2">
          <div className="execution-bar">
            <div className="spinner" />
            <span>Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
