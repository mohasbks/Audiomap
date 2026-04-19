"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Handle,
  Position,
  type ReactFlowInstance,
  type Node,
  type Edge,
  type Connection,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { mermaidToFlow } from "@/lib/mermaid-to-flow";

// ─── Custom Node ───────────────────────────────────────────────────────────
type AudioNodeData = { label: string; isRoot?: boolean };

function AudioNode({ data, selected }: NodeProps) {
  const { label, isRoot } = data as AudioNodeData;

  return (
    <div
      style={{
        padding: isRoot ? "14px 28px" : "9px 18px",
        borderRadius: isRoot ? "14px" : "8px",
        background: isRoot ? "var(--surface-2)" : "var(--surface)",
        border: selected
          ? "1.5px solid var(--accent)"
          : isRoot
          ? "1.5px solid var(--border-2)"
          : "1px solid var(--border)",
        color: isRoot ? "var(--text)" : "var(--text-2)",
        fontSize: isRoot ? "14px" : "12px",
        fontWeight: isRoot ? 700 : 500,
        fontFamily: "'Inter', sans-serif",
        maxWidth: "200px",
        minWidth: isRoot ? "120px" : "80px",
        textAlign: "center",
        boxShadow: isRoot
          ? "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(74,123,189,0.12)"
          : selected
          ? "0 0 0 3px rgba(74,123,189,0.2)"
          : "0 2px 8px rgba(0,0,0,0.2)",
        transition: "box-shadow 0.15s, border-color 0.15s",
        letterSpacing: isRoot ? "-0.02em" : "0",
        lineHeight: 1.4,
        wordBreak: "break-word",
        cursor: "grab",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "var(--border-2)",
          border: "none",
          width: 6,
          height: 6,
          top: -3,
        }}
      />
      {label}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "var(--border-2)",
          border: "none",
          width: 6,
          height: 6,
          bottom: -3,
        }}
      />
    </div>
  );
}

const nodeTypes = { audioNode: AudioNode };

// ─── Props ─────────────────────────────────────────────────────────────────
export interface FlowCanvasProps {
  code: string;
  onStateChange?: (nodes: Node[], edges: Edge[]) => void;
  canvasDivRef?: React.RefObject<HTMLDivElement | null>;
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function FlowCanvas({
  code,
  onStateChange,
  canvasDivRef,
}: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  // Parse new Mermaid code into nodes/edges
  useEffect(() => {
    if (!code) return;
    const { nodes: n, edges: e } = mermaidToFlow(code);
    setNodes(n as Node[]);
    setEdges(e as Edge[]);
  }, [code, setNodes, setEdges]);

  // Fit view after nodes load
  useEffect(() => {
    if (nodes.length > 0 && rfInstance) {
      const t = setTimeout(
        () => rfInstance.fitView({ padding: 0.15, duration: 600 }),
        80
      );
      return () => clearTimeout(t);
    }
  }, [nodes.length, rfInstance]);

  // Sync state up for exports
  useEffect(() => {
    onStateChange?.(nodes, edges);
  }, [nodes, edges, onStateChange]);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            style: { stroke: "#2a3040", strokeWidth: 1.5 },
          },
          eds
        )
      ),
    [setEdges]
  );

  return (
    <div ref={canvasDivRef} style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { stroke: "#2a3040", strokeWidth: 1.5 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="#1e2330"
        />
        <Controls
          showInteractive={false}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}
        />
        <MiniMap
          nodeColor={() => "#191d25"}
          maskColor="rgba(0,0,0,0.5)"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
          }}
        />
      </ReactFlow>
    </div>
  );
}
