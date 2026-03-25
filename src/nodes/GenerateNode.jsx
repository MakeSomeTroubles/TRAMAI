import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Sparkles, RefreshCw, ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import NodeShell from '../components/NodeShell';
import useWorkflowStore from '../store/workflowStore';
import { executeSingleNode } from '../engine/executor';

const BACKENDS = [
  { id: 'huggingface', label: 'HuggingFace (FLUX.1)' },
  { id: 'fal', label: 'Fal.ai (Flux Pro)' },
  { id: 'google', label: 'Google (Imagen)' },
];

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:5', '3:2'];

export default function GenerateNode({ id, data }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const setExecutionStatus = useWorkflowStore((s) => s.setExecutionStatus);
  const nd = data.nodeData || {};

  const backend = nd.backend || 'huggingface';
  const aspectRatio = nd.aspectRatio || '1:1';
  const outputImage = nd.outputImage || null;
  const executionTime = nd.executionTime || null;
  const execStatus = nd.executionStatus || 'idle';
  const error = nd.error || '';

  const update = useCallback(
    (patch) => updateNodeData(id, patch),
    [id, updateNodeData]
  );

  const handleGenerate = useCallback(async () => {
    await executeSingleNode(id, nodes, edges, updateNodeData, setExecutionStatus);
  }, [id, nodes, edges, updateNodeData, setExecutionStatus]);

  return (
    <NodeShell id={id} icon={Sparkles} title="Generate" color="#e8a848">
      <div>
        <label className="node-label">Model</label>
        <select
          value={backend}
          onChange={(e) => update({ backend: e.target.value })}
          className="node-select"
        >
          {BACKENDS.map((b) => (
            <option key={b.id} value={b.id}>{b.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="node-label">Aspect Ratio</label>
        <div className="flex gap-1">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio}
              onClick={() => update({ aspectRatio: ratio })}
              className={`node-option-btn ${aspectRatio === ratio ? 'active' : ''}`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={execStatus === 'running'}
        className="node-btn-primary w-full"
      >
        {execStatus === 'running' ? 'Generating...' : 'Generate'}
      </button>

      {/* Result area */}
      <div
        className="rounded-xl overflow-hidden relative"
        style={{
          background: 'rgba(0,0,0,0.03)',
          border: '1px solid rgba(0,0,0,0.06)',
          minHeight: 140,
        }}
      >
        {execStatus === 'running' && (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <div className="spinner" style={{ width: 20, height: 20 }} />
            <span className="text-[11px]" style={{ color: '#9ca3af' }}>Generating...</span>
          </div>
        )}

        {execStatus === 'idle' && !outputImage && (
          <div className="flex flex-col items-center justify-center py-8 gap-1">
            <ImageIcon size={24} style={{ color: '#d1d5db' }} />
            <span className="text-[11px]" style={{ color: '#9ca3af' }}>Result will appear here</span>
          </div>
        )}

        {outputImage && (
          <>
            <img src={outputImage} alt="Generated" className="w-full h-auto block" style={{ maxHeight: 260 }} />
            {execStatus === 'done' && (
              <div
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium"
                style={{ background: 'rgba(78, 173, 106, 0.9)', color: 'white' }}
              >
                <CheckCircle size={10} />
                {executionTime ? `${executionTime}s` : 'success'}
              </div>
            )}
            <button
              onClick={handleGenerate}
              disabled={execStatus === 'running'}
              className="absolute bottom-2 right-2 node-btn-secondary"
              style={{ padding: '6px', borderRadius: '8px' }}
              title="Regenerate"
            >
              <RefreshCw size={12} />
            </button>
          </>
        )}

        {execStatus === 'error' && !outputImage && (
          <div className="flex flex-col items-center justify-center py-6 gap-1 px-3">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium"
              style={{ background: 'rgba(212, 84, 84, 0.1)', color: '#d45454' }}
            >
              <XCircle size={10} />
              failed
            </div>
            <span className="text-[10px] text-center mt-1" style={{ color: '#d45454' }}>{error}</span>
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="prompt"
        style={{ top: '40%', background: '#4FD1C5', border: '2px solid #4FD1C5' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="briefData"
        style={{ top: '55%', background: '#F6B93B', border: '2px solid #F6B93B' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="referenceImage"
        style={{ top: '70%', background: '#E879A8', border: '2px solid #E879A8' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="image"
        style={{ background: '#E879A8', border: '2px solid #E879A8' }}
      />
    </NodeShell>
  );
}
