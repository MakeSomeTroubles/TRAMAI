import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Sparkles, RefreshCw } from 'lucide-react';
import NodeShell from '../components/NodeShell';
import ImagePreview from '../components/ImagePreview';
import ExecutionStatus from '../components/ExecutionStatus';
import useWorkflowStore from '../store/workflowStore';
import { executeSingleNode } from '../engine/executor';

const BACKENDS = [
  { id: 'fal', label: 'Fal.ai (Flux Pro)' },
  { id: 'google', label: 'Google (Imagen)' },
  { id: 'huggingface', label: 'HuggingFace (Flux Dev)' },
];

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:5', '3:2'];

export default function GenerateNode({ id, data }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const setExecutionStatus = useWorkflowStore((s) => s.setExecutionStatus);
  const nd = data.nodeData || {};

  const backend = nd.backend || 'fal';
  const aspectRatio = nd.aspectRatio || '1:1';
  const quality = nd.quality || 'draft';
  const outputImage = nd.outputImage || null;
  const executionTime = nd.executionTime || null;
  const execStatus = nd.executionStatus || 'idle';

  const update = useCallback(
    (patch) => updateNodeData(id, patch),
    [id, updateNodeData]
  );

  const handleGenerate = useCallback(async () => {
    await executeSingleNode(id, nodes, edges, updateNodeData, setExecutionStatus);
  }, [id, nodes, edges, updateNodeData, setExecutionStatus]);

  return (
    <NodeShell id={id} icon={Sparkles} title="Generate" color="var(--color-status-running)">
      {/* Backend selector */}
      <div>
        <label className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.05em] block mb-1">
          Backend
        </label>
        <select
          value={backend}
          onChange={(e) => update({ backend: e.target.value })}
          className="w-full bg-input-bg border border-input-border rounded-md px-2.5 py-1.5 text-xs text-text-primary outline-none focus:border-accent transition-colors cursor-pointer"
        >
          {BACKENDS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {/* Aspect Ratio */}
      <div>
        <label className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.05em] block mb-1">
          Aspect Ratio
        </label>
        <div className="flex gap-1">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio}
              onClick={() => update({ aspectRatio: ratio })}
              className={`flex-1 px-1 py-1 rounded text-[11px] border transition-colors cursor-pointer ${
                aspectRatio === ratio
                  ? 'bg-accent/20 border-accent text-accent'
                  : 'bg-input-bg border-input-border text-text-secondary hover:border-text-muted'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Quality */}
      <div>
        <label className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.05em] block mb-1">
          Quality
        </label>
        <div className="flex gap-1">
          {['draft', 'final'].map((q) => (
            <button
              key={q}
              onClick={() => update({ quality: q })}
              className={`flex-1 px-2 py-1 rounded text-[11px] border capitalize transition-colors cursor-pointer ${
                quality === q
                  ? 'bg-accent/20 border-accent text-accent'
                  : 'bg-input-bg border-input-border text-text-secondary hover:border-text-muted'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <div className="flex gap-1.5">
        <button
          onClick={handleGenerate}
          disabled={execStatus === 'running'}
          className="flex-1 py-2 rounded-lg text-xs font-medium text-white transition-colors cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed bg-accent hover:bg-accent-hover"
        >
          {execStatus === 'running' ? 'Generating...' : 'Generate'}
        </button>
        {outputImage && (
          <button
            onClick={handleGenerate}
            disabled={execStatus === 'running'}
            className="px-2 py-2 rounded-lg border border-input-border bg-input-bg text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors cursor-pointer disabled:opacity-50"
            title="Regenerate"
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>

      {/* Execution status */}
      <ExecutionStatus status={execStatus} time={executionTime} />

      {/* Image preview */}
      <ImagePreview src={outputImage} alt="Generated image" />

      {/* Input handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="prompt"
        style={{ top: '40%', background: 'var(--color-wire-default)' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="briefData"
        style={{ top: '55%', background: 'var(--color-wire-data)' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="referenceImage"
        style={{ top: '70%', background: 'var(--color-wire-default)' }}
      />

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="image"
        style={{ background: 'var(--color-wire-default)' }}
      />
    </NodeShell>
  );
}
