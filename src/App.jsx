import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from '@xyflow/react';
import useWorkflowStore from './store/workflowStore';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import BriefNode from './nodes/BriefNode';
import TextPromptNode from './nodes/TextPromptNode';
import GenerateNode from './nodes/GenerateNode';
import './styles/nodes.css';

// Register custom node types
const nodeTypes = {
  briefNode: BriefNode,
  textPromptNode: TextPromptNode,
  generateNode: GenerateNode,
};

export default function App() {
  const reactFlowWrapper = useRef(null);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);

  // Handle drop from sidebar
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/tramai-node');
      if (!type) return;

      // Get the React Flow instance bounds to calculate position
      const wrapperBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!wrapperBounds) return;

      // Calculate position relative to the canvas
      // We need to account for the React Flow viewport transform
      const position = {
        x: event.clientX - wrapperBounds.left - 140,
        y: event.clientY - wrapperBounds.top - 20,
      };

      addNode(type, position);
    },
    [addNode]
  );

  // Handle keyboard delete
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
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--color-canvas-bg)' }}>
      <TopBar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div ref={reactFlowWrapper} className="flex-1" onKeyDown={onKeyDown} tabIndex={0}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView={false}
            defaultEdgeOptions={{
              type: 'default',
              style: { stroke: 'var(--color-wire-default)', strokeWidth: 2 },
            }}
            connectionLineStyle={{
              stroke: 'var(--color-accent)',
              strokeWidth: 2,
            }}
            deleteKeyCode={['Delete', 'Backspace']}
            proOptions={{ hideAttribution: true }}
            style={{ background: 'var(--color-canvas-bg)' }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="var(--color-node-border)"
            />
            <Controls position="bottom-left" />
            <MiniMap
              position="bottom-right"
              nodeColor={() => 'var(--color-accent)'}
              maskColor="rgba(15, 15, 20, 0.7)"
              style={{ width: 160, height: 100 }}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
