import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Copy } from 'lucide-react';
import NodeShell from '../components/NodeShell';
import useWorkflowStore from '../store/workflowStore';

export default function VariationsNode({ id, data }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nd = data.nodeData || {};
  const [btnState, setBtnState] = useState('idle');

  const numVariations = nd.numVariations || 3;
  const strength = nd.variationStrength || 50;

  const update = useCallback(
    (patch) => updateNodeData(id, patch),
    [id, updateNodeData]
  );

  const handleClick = useCallback(() => {
    if (btnState !== 'idle') return;
    setBtnState('processing');
    updateNodeData(id, { executionStatus: 'running' });
    setTimeout(() => {
      setBtnState('no-api');
      updateNodeData(id, { executionStatus: 'error', error: 'No API connected' });
      setTimeout(() => {
        setBtnState('idle');
        updateNodeData(id, { executionStatus: 'idle', error: null });
      }, 2000);
    }, 2000);
  }, [btnState, id, updateNodeData]);

  return (
    <NodeShell id={id} icon={Copy} title="Variations" color="#e8a848">
      <div>
        <label className="node-label">Num Variations</label>
        <div className="flex gap-1">
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => update({ numVariations: n })}
              className={`node-option-btn ${numVariations === n ? 'active' : ''}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="node-label">Variation Strength — {strength}%</label>
        <input
          type="range"
          min={0}
          max={100}
          value={strength}
          onChange={(e) => update({ variationStrength: parseInt(e.target.value) })}
          className="w-full accent-[#4FD1C5]"
          style={{ height: 4 }}
        />
      </div>

      <button
        className="node-btn-primary w-full"
        onClick={handleClick}
        disabled={btnState !== 'idle'}
      >
        {btnState === 'processing' ? 'Processing...' : btnState === 'no-api' ? 'No API connected' : 'Generate Variations'}
      </button>

      <div
        className="rounded-xl grid grid-cols-2 gap-1 p-1"
        style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', minHeight: 80 }}
      >
        {Array.from({ length: numVariations }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg flex items-center justify-center text-[10px]"
            style={{ background: 'rgba(0,0,0,0.03)', color: '#d1d5db', aspectRatio: '1', minHeight: 50 }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      <Handle type="target" position={Position.Left} id="image" style={{ top: '50%', background: '#E879A8', border: '2px solid #E879A8' }} />
      <Handle type="source" position={Position.Right} id="variations" style={{ background: '#E879A8', border: '2px solid #E879A8' }} />
    </NodeShell>
  );
}
