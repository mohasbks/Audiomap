"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Edge, Node } from "@xyflow/react";
import AudioRecorder from "@/components/AudioRecorder";
import { ThemeToggle } from "@/components/ThemeToggle";
import { flowToMarkdown } from "@/lib/mermaid-to-flow";
import { getProject, getProjects, saveProject } from "@/lib/storage";

const FlowCanvas = dynamic(() => import("@/components/FlowCanvas"), {
  ssr: false,
  loading: () => <div className="canvas-loading" role="status">Preparing the interactive canvas…</div>,
});

type Step = "idle" | "generating" | "done" | "error";
type InputMode = "text" | "voice";
interface ResourceLink { title: string; url: string; type: "course" | "doc" | "video" | "article" }
interface ResourceGroup { topic: string; links: ResourceLink[] }
interface HistoryItem { id: string; transcript: string; mermaid: string; resources: ResourceGroup[] }
interface GenerationMeta { mode: "ai" | "local"; model: string; notice?: string }

const EXAMPLES = [
  { label: "Product plan", text: "Map a launch plan for a subscription productivity app, from research to public release." },
  { label: "Study topic", text: "Explain machine learning as a study map with foundations, model types, evaluation, and practical projects." },
  { label: "Content system", text: "Design a content system for a personal brand across LinkedIn, Instagram, and a weekly newsletter." },
];

async function generateMap(text: string): Promise<{ mermaid: string; resources: ResourceGroup[]; meta: GenerationMeta }> {
  const response = await fetch("/api/generate-map", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || "Map generation failed");
  return { mermaid: data.mermaid, resources: data.resources ?? [], meta: data.meta };
}

function AppWorkspaceInner() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("idle");
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const [resources, setResources] = useState<ResourceGroup[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState("");
  const [flowNodes, setFlowNodes] = useState<Node[]>([]);
  const [flowEdges, setFlowEdges] = useState<Edge[]>([]);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [generationMeta, setGenerationMeta] = useState<GenerationMeta | null>(null);
  const [generationStage, setGenerationStage] = useState(0);
  const canvasDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProjects().then((projects) => setHistory(projects.slice(0, 10).map((project) => ({ id: project.id, transcript: project.transcript, mermaid: project.mermaid, resources: project.resources as ResourceGroup[] }))));
  }, []);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;
    getProject(id).then((project) => {
      if (!project) return;
      setMermaidCode(project.mermaid);
      setTranscript(project.transcript);
      setTextInput(project.transcript);
      setResources(project.resources as ResourceGroup[]);
      setCurrentProjectId(project.id);
      setStep("done");
    });
  }, [searchParams]);

  useEffect(() => {
    if (step !== "generating") return;
    const timer = window.setInterval(() => setGenerationStage((stage) => Math.min(stage + 1, 2)), 1500);
    return () => window.clearInterval(timer);
  }, [step]);

  const handleFlowStateChange = useCallback((nodes: Node[], edges: Edge[]) => { setFlowNodes(nodes); setFlowEdges(edges); }, []);

  const processText = useCallback(async (text: string) => {
    const cleaned = text.trim();
    if (!cleaned) return;
    setTranscript(cleaned);
    setTextInput(cleaned);
    setGenerationStage(0);
    setStep("generating");
    setErrorMsg("");
    setResources([]);
    setResourcesOpen(false);
    setGenerationMeta(null);
    const projectId = currentProjectId || Date.now().toString();
    setCurrentProjectId(projectId);
    try {
      const result = await generateMap(cleaned);
      setMermaidCode(result.mermaid);
      setResources(result.resources);
      setGenerationMeta(result.meta);
      setHistory((previous) => [{ id: projectId, transcript: cleaned, mermaid: result.mermaid, resources: result.resources }, ...previous.filter((item) => item.id !== projectId)].slice(0, 10));
      const name = cleaned.length > 48 ? `${cleaned.slice(0, 48)}…` : cleaned;
      await saveProject({ id: projectId, name, transcript: cleaned, mermaid: result.mermaid, nodes: [], edges: [], resources: result.resources });
      setSavedMsg("Saved locally");
      setTimeout(() => setSavedMsg(""), 2500);
      setStep("done");
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : "Failed to generate map. Try again.");
      setStep("error");
    }
  }, [currentProjectId]);

  const reset = () => {
    setStep("idle"); setTranscript(""); setTextInput(""); setMermaidCode(""); setResources([]); setErrorMsg(""); setCurrentProjectId(""); setResourcesOpen(false); setGenerationMeta(null); setExportOpen(false);
  };

  const handleCopyCode = async () => { await navigator.clipboard.writeText(mermaidCode); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const downloadDataUrl = (url: string, filename: string) => { const link = document.createElement("a"); link.download = filename; link.href = url; link.click(); };
  const handleExportPng = async () => { if (canvasDivRef.current) { const { toPng } = await import("html-to-image"); downloadDataUrl(await toPng(canvasDivRef.current, { backgroundColor: "#0a0b0e", pixelRatio: 2 }), "audiomap.png"); } };
  const handleExportSvg = async () => { if (canvasDivRef.current) { const { toSvg } = await import("html-to-image"); downloadDataUrl(await toSvg(canvasDivRef.current, { backgroundColor: "#0a0b0e" }), "audiomap.svg"); } };
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify({ transcript, mermaid: mermaidCode, nodes: flowNodes, edges: flowEdges, resources, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); downloadDataUrl(url, "audiomap.json"); URL.revokeObjectURL(url);
  };
  const handleCopyMarkdown = async () => { await navigator.clipboard.writeText(flowToMarkdown(flowNodes, flowEdges)); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const isProcessing = step === "generating";
  const hasMap = Boolean(mermaidCode);
  const stageLabels = ["Reading your input", "Structuring branches", "Laying out the map"];

  return (
    <div className="app-layout">
      <aside className="app-sidebar" aria-label="Map input and recent projects">
        <header className="workspace-brand">
          <Link href="/" className="workspace-logo"><span aria-hidden="true" />audiomap</Link>
          <div className="workspace-brand-actions"><ThemeToggle /><Link href="/dashboard" className="square-action" aria-label="Open saved maps" title="Saved maps"><GridIcon /></Link></div>
        </header>

        <div className="workspace-sidebar-body">
          <section aria-labelledby="create-map-title">
            <div className="section-kicker"><span>01</span><h1 id="create-map-title">Turn an idea into structure</h1></div>
            <div className="input-tabs" role="tablist" aria-label="Input method">
              <button role="tab" aria-selected={inputMode === "text"} className={inputMode === "text" ? "is-active" : ""} onClick={() => setInputMode("text")}>Text</button>
              <button role="tab" aria-selected={inputMode === "voice"} className={inputMode === "voice" ? "is-active" : ""} onClick={() => setInputMode("voice")}>Voice</button>
            </div>

            {inputMode === "text" ? (
              <form onSubmit={(event) => { event.preventDefault(); processText(textInput); }} className="map-composer">
                <label htmlFor="map-prompt">Describe the topic, outcome, or system you want to understand.</label>
                <textarea id="map-prompt" value={textInput} onChange={(event) => setTextInput(event.target.value.slice(0, 1200))} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); processText(textInput); } }} placeholder="Example: Map the launch plan for a new digital product…" rows={6} disabled={isProcessing} autoFocus />
                <div className="composer-meta"><span>{textInput.length}/1200</span><span>Ctrl/⌘ + Enter</span></div>
                <button type="submit" className="generate-button" disabled={isProcessing || textInput.trim().length < 8}>{isProcessing ? "Building map…" : <>Generate map <span aria-hidden="true">→</span></>}</button>
              </form>
            ) : <div className="voice-panel"><p>Record a thought; Audiomap will transcribe it before building the map.</p><AudioRecorder onTranscript={processText} onError={(message) => { setErrorMsg(message); setStep("error"); }} isProcessing={isProcessing} /></div>}

            {!hasMap && step === "idle" ? <div className="quick-start"><p>Try a starting point</p>{EXAMPLES.map((example) => <button key={example.label} onClick={() => { setTextInput(example.text); setInputMode("text"); }}>{example.label}<span aria-hidden="true">↗</span></button>)}</div> : null}

            {step !== "idle" ? (
              <div className={`generation-status status-${step}`} role="status" aria-live="polite">
                {isProcessing ? <><span className="status-dot" aria-hidden="true" /><div><strong>{stageLabels[generationStage]}</strong><span>Step {generationStage + 1} of 3</span></div></> : null}
                {step === "done" ? <><span className="status-check" aria-hidden="true">✓</span><div><strong>Map ready</strong><span>{generationMeta?.mode === "ai" ? `AI · ${generationMeta.model}` : "Local structurer"}{savedMsg ? ` · ${savedMsg}` : ""}</span></div></> : null}
                {step === "error" ? <><span aria-hidden="true">!</span><div><strong>Could not build the map</strong><span>{errorMsg}</span></div></> : null}
              </div>
            ) : null}
            {generationMeta?.notice ? <p className="generation-notice" role="status">{generationMeta.notice}</p> : null}
            {(step === "done" || step === "error") ? <button onClick={reset} className="new-map-button">+ Start a new map</button> : null}
          </section>

          <section className="recent-section" aria-labelledby="recent-title">
            <div className="section-kicker"><span>02</span><h2 id="recent-title">Recent maps</h2></div>
            {history.length ? <div className="recent-list">{history.map((item) => <button key={item.id} onClick={() => { setMermaidCode(item.mermaid); setTranscript(item.transcript); setTextInput(item.transcript); setResources(item.resources); setCurrentProjectId(item.id); setStep("done"); setResourcesOpen(false); }}><span className="recent-icon" aria-hidden="true"><ClockIcon /></span><span>{item.transcript}</span></button>)}</div> : <p className="history-empty">Your generated maps will be saved on this device.</p>}
          </section>
        </div>
      </aside>

      <main className="app-main">
        <header className="canvas-toolbar">
          <div className="canvas-context">
            <span className={hasMap ? "canvas-live" : ""} aria-hidden="true" />
            <div><strong>{hasMap ? "Interactive map" : "New workspace"}</strong><span>{hasMap ? `${flowNodes.length} nodes · drag to rearrange` : "Choose a prompt or describe your own idea"}</span></div>
          </div>
          <div className={`canvas-toolbar-actions ${hasMap ? "" : "is-disabled"}`}>
            <button onClick={handleCopyCode} disabled={!hasMap} className="toolbar-button">{copied ? "Copied" : "Copy code"}</button>
            {resources.length ? <button onClick={() => setResourcesOpen((open) => !open)} disabled={!hasMap} className={`toolbar-button ${resourcesOpen ? "is-active" : ""}`}>Resources <span>{resources.reduce((sum, group) => sum + group.links.length, 0)}</span></button> : null}
            <div className="export-menu">
              <button onClick={() => setExportOpen((open) => !open)} disabled={!hasMap} className="toolbar-button primary" aria-expanded={exportOpen}>Export <span aria-hidden="true">⌄</span></button>
              {exportOpen ? <div className="export-popover"><button onClick={handleExportPng}><strong>PNG image</strong><span>Best for sharing</span></button><button onClick={handleExportSvg}><strong>SVG vector</strong><span>Best for editing</span></button><button onClick={handleExportJson}><strong>JSON data</strong><span>Nodes and links</span></button><button onClick={handleCopyMarkdown}><strong>Copy Markdown</strong><span>Text outline</span></button></div> : null}
            </div>
          </div>
        </header>

        <div className="canvas-stage">
          {!hasMap ? <EmptyState onExample={(text) => { setTextInput(text); setInputMode("text"); }} /> : <FlowCanvas code={mermaidCode} onStateChange={handleFlowStateChange} canvasDivRef={canvasDivRef} />}
          {resourcesOpen && resources.length ? <ResourcesPanel groups={resources} onClose={() => setResourcesOpen(false)} /> : null}
          {isProcessing && hasMap ? <div className="canvas-progress" role="status"><span className="status-dot" />Updating map · {stageLabels[generationStage]}</div> : null}
        </div>
      </main>
    </div>
  );
}

function EmptyState({ onExample }: { onExample: (text: string) => void }) {
  return <section className="canvas-empty" aria-labelledby="empty-map-title"><div className="empty-symbol" aria-hidden="true"><MapIcon /></div><p className="empty-kicker">From thought to structure</p><h2 id="empty-map-title">What do you want to make sense of?</h2><p>Start with a clear outcome. Audiomap will organize it into branches you can move, inspect, and export.</p><div className="empty-examples">{EXAMPLES.map((example) => <button key={example.label} onClick={() => onExample(example.text)}><span>{example.label}</span><small>{example.text}</small></button>)}</div></section>;
}

function ResourcesPanel({ groups, onClose }: { groups: ResourceGroup[]; onClose: () => void }) {
  return <aside className="resources-panel" aria-label="Curated resources"><header><div><span>Research layer</span><h2>Curated resources</h2></div><button onClick={onClose} aria-label="Close resources">×</button></header><div className="resources-grid">{groups.map((group) => <section key={group.topic}><h3>{group.topic}</h3>{group.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"><span>{link.type}</span><strong>{link.title}</strong><b aria-hidden="true">↗</b></a>)}</section>)}</div></aside>;
}

function GridIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>; }
function ClockIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>; }
function MapIcon() { return <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="5" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 12h4c3 0 3-6 6-6M7 12h4c3 0 3 6 6 6"/></svg>; }

export default function AppWorkspace() {
  return <Suspense fallback={<div className="workspace-fallback" role="status">Opening your workspace…</div>}><AppWorkspaceInner /></Suspense>;
}
