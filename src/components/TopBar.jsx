import { Save, Upload, Download, Play } from 'lucide-react';
import { useCallback } from 'react';
import useWorkflowStore from '../store/workflowStore';
import { executeWorkflow } from '../engine/executor';

export default function TopBar() {
  const projectName = useWorkflowStore((s) => s.projectName);
  const setProjectName = useWorkflowStore((s) => s.setProjectName);
  const saveWorkflow = useWorkflowStore((s) => s.saveWorkflow);
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);
  const exportWorkflow = useWorkflowStore((s) => s.exportWorkflow);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const setExecutionStatus = useWorkflowStore((s) => s.setExecutionStatus);
  const executionStatus = useWorkflowStore((s) => s.executionStatus);

  const handleRunAll = useCallback(() => {
    executeWorkflow(nodes, edges, updateNodeData, setExecutionStatus);
  }, [nodes, edges, updateNodeData, setExecutionStatus]);

  const handleSave = useCallback(() => {
    saveWorkflow();
  }, [saveWorkflow]);

  const handleLoad = useCallback(() => {
    loadWorkflow();
  }, [loadWorkflow]);

  const handleExport = useCallback(() => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName || 'tramai-workflow'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportWorkflow, projectName]);

  return (
    <header
      className="h-12 flex items-center px-4 gap-4 border-b select-none shrink-0"
      style={{
        background: 'var(--color-node-bg)',
        borderColor: 'var(--color-node-border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-1.5 mr-2">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <span className="text-[15px] font-semibold text-text-primary tracking-wide">TRAMAI</span>
      </div>

      {/* Project Name */}
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="bg-transparent border-0 text-sm text-text-primary outline-none w-40 placeholder:text-text-muted"
        placeholder="Project name..."
      />

      <div className="w-px h-5 bg-node-border" />

      {/* Desk selector placeholder */}
      <select className="bg-input-bg border border-input-border rounded-md px-2 py-1 text-xs text-text-secondary outline-none cursor-pointer">
        <option>No Desk</option>
      </select>

      <div className="flex-1" />

      {/* Action buttons */}
      <button
        onClick={handleRunAll}
        disabled={executionStatus === 'running'}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-accent hover:bg-accent-hover transition-colors cursor-pointer border-0 disabled:opacity-50"
      >
        <Play size={12} />
        Run All
      </button>

      <div className="flex items-center gap-1">
        <button
          onClick={handleSave}
          className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-0"
          title="Save to localStorage"
        >
          <Save size={15} />
        </button>
        <button
          onClick={handleLoad}
          className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-0"
          title="Load from localStorage"
        >
          <Upload size={15} />
        </button>
        <button
          onClick={handleExport}
          className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-0"
          title="Export as JSON"
        >
          <Download size={15} />
        </button>
      </div>
    </header>
  );
}
