import React, { useState, useMemo } from 'react';
import { FlowNode, FlowEdge } from '../types';
import { Info, X } from 'lucide-react';

interface Props {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

const InteractiveFlowchart: React.FC<Props> = ({ nodes, edges }) => {
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);

  // Simple automated layout calculation
  // We group nodes by 'stepOrder' (layers)
  const layout = useMemo(() => {
    const layers: { [key: number]: FlowNode[] } = {};
    nodes.forEach(n => {
      if (!layers[n.stepOrder]) layers[n.stepOrder] = [];
      layers[n.stepOrder].push(n);
    });

    const levelHeight = 150;
    const nodeWidth = 160;
    const nodeHeight = 60;
    const canvasWidth = 800;
    const canvasHeight = (Math.max(...Object.keys(layers).map(Number)) + 1) * levelHeight;

    const computedNodes = nodes.map(node => {
      const layerNodes = layers[node.stepOrder];
      const indexInLayer = layerNodes.findIndex(n => n.id === node.id);
      const totalInLayer = layerNodes.length;
      
      // Center items in the layer
      const startX = (canvasWidth - (totalInLayer * (nodeWidth + 40))) / 2;
      const x = startX + indexInLayer * (nodeWidth + 40) + nodeWidth / 2;
      const y = node.stepOrder * levelHeight;

      return { ...node, x, y };
    });

    return { computedNodes, width: canvasWidth, height: canvasHeight, nodeWidth, nodeHeight };
  }, [nodes]);

  return (
    <div className="flex flex-col md:flex-row h-[600px] border border-slate-700 rounded-2xl bg-slate-900 overflow-hidden">
      {/* SVG Canvas */}
      <div className="flex-1 overflow-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-900 relative">
        <svg 
          width={layout.width} 
          height={layout.height} 
          className="min-w-full min-h-full mx-auto"
          viewBox={`0 0 ${layout.width} ${layout.height}`}
        >
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge, i) => {
            const start = layout.computedNodes.find(n => n.id === edge.from);
            const end = layout.computedNodes.find(n => n.id === edge.to);
            if (!start || !end) return null;

            return (
              <g key={i}>
                <path
                  d={`M ${start.x} ${start.y + layout.nodeHeight/2} C ${start.x} ${start.y + 100}, ${end.x} ${end.y - 100}, ${end.x} ${end.y - layout.nodeHeight/2}`}
                  stroke="#475569"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className="transition-all duration-300"
                />
                {edge.label && (
                   <text 
                     x={(start.x + end.x) / 2} 
                     y={(start.y + end.y) / 2} 
                     fill="#94a3b8" 
                     fontSize="12" 
                     textAnchor="middle"
                     className="bg-slate-900"
                   >
                     {edge.label}
                   </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {layout.computedNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <g 
                key={node.id} 
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer hover:opacity-90 transition-opacity"
              >
                <rect
                  x={node.x - layout.nodeWidth / 2}
                  y={node.y - layout.nodeHeight / 2}
                  width={layout.nodeWidth}
                  height={layout.nodeHeight}
                  rx="12"
                  fill={isSelected ? '#06b6d4' : '#1e293b'}
                  stroke={isSelected ? '#22d3ee' : '#334155'}
                  strokeWidth="2"
                  className="transition-all duration-300 shadow-lg"
                />
                <text
                  x={node.x}
                  y={node.y}
                  dy=".3em"
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : '#e2e8f0'}
                  fontWeight="600"
                  fontSize="14"
                  pointerEvents="none"
                >
                  {node.label.length > 18 ? node.label.substring(0, 16) + '...' : node.label}
                </text>
              </g>
            );
          })}
        </svg>
        
        <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur px-3 py-1 rounded-full text-xs text-slate-400 border border-slate-700">
          Click nodes to explore
        </div>
      </div>

      {/* Info Sidebar */}
      <div className={`
        bg-slate-800 border-l border-slate-700 transition-all duration-300 overflow-y-auto
        ${selectedNode ? 'w-full md:w-80 p-6' : 'w-0 p-0 overflow-hidden'}
      `}>
        {selectedNode && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Info className="text-cyan-400" size={24} />
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{selectedNode.label}</h3>
            <div className="h-1 w-12 bg-cyan-500 rounded-full mb-6"></div>
            
            <div className="prose prose-invert prose-sm">
              <p className="text-slate-300 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            <div className="mt-auto pt-8">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Step Level {selectedNode.stepOrder}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveFlowchart;