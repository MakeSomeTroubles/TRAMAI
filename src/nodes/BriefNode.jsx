import { useState, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText } from 'lucide-react';
import NodeShell from '../components/NodeShell';
import useWorkflowStore from '../store/workflowStore';

export default function BriefNode({ id, data }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nd = data.nodeData || {};

  const projectName = nd.projectName || '';
  const brandName = nd.brandName || '';
  const moods = nd.moods || [];
  const targetAudience = nd.targetAudience || '';
  const keyMessage = nd.keyMessage || '';

  const [moodInput, setMoodInput] = useState('');

  const update = useCallback(
    (patch) => updateNodeData(id, patch),
    [id, updateNodeData]
  );

  const addMood = useCallback(() => {
    const trimmed = moodInput.trim();
    if (trimmed && !moods.includes(trimmed)) {
      update({ moods: [...moods, trimmed] });
    }
    setMoodInput('');
  }, [moodInput, moods, update]);

  const removeMood = useCallback(
    (tag) => update({ moods: moods.filter((m) => m !== tag) }),
    [moods, update]
  );

  return (
    <NodeShell id={id} icon={FileText} title="Brief" color="#4FD1C5" width={300}>
      <div>
        <label className="node-label">Project</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => update({ projectName: e.target.value })}
          placeholder="Project name..."
          className="node-input"
        />
      </div>

      <div>
        <label className="node-label">Brand</label>
        <input
          type="text"
          value={brandName}
          onChange={(e) => update({ brandName: e.target.value })}
          placeholder="Brand name..."
          className="node-input"
        />
      </div>

      <div>
        <label className="node-label">Target Audience</label>
        <input
          type="text"
          value={targetAudience}
          onChange={(e) => update({ targetAudience: e.target.value })}
          placeholder="e.g. Women 25-34, urban professionals..."
          className="node-input"
        />
      </div>

      <div>
        <label className="node-label">Key Message</label>
        <textarea
          value={keyMessage}
          onChange={(e) => update({ keyMessage: e.target.value })}
          placeholder="What should the ad communicate?"
          rows={2}
          className="node-textarea"
          style={{ minHeight: 50 }}
        />
      </div>

      <div>
        <label className="node-label">Mood Keywords</label>
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {moods.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
              <button onClick={() => removeMood(tag)}>×</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={moodInput}
          onChange={(e) => setMoodInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addMood();
            }
          }}
          placeholder="Type + Enter to add..."
          className="node-input"
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="briefData"
        style={{ background: '#F6B93B', border: '2px solid #F6B93B' }}
      />
    </NodeShell>
  );
}
