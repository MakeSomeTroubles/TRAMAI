import { Save, Upload, Download, Play } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';
import useWorkflowStore from '../store/workflowStore';
import { executeWorkflow } from '../engine/executor';

function timeAgo(ts) {
  if (!ts) return null;
  const diff = Math.floor((Date.now() - ts) / 60000);
  if (diff < 1) return 'just now';
  if (diff === 1) return '1 min ago';
  return `${diff} mins ago`;
}

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

  const [lastSaved, setLastSaved] = useState(null);
  const [lastSavedLabel, setLastSavedLabel] = useState(null);
  const [saveLabel, setSaveLabel] = useState('Save');
  const [isRunningAll, setIsRunningAll] = useState(false);

  useEffect(() => {
    if (!lastSaved) return;
    setLastSavedLabel(timeAgo(lastSaved));
    const interval = setInterval(() => setLastSavedLabel(timeAgo(lastSaved)), 30000);
    return () => clearInterval(interval);
  }, [lastSaved]);

  const handleRunAll = useCallback(() => {
    if (isRunningAll) return;
    setIsRunningAll(true);

    // Get sorted nodes for sequential execution simulation
    const nodeIds = nodes.map((n) => n.id);
    let i = 0;

    const runNext = () => {
      if (i >= nodeIds.length) {
        setIsRunningAll(false);
        setExecutionStatus('done');
        setTimeout(() => setExecutionStatus('idle'), 2000);
        return;
      }

      const nodeId = nodeIds[i];
      updateNodeData(nodeId, { executionStatus: 'running', error: null });
      setExecutionStatus('running');

      setTimeout(() => {
        updateNodeData(nodeId, { executionStatus: 'done' });
        i++;
        runNext();
      }, 1500);
    };

    runNext();
  }, [nodes, updateNodeData, setExecutionStatus, isRunningAll]);

  const handleSave = useCallback(() => {
    saveWorkflow();
    setLastSaved(Date.now());
    setSaveLabel('Saved \u2713');
    setTimeout(() => setSaveLabel('Save'), 2000);
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
      className="h-12 flex items-center px-4 gap-4 select-none shrink-0"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-1.5 mr-2">
        <div className="w-2 h-2 rounded-full" style={{ background: '#4FD1C5' }} />
        <span className="text-[15px] font-semibold tracking-wide" style={{ color: '#1a1a2e' }}>TRAMAI</span>
      </div>

      {/* Project Name + Last Saved */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-transparent border-0 text-sm outline-none w-40"
          style={{ color: '#1a1a2e' }}
          placeholder="Project name..."
        />
        {lastSavedLabel && (
          <span className="text-[10px] whitespace-nowrap" style={{ color: '#9ca3af' }}>
            Saved {lastSavedLabel}
          </span>
        )}
      </div>

      <div className="w-px h-5" style={{ background: 'rgba(0,0,0,0.08)' }} />

      {/* Desk selector */}
      <select
        className="rounded-md px-2 py-1 text-xs outline-none cursor-pointer"
        style={{
          background: 'rgba(0, 0, 0, 0.03)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          color: '#6b7280',
        }}
      >
        <option>No Desk</option>
      </select>

      <div className="flex-1" />

      {/* Action buttons */}
      <button
        onClick={handleSave}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
        style={{
          background: saveLabel !== 'Save' ? 'rgba(78, 173, 106, 0.08)' : 'rgba(0, 0, 0, 0.04)',
          border: saveLabel !== 'Save' ? '1px solid rgba(78, 173, 106, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
          color: saveLabel !== 'Save' ? '#4ead6a' : '#1a1a2e',
        }}
        title="Save to localStorage"
      >
        <Save size={12} />
        {saveLabel}
      </button>

      <button
        onClick={handleRunAll}
        disabled={isRunningAll}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors cursor-pointer border-0 disabled:opacity-50"
        style={{ background: '#4FD1C5' }}
      >
        <Play size={12} />
        {isRunningAll ? 'Running...' : 'Run All'}
      </button>

      <div className="flex items-center gap-1">
        <button
          onClick={handleLoad}
          className="p-1.5 rounded-md hover:bg-black/5 transition-colors cursor-pointer bg-transparent border-0"
          style={{ color: '#6b7280' }}
          title="Load from localStorage"
        >
          <Upload size={15} />
        </button>
        <button
          onClick={handleExport}
          className="p-1.5 rounded-md hover:bg-black/5 transition-colors cursor-pointer bg-transparent border-0"
          style={{ color: '#6b7280' }}
          title="Export as JSON"
        >
          <Download size={15} />
        </button>
      </div>
    </header>
  );
}
