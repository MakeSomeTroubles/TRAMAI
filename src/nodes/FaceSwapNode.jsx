import { useCallback, useRef, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { UserRound, ImageIcon } from 'lucide-react';
import NodeShell from '../components/NodeShell';
import useWorkflowStore from '../store/workflowStore';

export default function FaceSwapNode({ id, data }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nd = data.nodeData || {};
  const sourceFace = nd.sourceFace || null;
  const outputImage = nd.outputImage || null;
  const fileRef = useRef(null);
  const [btnState, setBtnState] = useState('idle');

  const update = useCallback(
    (patch) => updateNodeData(id, patch),
    [id, updateNodeData]
  );

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => update({ sourceFace: e.target.result });
    reader.readAsDataURL(file);
  }, [update]);

  const handleDropFace = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

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
    <NodeShell id={id} icon={UserRound} title="Face Swap" color="#8888a0">
      <div>
        <label className="node-label">Source Face</label>
        {sourceFace ? (
          <div className="relative rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <img src={sourceFace} alt="Source" className="w-full h-auto block" style={{ maxHeight: 80 }} />
            <button
              onClick={() => update({ sourceFace: null })}
              className="absolute top-1 right-1 text-[9px] px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.9)', color: '#6b7280', border: '1px solid rgba(0,0,0,0.1)' }}
            >
              ×
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={handleDropFace}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="flex flex-col items-center justify-center py-4 gap-1 cursor-pointer rounded-lg"
            style={{ border: '2px dashed rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.02)' }}
          >
            <UserRound size={18} style={{ color: '#d1d5db' }} />
            <span className="text-[10px]" style={{ color: '#9ca3af' }}>Drop or click to upload face</span>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          </div>
        )}
      </div>

      <button
        className="node-btn-primary w-full"
        onClick={handleClick}
        disabled={btnState !== 'idle'}
      >
        {btnState === 'processing' ? 'Processing...' : btnState === 'no-api' ? 'No API connected' : 'Swap'}
      </button>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', minHeight: 60 }}
      >
        {outputImage ? (
          <img src={outputImage} alt="Swapped" className="w-full h-auto block" style={{ maxHeight: 200 }} />
        ) : (
          <div className="flex items-center justify-center py-4">
            <ImageIcon size={18} style={{ color: '#d1d5db' }} />
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} id="image" style={{ top: '50%', background: '#E879A8', border: '2px solid #E879A8' }} />
      <Handle type="source" position={Position.Right} id="swapped" style={{ background: '#E879A8', border: '2px solid #E879A8' }} />
    </NodeShell>
  );
}
