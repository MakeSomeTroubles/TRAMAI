import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

// Default demo layout — shown when no saved workflow exists
const DEFAULT_NODES = [
  {
    id: 'briefNode-1',
    type: 'briefNode',
    position: { x: 80, y: 200 },
    data: {
      label: 'briefNode',
      nodeData: {
        projectName: 'KOVA Coffee',
        brandName: 'KOVA',
        targetAudience: 'Urban professionals 28-40',
        keyMessage: 'Ritual, not routine',
        moods: ['warm', 'minimal', 'premium'],
      },
    },
  },
  {
    id: 'textPromptNode-2',
    type: 'textPromptNode',
    position: { x: 450, y: 180 },
    data: {
      label: 'textPromptNode',
      nodeData: {
        prompt: 'Professional product photography of a matte black coffee bag with minimal gold typography',
        adAssist: false,
      },
    },
  },
  {
    id: 'generateNode-3',
    type: 'generateNode',
    position: { x: 800, y: 200 },
    data: {
      label: 'generateNode',
      nodeData: {
        backend: 'huggingface',
        aspectRatio: '1:1',
      },
    },
  },
];

const DEFAULT_EDGES = [
  {
    id: 'e-briefNode-1-briefData-textPromptNode-2-briefData',
    source: 'briefNode-1',
    sourceHandle: 'briefData',
    target: 'textPromptNode-2',
    targetHandle: 'briefData',
    type: 'smoothstep',
  },
  {
    id: 'e-textPromptNode-2-prompt-generateNode-3-prompt',
    source: 'textPromptNode-2',
    sourceHandle: 'prompt',
    target: 'generateNode-3',
    targetHandle: 'prompt',
    type: 'smoothstep',
  },
];

// Check if there's a saved workflow in localStorage
function getInitialState() {
  try {
    const saved = localStorage.getItem('tramai_workflow');
    if (saved) {
      const workflow = JSON.parse(saved);
      if (workflow.nodes && workflow.nodes.length > 0) {
        return {
          nodes: workflow.nodes,
          edges: workflow.edges || [],
          projectName: workflow.projectName || 'Untitled Project',
          nodeIdCounter: workflow.nodeIdCounter || 3,
        };
      }
    }
  } catch {
    // Fall through to defaults
  }
  return {
    nodes: DEFAULT_NODES,
    edges: DEFAULT_EDGES,
    projectName: 'KOVA Coffee Campaign',
    nodeIdCounter: 3,
  };
}

const initialState = getInitialState();

const useWorkflowStore = create((set, get) => ({
  // React Flow state
  nodes: initialState.nodes,
  edges: initialState.edges,

  // Workflow metadata
  projectName: initialState.projectName,

  // Execution state
  executionStatus: 'idle', // 'idle' | 'running' | 'done' | 'error'

  // Node counter for unique IDs
  nodeIdCounter: initialState.nodeIdCounter,

  // React Flow handlers
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    const edge = {
      ...connection,
      id: `e-${connection.source}-${connection.sourceHandle}-${connection.target}-${connection.targetHandle}`,
      type: 'default',
    };
    set({ edges: [...get().edges, edge] });
  },

  // Add a new node
  addNode: (type, position) => {
    const counter = get().nodeIdCounter + 1;
    const id = `${type}-${counter}`;
    const newNode = {
      id,
      type,
      position,
      data: { label: type, nodeData: {} },
    };
    set({
      nodes: [...get().nodes, newNode],
      nodeIdCounter: counter,
    });
    return id;
  },

  // Update a node's data
  updateNodeData: (nodeId, newData) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, nodeData: { ...node.data.nodeData, ...newData } } }
          : node
      ),
    });
  },

  // Get a node's data
  getNodeData: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    return node?.data?.nodeData || {};
  },

  // Get upstream nodes connected to a given node's input handle
  getUpstreamData: (nodeId, handleId) => {
    const edges = get().edges;
    const edge = edges.find(
      (e) => e.target === nodeId && (handleId ? e.targetHandle === handleId : true)
    );
    if (!edge) return null;
    return get().getNodeData(edge.source);
  },

  // Get all upstream connections for a node
  getUpstreamConnections: (nodeId) => {
    const edges = get().edges;
    return edges
      .filter((e) => e.target === nodeId)
      .map((e) => ({
        sourceId: e.source,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
        data: get().getNodeData(e.source),
      }));
  },

  // Delete a node and its edges
  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    });
  },

  // Set project name
  setProjectName: (name) => set({ projectName: name }),

  // Set execution status
  setExecutionStatus: (status) => set({ executionStatus: status }),

  // Save workflow to localStorage
  saveWorkflow: () => {
    const { nodes, edges, projectName, nodeIdCounter } = get();
    // Strip ephemeral data (images, execution status) from node data before saving
    const cleanNodes = nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        nodeData: {
          ...n.data.nodeData,
          outputImage: undefined,
          executionStatus: undefined,
          executionTime: undefined,
          error: undefined,
        },
      },
    }));
    const workflow = { nodes: cleanNodes, edges, projectName, nodeIdCounter };
    localStorage.setItem('tramai_workflow', JSON.stringify(workflow));
  },

  // Load workflow from localStorage
  loadWorkflow: () => {
    const saved = localStorage.getItem('tramai_workflow');
    if (saved) {
      try {
        const workflow = JSON.parse(saved);
        set({
          nodes: workflow.nodes || [],
          edges: workflow.edges || [],
          projectName: workflow.projectName || 'Untitled Project',
          nodeIdCounter: workflow.nodeIdCounter || 0,
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  },

  // Export workflow as JSON
  exportWorkflow: () => {
    const { nodes, edges, projectName } = get();
    return JSON.stringify({ nodes, edges, projectName }, null, 2);
  },

  // Import workflow from JSON
  importWorkflow: (json) => {
    try {
      const workflow = JSON.parse(json);
      set({
        nodes: workflow.nodes || [],
        edges: workflow.edges || [],
        projectName: workflow.projectName || 'Imported Workflow',
        nodeIdCounter: Math.max(0, ...(workflow.nodes || []).map((n) => {
          const match = n.id.match(/-(\d+)$/);
          return match ? parseInt(match[1]) : 0;
        })),
      });
      return true;
    } catch {
      return false;
    }
  },

  // Clear canvas
  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      nodeIdCounter: 0,
      executionStatus: 'idle',
    });
  },

  // Load a pre-built desk template
  loadDesk: (deskData) => {
    set({
      nodes: deskData.nodes || [],
      edges: deskData.edges || [],
      projectName: deskData.projectName || 'Untitled',
      nodeIdCounter: Math.max(0, ...(deskData.nodes || []).map((n) => {
        const match = n.id.match(/-(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })),
      executionStatus: 'idle',
    });
  },
}));

export default useWorkflowStore;
