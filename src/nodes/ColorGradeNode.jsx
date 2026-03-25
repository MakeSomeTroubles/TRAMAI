import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Palette, ImageIcon } from 'lucide-react';
import NodeShell from '../components/NodeShell';
import useWorkflowStore from '../store/workflowStore';

const PRESETS = ['Warm', 'Cool', 'Cinematic', 'Vintage', 'B&W'];

export default function ColorGradeNode({ id, data }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nd = data.nodeData || {};
  const [btnState, setBtnState] = useState('idle');

  const preset = nd.preset || 'Warm';
  const intensity = nd.intensity || 50;
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
    <NodeShell id={id} icon={Palette} title="Color Grade" color="#8888a0">
      <div>
        <label className="node-label">Preset</label>
        <select
          value={preset}
          onChange={(e) => update({ preset: e.target.value })}
          className="node-select"
        >
          {PRESETS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="node-label">Intensity — {intensity}%</label>
        <input
          type="range"
          min={0}
          max={100}
          value={intensity}
          onChange={(e) => update({ intensity: parseInt(e.target.value) })}
          className="w-full accent-[#4FD1C5]"
          style={{ height: 4 }}
        />
      </div>

      <button
        className="node-btn-primary w-full"
        onClick={handleClick}
        disabled={btnState !== 'idle'}
      >
        {btnState === 'processing' ? 'Processing...' : btnState === 'no-api' ? 'No API connected' : 'Apply'}
      </button>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', minHeight: 60 }}
      >
        {outputImage ? (
          <img src={outputImage} alt="Graded" className="w-full h-auto block" style={{ maxHeight: 200 }} />
        ) : (
          <div className="flex items-center justify-center py-4">
            <ImageIcon size={18} style={{ color: '#d1d5db' }} />
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} id="image" style={{ top: '50%', background: '#E879A8', border: '2px solid #E879A8' }} />
      <Handle type="source" position={Position.Right} id="graded" style={{ background: '#E879A8', border: '2px solid #E879A8' }} />
    </NodeShell>
  );
}
