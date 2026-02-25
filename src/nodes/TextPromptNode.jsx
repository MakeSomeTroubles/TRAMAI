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

  // Check if brief is connected (show indicator)
  const edges = useWorkflowStore((s) => s.edges);
  const hasBriefConnection = edges.some(
    (e) => e.target === id && e.targetHandle === 'briefData'
  );

  return (
    <NodeShell id={id} icon={Type} title="Text Prompt" color="var(--color-accent)">
      {/* Brief connection indicator */}
      {hasBriefConnection && (
        <div className="flex items-center gap-1.5 text-[10px] text-accent">
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          Brief connected
        </div>
      )}

      {/* Prompt textarea */}
      <div>
        <textarea
          value={prompt}
          onChange={(e) => update({ prompt: e.target.value })}
          placeholder="Describe your image..."
          rows={4}
          className="w-full bg-input-bg border border-input-border rounded-md px-2.5 py-2 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors resize-y font-mono leading-relaxed"
          style={{ fontFamily: 'var(--font-mono)', minHeight: 80 }}
        />
        <div className="flex items-center justify-between mt-1">
          {/* AD Assist toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              className={`w-8 h-[18px] rounded-full relative transition-colors cursor-pointer ${
                adAssist ? 'bg-accent' : 'bg-input-border'
              }`}
              onClick={() => update({ adAssist: !adAssist })}
            >
              <div
                className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform ${
                  adAssist ? 'translate-x-[15px]' : 'translate-x-[2px]'
                }`}
              />
            </div>
            <span className="text-[11px] text-text-secondary">AD Assist</span>
          </label>

          {/* Character count */}
          <span className="text-[10px] text-text-muted font-mono">{prompt.length}</span>
        </div>
      </div>

      {/* Processed prompt preview (after AD Assist rewrites) */}
      {nd.processedPrompt && adAssist && (
        <div className="mt-1">
          <label className="text-[10px] text-text-muted block mb-0.5">Processed prompt:</label>
          <div className="text-[10px] text-text-secondary bg-input-bg rounded px-2 py-1.5 max-h-16 overflow-y-auto font-mono leading-relaxed">
            {nd.processedPrompt}
          </div>
        </div>
      )}

      {/* Input: briefData */}
      <Handle
        type="target"
        position={Position.Left}
        id="briefData"
        style={{ top: '50%', background: 'var(--color-wire-data)' }}
      />

      {/* Output: prompt */}
      <Handle
        type="source"
        position={Position.Right}
        id="prompt"
        style={{ background: 'var(--color-wire-default)' }}
      />
    </NodeShell>
  );
}
