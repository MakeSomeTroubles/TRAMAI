import { Handle, Position } from '@xyflow/react';
import { LayoutDashboard, ImageIcon } from 'lucide-react';
import NodeShell from '../components/NodeShell';
import useWorkflowStore from '../store/workflowStore';

export default function PreviewWallNode({ id, data }) {
  // Collect all images from upstream nodes
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  const incomingEdges = edges.filter((e) => e.target === id);
  const images = incomingEdges
    .map((e) => {
      const srcNode = nodes.find((n) => n.id === e.source);
      return srcNode?.data?.nodeData?.outputImage || srcNode?.data?.nodeData?.uploadedImage;
    })
    .filter(Boolean);

  return (
    <NodeShell id={id} icon={LayoutDashboard} title="Preview" color="#4ead6a" width={340}>
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)', minHeight: 120 }}
      >
        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-1 p-1">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Preview ${i + 1}`}
                className="w-full h-auto rounded-lg block cursor-pointer hover:opacity-90 transition-opacity"
                style={{ aspectRatio: '1', objectFit: 'cover' }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <ImageIcon size={28} style={{ color: '#d1d5db' }} />
            <span className="text-[11px]" style={{ color: '#9ca3af' }}>Connect image nodes to preview</span>
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} id="image1" style={{ top: '30%', background: '#E879A8', border: '2px solid #E879A8' }} />
      <Handle type="target" position={Position.Left} id="image2" style={{ top: '50%', background: '#E879A8', border: '2px solid #E879A8' }} />
      <Handle type="target" position={Position.Left} id="image3" style={{ top: '70%', background: '#E879A8', border: '2px solid #E879A8' }} />
    </NodeShell>
  );
}
