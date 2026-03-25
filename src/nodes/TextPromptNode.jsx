import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Type } from 'lucide-react';
import NodeShell from '../components/NodeShell';
import useWorkflowStore from '../store/workflowStore';

export default function TextPromptNode({ id, data }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nd = data.nodeData || {};

  const prompt = nd.prompt || '';
  const adAssist = nd.adAssist || false;

  const update = useCallback(
    (patch) => updateNodeData(id, patch),
    [id, updateNodeData]
  );

  return (
    <NodeShell id={id} icon={Type} title="Text Prompt" color="#4FD1C5">
      <div>
        <label className="node-label">Prompt Text</label>
        <textarea
          value={prompt}
          onChange={(e) => update({ prompt: e.target.value })}
          placeholder="Describe your image..."
          rows={5}
          className="node-textarea"
        />
        <div className="flex items-center justify-between mt-1.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              className={`node-toggle-track ${adAssist ? 'active' : ''}`}
              onClick={() => update({ adAssist: !adAssist })}
            >
              <div className="node-toggle-thumb" />
            </div>
            <span className="text-[11px]" style={{ color: '#6b7280' }}>AD Assist</span>
          </label>
          <span className="text-[10px] font-mono" style={{ color: '#9ca3af' }}>{prompt.length}</span>
        </div>
      </div>

      {nd.processedPrompt && adAssist && (
        <div>
          <label className="node-label">Processed Prompt</label>
          <div
            className="text-[11px] rounded-lg px-3 py-2 max-h-20 overflow-y-auto font-mono leading-relaxed"
            style={{ color: '#6b7280', background: 'rgba(0,0,0,0.03)' }}
          >
            {nd.processedPrompt}
          </div>
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        id="briefData"
        style={{ top: '50%', background: '#F6B93B', border: '2px solid #F6B93B' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="prompt"
        style={{ background: '#4FD1C5', border: '2px solid #4FD1C5' }}
      />
    </NodeShell>
  );
}
