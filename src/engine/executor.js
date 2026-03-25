import { callBackend } from './apiRouter.js';
import { buildPrompt } from './promptBuilder.js';

/**
 * Topological sort of the node graph.
 * Returns an array of node IDs in execution order.
 */
function topologicalSort(nodes, edges) {
  const inDegree = {};
  const adjacency = {};

  nodes.forEach((n) => {
    inDegree[n.id] = 0;
    adjacency[n.id] = [];
  });

  edges.forEach((e) => {
    if (adjacency[e.source]) {
      adjacency[e.source].push(e.target);
    }
    if (inDegree[e.target] !== undefined) {
      inDegree[e.target]++;
    }
  });

  const queue = [];
  Object.entries(inDegree).forEach(([id, deg]) => {
    if (deg === 0) queue.push(id);
  });

  const sorted = [];
  while (queue.length > 0) {
    const id = queue.shift();
    sorted.push(id);
    (adjacency[id] || []).forEach((target) => {
      inDegree[target]--;
      if (inDegree[target] === 0) {
        queue.push(target);
      }
    });
  }

  return sorted;
}

/**
 * Collects upstream data for a specific node.
 */
function collectInputs(nodeId, edges, nodeOutputs) {
  const inputs = {};
  edges.forEach((e) => {
    if (e.target === nodeId && nodeOutputs[e.source]) {
      const sourceData = nodeOutputs[e.source];
      // Map by target handle name
      const handle = e.targetHandle || 'default';
      inputs[handle] = { ...inputs[handle], ...sourceData };
    }
  });
  return inputs;
}

/**
 * Execute a single node based on its type.
 */
async function executeNode(node, inputs, updateNodeData) {
  const nodeData = node.data.nodeData || {};
  const type = node.type;

  switch (type) {
    case 'briefNode': {
      // Brief is a data-source node — just output its stored data
      return {
        briefData: {
          projectName: nodeData.projectName || '',
          brandName: nodeData.brandName || '',
          moods: nodeData.moods || [],
          colors: nodeData.colors || [],
          style: nodeData.style || 'Custom',
        },
      };
    }

    case 'textPromptNode': {
      const rawPrompt = nodeData.prompt || '';
      const briefData = inputs.briefData?.briefData || null;
      let finalPrompt = rawPrompt;

      // AD Assist: rewrite via Google Gemini
      if (nodeData.adAssist && rawPrompt.trim()) {
        try {
          updateNodeData(node.id, { executionStatus: 'running' });
          const resp = await callBackend('google', 'describe', {
            text: rawPrompt,
            mode: 'ad_rewrite',
            brief: briefData,
          });
          finalPrompt = resp.prompt || rawPrompt;
          updateNodeData(node.id, { processedPrompt: finalPrompt });
        } catch (err) {
          // If AD Assist fails, fall back to raw prompt
          console.warn('AD Assist failed, using raw prompt:', err.message);
          finalPrompt = rawPrompt;
        }
      }

      // If brief is connected, merge it into prompt via promptBuilder
      if (briefData) {
        finalPrompt = buildPrompt({ rawPrompt: finalPrompt, briefData });
      }

      return { prompt: finalPrompt };
    }

    case 'generateNode': {
      const prompt = inputs.prompt?.prompt || inputs.default?.prompt || '';
      if (!prompt.trim()) {
        throw new Error('No prompt connected. Connect a Text Prompt node.');
      }

      const backend = nodeData.backend || 'fal';
      const aspectRatio = nodeData.aspectRatio || '1:1';
      const quality = nodeData.quality || 'draft';
      const referenceImage = inputs.referenceImage?.image || null;

      const startTime = Date.now();

      let result;
      switch (backend) {
        case 'fal':
          result = await callBackend('fal', 'generate', {
            prompt,
            aspect_ratio: aspectRatio,
            quality,
            image: referenceImage,
          });
          break;
        case 'google':
          result = await callBackend('google', 'generate', {
            prompt,
            aspect_ratio: aspectRatio,
          });
          break;
        case 'huggingface':
          result = await callBackend('huggingface', 'generate', {
            prompt,
            model: nodeData.model || 'black-forest-labs/FLUX.1-schnell',
            aspect_ratio: aspectRatio,
          });
          break;
        default:
          throw new Error(`Unknown backend: ${backend}`);
      }

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      updateNodeData(node.id, {
        outputImage: result.image,
        executionTime: elapsed,
      });

      return { image: result.image };
    }

    default:
      // Placeholder for Phase 2/3 nodes — pass through
      return {};
  }
}

/**
 * Execute the entire workflow (or a single node and its dependencies).
 */
export async function executeWorkflow(nodes, edges, updateNodeData, setExecutionStatus) {
  const sorted = topologicalSort(nodes, edges);
  const nodeMap = {};
  nodes.forEach((n) => (nodeMap[n.id] = n));

  const nodeOutputs = {};

  setExecutionStatus('running');

  for (const nodeId of sorted) {
    const node = nodeMap[nodeId];
    if (!node) continue;

    // Skip nodes that don't need execution (pure UI nodes without logic)
    const executableTypes = ['briefNode', 'textPromptNode', 'generateNode'];
    if (!executableTypes.includes(node.type)) continue;

    try {
      updateNodeData(nodeId, { executionStatus: 'running', error: null });

      const inputs = collectInputs(nodeId, edges, nodeOutputs);
      const output = await executeNode(node, inputs, updateNodeData);
      nodeOutputs[nodeId] = output;

      updateNodeData(nodeId, { executionStatus: 'done' });
    } catch (err) {
      updateNodeData(nodeId, {
        executionStatus: 'error',
        error: err.message,
      });
      setExecutionStatus('error');
      return; // Stop pipeline on error
    }
  }

  setExecutionStatus('done');

  // Reset to idle after a delay
  setTimeout(() => setExecutionStatus('idle'), 3000);
}

/**
 * Execute a single node (collects upstream data first).
 */
export async function executeSingleNode(nodeId, nodes, edges, updateNodeData, setExecutionStatus) {
  const nodeMap = {};
  nodes.forEach((n) => (nodeMap[n.id] = n));

  const node = nodeMap[nodeId];
  if (!node) return;

  // Gather all upstream outputs by walking backwards
  const sorted = topologicalSort(nodes, edges);
  const nodeOutputs = {};
  const targetIndex = sorted.indexOf(nodeId);

  setExecutionStatus('running');

  // Execute all nodes before this one to gather their outputs
  for (let i = 0; i < sorted.length; i++) {
    const id = sorted[i];
    const n = nodeMap[id];
    if (!n) continue;

    const executableTypes = ['briefNode', 'textPromptNode', 'generateNode'];
    if (!executableTypes.includes(n.type)) continue;

    if (i < targetIndex) {
      // Execute upstream silently to collect data
      try {
        const inputs = collectInputs(id, edges, nodeOutputs);
        const output = await executeNode(n, inputs, updateNodeData);
        nodeOutputs[id] = output;
        updateNodeData(id, { executionStatus: 'done' });
      } catch {
        // Upstream failure — skip
      }
    } else if (id === nodeId) {
      // Execute the target node
      try {
        updateNodeData(nodeId, { executionStatus: 'running', error: null });
        const inputs = collectInputs(nodeId, edges, nodeOutputs);
        const output = await executeNode(node, inputs, updateNodeData);
        nodeOutputs[nodeId] = output;
        updateNodeData(nodeId, { executionStatus: 'done' });
      } catch (err) {
        updateNodeData(nodeId, {
          executionStatus: 'error',
          error: err.message,
        });
        setExecutionStatus('error');
        return;
      }
      break; // Don't execute downstream
    }
  }

  setExecutionStatus('done');
  setTimeout(() => setExecutionStatus('idle'), 3000);
}
