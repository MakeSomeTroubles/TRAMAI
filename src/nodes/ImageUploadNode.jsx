import { useCallback, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ImageUp } from 'lucide-react';
import NodeShell from '../components/NodeShell';
import useWorkflowStore from '../store/workflowStore';

export default function ImageUploadNode({ id, data }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const nd = data.nodeData || {};
  const image = nd.uploadedImage || null;
  const fileRef = useRef(null);

  const update = useCallback(
    (patch) => updateNodeData(id, patch),
    [id, updateNodeData]
  );

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => update({ uploadedImage: e.target.result, fileName: file.name });
    reader.readAsDataURL(file);
  }, [update]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  return (
    <NodeShell id={id} icon={ImageUp} title="Image Upload" color="#E879A8">
      {!image ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center py-8 gap-2 cursor-pointer rounded-xl"
          style={{
            border: '2px dashed rgba(0,0,0,0.12)',
            background: 'rgba(0,0,0,0.02)',
          }}
        >
          <ImageUp size={28} style={{ color: '#d1d5db' }} />
          <span className="text-[12px] font-medium" style={{ color: '#6b7280' }}>Drop image here</span>
          <span className="text-[10px]" style={{ color: '#9ca3af' }}>PNG, JPG up to 10MB</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden relative" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          <img src={image} alt="Uploaded" className="w-full h-auto block" style={{ maxHeight: 200 }} />
          <button
            onClick={() => update({ uploadedImage: null, fileName: null })}
            className="absolute top-2 right-2 node-btn-secondary"
            style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '10px' }}
          >
            Remove
          </button>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="image"
        style={{ background: '#E879A8', border: '2px solid #E879A8' }}
      />
    </NodeShell>
  );
}
