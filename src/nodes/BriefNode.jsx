import { useState, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText } from 'lucide-react';
import NodeShell from '../components/NodeShell';
import useWorkflowStore from '../store/workflowStore';

const STYLE_PRESETS = ['Editorial', 'Beauty', 'Street', 'Cinematic', 'Product', 'Minimal', 'Custom'];
const DEFAULT_COLORS = ['#D4A574', '#2C3E50', '#E8E8EF', '#4A9EAD', '#1A1A24'];

export default function BriefNode({ id, data }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nd = data.nodeData || {};

  const projectName = nd.projectName || '';
  const brandName = nd.brandName || '';
  const moods = nd.moods || [];
  const colors = nd.colors || DEFAULT_COLORS;
  const style = nd.style || 'Editorial';

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

  const updateColor = useCallback(
    (index, hex) => {
      const next = [...colors];
      next[index] = hex;
      update({ colors: next });
    },
    [colors, update]
  );

  return (
    <NodeShell id={id} icon={FileText} title="Brief" color="var(--color-accent)" width={300}>
      {/* Project Name */}
      <div>
        <label className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.05em] block mb-1">
          Project
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => update({ projectName: e.target.value })}
          placeholder="Project name..."
          className="w-full bg-input-bg border border-input-border rounded-md px-2.5 py-1.5 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Brand Name */}
      <div>
        <label className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.05em] block mb-1">
          Brand
        </label>
        <input
          type="text"
          value={brandName}
          onChange={(e) => update({ brandName: e.target.value })}
          placeholder="Brand name (optional)..."
          className="w-full bg-input-bg border border-input-border rounded-md px-2.5 py-1.5 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Mood Keywords */}
      <div>
        <label className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.05em] block mb-1">
          Mood Keywords
        </label>
        <div className="flex gap-1.5 mb-1.5 flex-wrap">
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
          className="w-full bg-input-bg border border-input-border rounded-md px-2.5 py-1.5 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Color Palette */}
      <div>
        <label className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.05em] block mb-1.5">
          Color Palette
        </label>
        <div className="flex gap-2">
          {colors.map((hex, i) => (
            <div key={i} className="relative">
              <input
                type="color"
                value={hex}
                onChange={(e) => updateColor(i, e.target.value)}
                className="color-swatch cursor-pointer"
                style={{ backgroundColor: hex }}
                title={hex}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Style Preset */}
      <div>
        <label className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.05em] block mb-1">
          Style
        </label>
        <select
          value={style}
          onChange={(e) => update({ style: e.target.value })}
          className="w-full bg-input-bg border border-input-border rounded-md px-2.5 py-1.5 text-xs text-text-primary outline-none focus:border-accent transition-colors cursor-pointer"
        >
          {STYLE_PRESETS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="briefData"
        style={{ background: 'var(--color-wire-data)' }}
      />
    </NodeShell>
  );
}
