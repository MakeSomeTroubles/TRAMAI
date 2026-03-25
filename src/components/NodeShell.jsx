import { MoreHorizontal, CheckCircle, XCircle, Copy, Unplug } from 'lucide-react';
import { useState, useCallback, useEffect, useRef } from 'react';
import useWorkflowStore from '../store/workflowStore';

const statusDotColors = {
  idle: 'node-status-dot-idle',
  running: 'node-status-dot-running',
  done: 'node-status-dot-done',
  error: 'node-status-dot-error',
};

export default function NodeShell({ id, icon: Icon, title, color, children, width = 280 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSuccessFlash, setShowSuccessFlash] = useState(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);
  const prevStatusRef = useRef('idle');
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const addNode = useWorkflowStore((s) => s.addNode);
  const node = useWorkflowStore((s) => s.nodes.find((n) => n.id === id));
  const nodeData = node?.data?.nodeData || {};
  const isSelected = node?.selected || false;

  const status = nodeData.executionStatus || 'idle';
  const error = nodeData.error;

  // Track status transitions for flash effects
  useEffect(() => {
    if (prevStatusRef.current === 'running' && status === 'done') {
      setShowSuccessFlash(true);
      setShowSuccessBadge(true);
      setTimeout(() => setShowSuccessFlash(false), 600);
      setTimeout(() => setShowSuccessBadge(false), 4000);
    }
    prevStatusRef.current = status;
  }, [status]);

  const handleDelete = useCallback(() => {
    deleteNode(id);
    setMenuOpen(false);
  }, [id, deleteNode]);

  const handleDuplicate = useCallback(() => {
    if (!node) return;
    const newPos = { x: node.position.x + 30, y: node.position.y + 30 };
    const newId = addNode(node.type, newPos);
    // Copy node data to new node
    if (node.data.nodeData) {
      useWorkflowStore.getState().updateNodeData(newId, { ...node.data.nodeData });
    }
    setMenuOpen(false);
  }, [id, node, addNode]);

  const handleDisconnect = useCallback(() => {
    const edges = useWorkflowStore.getState().edges;
    const connectedEdges = edges.filter((e) => e.source === id || e.target === id);
    if (connectedEdges.length > 0) {
      useWorkflowStore.setState({
        edges: edges.filter((e) => e.source !== id && e.target !== id),
      });
    }
    setMenuOpen(false);
  }, [id]);

  // Compute border style based on status
  const getBorderStyle = () => {
    if (status === 'running') return '1.5px solid rgba(79, 209, 197, 0.6)';
    if (status === 'error') return '1.5px solid rgba(212, 84, 84, 0.4)';
    if (showSuccessFlash) return '1.5px solid rgba(78, 173, 106, 0.5)';
    if (isSelected) return '1.5px solid rgba(79, 209, 197, 0.4)';
    return '1px solid rgba(0, 0, 0, 0.08)';
  };

  const getBoxShadow = () => {
    if (status === 'running') return '0 0 20px rgba(79, 209, 197, 0.15), 0 2px 16px rgba(0, 0, 0, 0.06)';
    if (status === 'error') return '0 0 16px rgba(212, 84, 84, 0.1), 0 2px 16px rgba(0, 0, 0, 0.06)';
    if (showSuccessFlash) return '0 0 20px rgba(78, 173, 106, 0.15), 0 2px 16px rgba(0, 0, 0, 0.06)';
    if (isSelected) return '0 0 16px rgba(79, 209, 197, 0.1), 0 2px 16px rgba(0, 0, 0, 0.06)';
    return '0 2px 16px rgba(0, 0, 0, 0.06)';
  };

  return (
    <div
      className={`node-shell ${status === 'running' ? 'node-shell-processing' : ''} ${showSuccessFlash ? 'node-shell-success-flash' : ''}`}
      style={{
        width,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: getBorderStyle(),
        borderRadius: '20px',
        boxShadow: getBoxShadow(),
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Success badge */}
      {showSuccessBadge && (
        <div
          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium node-badge-appear"
          style={{ position: 'absolute', top: '-8px', right: '-8px', zIndex: 20, whiteSpace: 'nowrap', background: 'rgba(78, 173, 106, 0.9)', color: 'white' }}
        >
          <CheckCircle size={8} />
          success
        </div>
      )}

      {/* Error badge */}
      {status === 'error' && (
        <div
          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium"
          style={{ position: 'absolute', top: '-8px', right: '-8px', zIndex: 20, whiteSpace: 'nowrap', background: 'rgba(212, 84, 84, 0.9)', color: 'white' }}
        >
          <XCircle size={8} />
          failed
        </div>
      )}

      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 select-none"
        style={{
          background: 'rgba(0, 0, 0, 0.02)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className={`w-2 h-2 rounded-full ${statusDotColors[status]} shrink-0`} />
        {Icon && <Icon size={14} style={{ color }} className="shrink-0" />}
        <span className="text-[13px] font-semibold flex-1 truncate" style={{ color: '#1a1a2e' }}>
          {title}
        </span>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-0.5 rounded hover:bg-black/5 transition-colors cursor-pointer bg-transparent border-0"
            style={{ color: '#9ca3af' }}
          >
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 top-full mt-1 z-20 py-1 min-w-[140px]"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <button
                  onClick={handleDuplicate}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-black/5 cursor-pointer bg-transparent border-0 flex items-center gap-2"
                  style={{ color: '#1a1a2e' }}
                >
                  <Copy size={11} />
                  Duplicate
                </button>
                <button
                  onClick={handleDisconnect}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-black/5 cursor-pointer bg-transparent border-0 flex items-center gap-2"
                  style={{ color: '#6b7280' }}
                >
                  <Unplug size={11} />
                  Disconnect
                </button>
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', margin: '2px 0' }} />
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-black/5 cursor-pointer bg-transparent border-0"
                  style={{ color: '#d45454' }}
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
          <div className="text-[11px] rounded px-2 py-1.5 break-words" style={{ color: '#d45454', background: 'rgba(212, 84, 84, 0.08)' }}>
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
