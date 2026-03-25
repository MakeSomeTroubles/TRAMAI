import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { LayoutGrid } from 'lucide-react';
import NodeShell from '../components/NodeShell';
import useWorkflowStore from '../store/workflowStore';

export default function BatchNode({ id, data }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nd = data.nodeData || {};
  const [btnState, setBtnState] = useState('idle');

  const batchSize = nd.batchSize || 4;
  const completed = nd.completedCount || 0;
  const isRunning = nd.executionStatus === 'running';

  const update = useCallback(
    (patch) => updateNodeData(id, patch),
    [id, updateNodeData]
  );

  const progress = batchSize > 0 ? (completed / batchSize) * 100 : 0;

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
    <NodeShell id={id} icon={LayoutGrid} title="Batch" color="#e8a848">
      <div>
        <label className="node-label">Batch Size</label>
        <input
          type="number"
          min={1}
          max={20}
          value={batchSize}
          onChange={(e) => update({ batchSize: parseInt(e.target.value) || 1 })}
          className="node-input"
        />
      </div>

      <button
        className="node-btn-primary w-full"
        onClick={handleClick}
        disabled={btnState !== 'idle'}
      >
        {btnState === 'processing' ? 'Processing...' : btnState === 'no-api' ? 'No API connected' : 'Run Batch'}
      </button>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px]" style={{ color: '#6b7280' }}>
            {isRunning ? `${completed} of ${batchSize} completed` : 'Ready'}
          </span>
          <span className="text-[10px] font-medium" style={{ color: '#9ca3af' }}>{Math.round(progress)}%</span>
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(0,0,0,0.06)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: '#4FD1C5' }}
          />
        </div>
      </div>

      <Handle type="target" position={Position.Left} id="prompt" style={{ top: '40%', background: '#4FD1C5', border: '2px solid #4FD1C5' }} />
      <Handle type="target" position={Position.Left} id="briefData" style={{ top: '60%', background: '#F6B93B', border: '2px solid #F6B93B' }} />
      <Handle type="source" position={Position.Right} id="images" style={{ background: '#E879A8', border: '2px solid #E879A8' }} />
    </NodeShell>
  );
}
