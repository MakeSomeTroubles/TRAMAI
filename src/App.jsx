import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  useViewport,
  useReactFlow,
} from '@xyflow/react';
import useWorkflowStore from './store/workflowStore';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import BriefNode from './nodes/BriefNode';
import TextPromptNode from './nodes/TextPromptNode';
import GenerateNode from './nodes/GenerateNode';
import ImageUploadNode from './nodes/ImageUploadNode';
import VariationsNode from './nodes/VariationsNode';
import BatchNode from './nodes/BatchNode';
import RetouchNode from './nodes/RetouchNode';
import UpscaleNode from './nodes/UpscaleNode';
import FaceSwapNode from './nodes/FaceSwapNode';
import ColorGradeNode from './nodes/ColorGradeNode';
import PreviewWallNode from './nodes/PreviewWallNode';
import ExportNode from './nodes/ExportNode';
import './styles/nodes.css';

// Register all custom node types
const nodeTypes = {
  briefNode: BriefNode,
  textPromptNode: TextPromptNode,
  generateNode: GenerateNode,
  imageUploadNode: ImageUploadNode,
  variationsNode: VariationsNode,
  batchNode: BatchNode,
  retouchNode: RetouchNode,
  upscaleNode: UpscaleNode,
  faceSwapNode: FaceSwapNode,
  colorGradeNode: ColorGradeNode,
  previewWallNode: PreviewWallNode,
  exportNode: ExportNode,
};

// Star grid that scales with React Flow viewport
function StarGrid() {
  const { x, y, zoom } = useViewport();
  const gap = 28;
  const starSize = 8;

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <pattern
          id="star-pattern"
          x={x % (gap * zoom)}
          y={y % (gap * zoom)}
          width={gap * zoom}
          height={gap * zoom}
          patternUnits="userSpaceOnUse"
        >
          <svg
            viewBox={`0 0 ${starSize} ${starSize}`}
            width={5.25 * zoom}
            height={5.25 * zoom}
            x={(gap * zoom - 5.25 * zoom) / 2}
            y={(gap * zoom - 5.25 * zoom) / 2}
          >
            <path
              d="M4 0 C4 2.5 5.5 4 8 4 C5.5 4 4 5.5 4 8 C4 5.5 2.5 4 0 4 C2.5 4 4 2.5 4 0Z"
              fill="rgba(0,0,0,0.18)"
            />
          </svg>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#star-pattern)" />
    </svg>
  );
}

export default function App() {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/tramai-node');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [addNode, screenToFlowPosition]
  );

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((n) => n.selected);
        selectedNodes.forEach((n) => {
          useWorkflowStore.getState().deleteNode(n.id);
        });
      }
    },
    [nodes]
  );

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #DCE6F0 0%, #F0F0EC 50%, #F5F0EB 100%)',
      }}
    >
      <TopBar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div ref={reactFlowWrapper} className="flex-1 relative" onKeyDown={onKeyDown} tabIndex={0}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#4FD1C5', strokeWidth: 2, strokeDasharray: '8 4' },
            }}
            connectionLineStyle={{
              stroke: '#4FD1C5',
              strokeWidth: 2,
            }}
            deleteKeyCode={['Delete', 'Backspace']}
            proOptions={{ hideAttribution: true }}
            style={{ background: 'transparent' }}
          >
            {/* Star grid — scales with viewport */}
            <StarGrid />

            {/* Controls */}
            <Controls position="bottom-left" />
            <MiniMap
              position="bottom-right"
              nodeColor={() => '#4FD1C5'}
              maskColor="rgba(248, 249, 251, 0.7)"
              style={{ width: 160, height: 100 }}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
