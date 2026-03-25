import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Download } from 'lucide-react';
import NodeShell from '../components/NodeShell';
import useWorkflowStore from '../store/workflowStore';

const FORMATS = ['PNG', 'JPG', 'WEBP'];

export default function ExportNode({ id, data }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nd = data.nodeData || {};
  const [btnState, setBtnState] = useState('idle');

  const format = nd.format || 'PNG';
  const quality = nd.quality || 90;

  const update = useCallback(
    (patch) => updateNodeData(id, patch),
    [id, updateNodeData]
  );

  // Check for upstream image
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const incomingEdge = edges.find((e) => e.target === id);
  const srcNode = incomingEdge ? nodes.find((n) => n.id === incomingEdge.source) : null;
  const upstreamImage = srcNode?.data?.nodeData?.outputImage || srcNode?.data?.nodeData?.uploadedImage || null;

  const handleDownload = useCallback(() => {
    if (upstreamImage) {
      // Real download of connected image
      const a = document.createElement('a');
      a.href = upstreamImage;
      a.download = `export.${format.toLowerCase()}`;
      a.click();
      return;
    }
    if (btnState !== 'idle') return;
    setBtnState('processing');
    updateNodeData(id, { executionStatus: 'running' });
    setTimeout(() => {
      setBtnState('no-api');
      updateNodeData(id, { executionStatus: 'error', error: 'No image connected' });
      setTimeout(() => {
        setBtnState('idle');
        updateNodeData(id, { executionStatus: 'idle', error: null });
      }, 2000);
    }, 2000);
  }, [btnState, id, updateNodeData, upstreamImage, format]);

  return (
    <NodeShell id={id} icon={Download} title="Export" color="#4ead6a">
      <div>
        <label className="node-label">Format</label>
        <div className="flex gap-1">
          {FORMATS.map((f) => (
            <button
              key={f}
              onClick={() => update({ format: f })}
              className={`node-option-btn ${format === f ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="node-label">Quality — {quality}%</label>
        <input
          type="range"
          min={10}
          max={100}
          value={quality}
          onChange={(e) => update({ quality: parseInt(e.target.value) })}
          className="w-full accent-[#4FD1C5]"
          style={{ height: 4 }}
        />
      </div>

      <button
        className="node-btn-primary w-full"
        onClick={handleDownload}
        disabled={btnState === 'processing'}
      >
        <span className="flex items-center justify-center gap-1.5">
          <Download size={12} />
          {btnState === 'processing' ? 'Processing...' : btnState === 'no-api' ? 'No image connected' : 'Download'}
        </span>
      </button>

      <Handle type="target" position={Position.Left} id="image" style={{ top: '50%', background: '#E879A8', border: '2px solid #E879A8' }} />
    </NodeShell>
  );
}
