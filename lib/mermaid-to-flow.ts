import type { Node, Edge } from "@xyflow/react";

// ─── Types ─────────────────────────────────────────────────────────────────
interface TreeNode {
  id: string;
  label: string;
  depth: number;
  parentId?: string;
}

// ─── Label cleaner ─────────────────────────────────────────────────────────
function cleanLabel(raw: string): string {
  return raw
    .replace(/^\(\((.+?)\)\)$/, "$1") // ((root))
    .replace(/^\((.+?)\)$/, "$1")     // (node)
    .replace(/^\[(.+?)\]$/, "$1")     // [node]
    .replace(/^\{(.+?)\}$/, "$1")     // {node}
    .replace(/^`(.+?)`$/, "$1")       // `node`
    .replace(/^"(.+?)"$/, "$1")       // "node"
    .replace(/^>(.+?)\]$/, "$1")      // >node]
    .trim();
}

// ─── Mindmap Parser ────────────────────────────────────────────────────────
function parseMindmap(lines: string[]): { nodes: Node[]; edges: Edge[] } {
  const treeNodes: TreeNode[] = [];
  const stack: TreeNode[] = [];
  let nodeCount = 0;

  // Determine base indent unit from the first non-empty, non-directive line
  let baseIndent = 0;
  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (!trimmed.trim()) continue;
    const spaces = trimmed.length - trimmed.trimStart().length;
    if (spaces > 0) { baseIndent = spaces; break; }
  }
  if (baseIndent === 0) baseIndent = 2;

  for (const line of lines) {
    const raw = line.trimEnd();
    if (!raw.trim()) continue;

    const spaces = raw.length - raw.trimStart().length;
    const depth = Math.round(spaces / baseIndent);
    const label = cleanLabel(raw.trim());
    if (!label) continue;

    const id = `node-${nodeCount++}`;

    // Pop stack to correct parent level
    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }

    const parentId = stack.length > 0 ? stack[stack.length - 1].id : undefined;
    const treeNode: TreeNode = { id, label, depth, parentId };
    stack.push(treeNode);
    treeNodes.push(treeNode);
  }

  const nodes: Node[] = treeNodes.map((n) => ({
    id: n.id,
    type: "audioNode",
    data: { label: n.label, isRoot: !n.parentId },
    position: { x: 0, y: 0 },
  }));

  const edges: Edge[] = treeNodes
    .filter((n) => n.parentId)
    .map((n) => ({
      id: `e-${n.parentId}-${n.id}`,
      source: n.parentId!,
      target: n.id,
      type: "smoothstep",
      style: { stroke: "#2a3040", strokeWidth: 1.5 },
    }));

  return { nodes, edges };
}

// ─── Flowchart Parser ──────────────────────────────────────────────────────
function parseFlowchart(lines: string[]): { nodes: Node[]; edges: Edge[] } {
  const nodeMap = new Map<string, Node>();
  const edges: Edge[] = [];
  let edgeCount = 0;

  const nodePat = /([A-Za-z0-9_]+)(?:\[\[([^\]]+)\]\]|\[([^\]]+)\]|\(\(([^)]+)\)\)|\(([^)]+)\)|\{([^}]+)\}|>([^\]]+)\])/g;
  const edgePat =
    /([A-Za-z0-9_]+)\s*(?:-->(?:\|[^|]*\|)?|---(?:\|[^|]*\|)?|-\.->|===>|--[^>]*-->)\s*([A-Za-z0-9_]+)/g;

  const ensure = (id: string) => {
    if (!nodeMap.has(id)) {
      nodeMap.set(id, {
        id,
        type: "audioNode",
        data: { label: id, isRoot: false },
        position: { x: 0, y: 0 },
      });
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || /^(graph|flowchart|subgraph|end)\b/i.test(trimmed)) continue;

    let m;
    nodePat.lastIndex = 0;
    while ((m = nodePat.exec(trimmed)) !== null) {
      const id = m[1];
      const label = m[2] ?? m[3] ?? m[4] ?? m[5] ?? m[6] ?? m[7] ?? id;
      nodeMap.set(id, {
        id,
        type: "audioNode",
        data: { label: cleanLabel(label), isRoot: false },
        position: { x: 0, y: 0 },
      });
    }

    edgePat.lastIndex = 0;
    while ((m = edgePat.exec(trimmed)) !== null) {
      ensure(m[1]);
      ensure(m[2]);
      edges.push({
        id: `e-${edgeCount++}`,
        source: m[1],
        target: m[2],
        type: "smoothstep",
        style: { stroke: "#2a3040", strokeWidth: 1.5 },
      });
    }
  }

  return { nodes: Array.from(nodeMap.values()), edges };
}

// ─── Auto Layout (hierarchical top-down) ──────────────────────────────────
function autoLayout(nodes: Node[], edges: Edge[]): Node[] {
  if (nodes.length === 0) return nodes;

  // Build adjacency
  const children = new Map<string, string[]>();
  const hasIncoming = new Set<string>();
  for (const e of edges) {
    if (!children.has(e.source)) children.set(e.source, []);
    children.get(e.source)!.push(e.target);
    hasIncoming.add(e.target);
  }

  const roots = nodes.filter((n) => !hasIncoming.has(n.id));
  if (roots.length === 0) {
    // No tree root — grid layout
    return nodes.map((n, i) => ({
      ...n,
      position: { x: (i % 4) * 240, y: Math.floor(i / 4) * 140 },
    }));
  }

  // Compute subtree sizes for centering
  const subtreeWidth = new Map<string, number>();
  const NODE_W = 220;
  const NODE_H = 160;

  function calcWidth(id: string): number {
    const ch = children.get(id) ?? [];
    if (ch.length === 0) { subtreeWidth.set(id, NODE_W); return NODE_W; }
    const w = ch.reduce((sum, c) => sum + calcWidth(c) + 20, -20);
    subtreeWidth.set(id, Math.max(NODE_W, w));
    return subtreeWidth.get(id)!;
  }

  roots.forEach((r) => calcWidth(r.id));

  const positions = new Map<string, { x: number; y: number }>();

  function place(id: string, x: number, y: number) {
    positions.set(id, { x, y });
    const ch = children.get(id) ?? [];
    if (ch.length === 0) return;
    const totalW = ch.reduce((s, c) => s + (subtreeWidth.get(c) ?? NODE_W) + 20, -20);
    let cx = x - totalW / 2;
    for (const c of ch) {
      const cw = subtreeWidth.get(c) ?? NODE_W;
      place(c, cx + cw / 2, y + NODE_H);
      cx += cw + 20;
    }
  }

  let startX = 0;
  for (const r of roots) {
    const w = subtreeWidth.get(r.id) ?? NODE_W;
    place(r.id, startX + w / 2, 0);
    startX += w + 60;
  }

  return nodes.map((n) => ({
    ...n,
    position: positions.get(n.id) ?? { x: 0, y: 0 },
  }));
}

// ─── Main export ───────────────────────────────────────────────────────────
export function mermaidToFlow(code: string): { nodes: Node[]; edges: Edge[] } {
  const lines = code.split("\n");
  const firstLine = lines[0]?.trim().toLowerCase() ?? "";

  let result: { nodes: Node[]; edges: Edge[] };

  if (firstLine.startsWith("mindmap")) {
    result = parseMindmap(lines.slice(1));
  } else if (firstLine.startsWith("graph") || firstLine.startsWith("flowchart")) {
    result = parseFlowchart(lines.slice(1));
  } else {
    result = parseMindmap(lines); // Try mindmap as default
  }

  // Mark root nodes
  const hasIncoming = new Set(result.edges.map((e) => e.target));
  result.nodes = result.nodes.map((n) => ({
    ...n,
    data: { ...n.data, isRoot: !hasIncoming.has(n.id) },
  }));

  result.nodes = autoLayout(result.nodes, result.edges);
  return result;
}

// ─── Nodes → Markdown ──────────────────────────────────────────────────────
export function flowToMarkdown(nodes: Node[], edges: Edge[]): string {
  if (nodes.length === 0) return "";

  const children = new Map<string, string[]>();
  const hasIncoming = new Set<string>();
  for (const e of edges) {
    if (!children.has(e.source)) children.set(e.source, []);
    children.get(e.source)!.push(e.target);
    hasIncoming.add(e.target);
  }

  const roots = nodes.filter((n) => !hasIncoming.has(n.id));
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const lines: string[] = [];

  function walk(id: string, depth: number) {
    const node = nodeMap.get(id);
    if (!node) return;
    const label = (node.data as { label: string }).label;
    if (depth === 0) {
      lines.push(`# ${label}`);
    } else if (depth === 1) {
      lines.push(`\n## ${label}`);
    } else {
      lines.push(`${"  ".repeat(depth - 2)}- ${label}`);
    }
    (children.get(id) ?? []).forEach((c) => walk(c, depth + 1));
  }

  roots.forEach((r) => walk(r.id, 0));
  return lines.join("\n");
}
