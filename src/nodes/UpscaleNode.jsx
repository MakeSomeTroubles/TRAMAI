import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Maximize, ImageIcon } from 'lucide-react';
import NodeShell from '../components/NodeShell';
import useWorkflowStore from '../store/workflowStore';

export default function UpscaleNode({ id, data }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nd = data.nodeData || {};
  const [btnState, setBtnState] = useState('idle');

  const scale = nd.scale || '2x';
  const outputImage = nd.outputImage || null;

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
    <NodeShell id={id} icon={Maximize} title="Upscale" color="#8888a0">
      <div>
        <label className="node-label">Scale</label>
        <div className="flex gap-1">
          {['2x', '4x'].map((s) => (
            <button
              key={s}
              onClick={() => update({ scale: s })}
              className={`node-option-btn ${scale === s ? 'active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button
        className="node-btn-primary w-full"
        onClick={handleClick}
        disabled={btnState !== 'idle'}
      >
        {btnState === 'processing' ? 'Processing...' : btnState === 'no-api' ? 'No API connected' : 'Upscale'}
      </button>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', minHeight: 80 }}
      >
        {outputImage ? (
          <img src={outputImage} alt="Upscaled" className="w-full h-auto block" style={{ maxHeight: 200 }} />
        ) : (
          <div className="flex flex-col items-center justify-center py-6 gap-1">
            <ImageIcon size={20} style={{ color: '#d1d5db' }} />
            <span className="text-[10px]" style={{ color: '#9ca3af' }}>Result</span>
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} id="image" style={{ top: '50%', background: '#E879A8', border: '2px solid #E879A8' }} />
      <Handle type="source" position={Position.Right} id="upscaled" style={{ background: '#E879A8', border: '2px solid #E879A8' }} />
    </NodeShell>
  );
}
