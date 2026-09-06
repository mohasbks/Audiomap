"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AudioRecorder from "@/components/AudioRecorder";
import { ThemeToggle } from "@/components/ThemeToggle";
import { flowToMarkdown } from "@/lib/mermaid-to-flow";
import { saveProject, getProject } from "@/lib/storage";
import type { Node, Edge } from "@xyflow/react";

const FlowCanvas = dynamic(() => import("@/components/FlowCanvas"), {
  ssr: false,
  loading: () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--muted)", fontSize: "13px" }}>
      Loading canvas...
    </div>
  ),
});

// ─── Types ─────────────────────────────────────────────────────────────────
type Step = "idle" | "generating" | "done" | "error";
type InputMode = "voice" | "text";

interface ResourceLink {
  title: string;
  url: string;
  type: "course" | "doc" | "video" | "article";
}
interface ResourceGroup {
  topic: string;
  links: ResourceLink[];
}
interface HistoryItem {
  id: string;
  transcript: string;
  mermaid: string;
  resources: ResourceGroup[];
}

const TYPE_ICONS: Record<string, string> = {
  course: "🎓",
  doc: "📄",
  video: "▶️",
  article: "📝",
};

// ─── API call ──────────────────────────────────────────────────────────────
interface GenerationMeta { mode: "ai" | "local"; model: string; notice?: string }

async function generateMap(text: string): Promise<{ mermaid: string; resources: ResourceGroup[]; meta: GenerationMeta }> {
  const res = await fetch("/api/generate-map", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || "Map generation failed");
  return { mermaid: data.mermaid, resources: data.resources ?? [], meta: data.meta };
}

// ─── Main Component ────────────────────────────────────────────────────────
function AppWorkspaceInner() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("idle");
  const [inputMode, setInputMode] = useState<InputMode>("voice");
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const [resources, setResources] = useState<ResourceGroup[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState<string>("");
  const [flowNodes, setFlowNodes] = useState<Node[]>([]);
  const [flowEdges, setFlowEdges] = useState<Edge[]>([]);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [generationMeta, setGenerationMeta] = useState<GenerationMeta | null>(null);

  const canvasDivRef = useRef<HTMLDivElement>(null);

  // Load project from URL ?id=
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;
    getProject(id).then((p) => {
      if (!p) return;
      setMermaidCode(p.mermaid);
      setTranscript(p.transcript);
      setResources(p.resources as ResourceGroup[]);
      setCurrentProjectId(p.id);
      setStep("done");
    });
  }, [searchParams]);

  // ─── Handlers ─────────────────────────────────────────────────────────
  const handleFlowStateChange = useCallback((nodes: Node[], edges: Edge[]) => {
    setFlowNodes(nodes);
    setFlowEdges(edges);
  }, []);

  const processText = useCallback(async (text: string) => {
    setTranscript(text);
    setStep("generating");
    setErrorMsg("");
    setResources([]);
    setResourcesOpen(false);
    setGenerationMeta(null);
    const projectId = currentProjectId || Date.now().toString();
    setCurrentProjectId(projectId);

    try {
      const result = await generateMap(text);
      setMermaidCode(result.mermaid);
      setResources(result.resources);
      setGenerationMeta(result.meta);
      setHistory((prev) => [
        { id: projectId, transcript: text, mermaid: result.mermaid, resources: result.resources },
        ...prev.filter((i) => i.transcript !== text).slice(0, 9),
      ]);

      // Auto-save to IndexedDB
      const name = text.length > 40 ? text.slice(0, 40) + "…" : text;
      await saveProject({
        id: projectId,
        name,
        transcript: text,
        mermaid: result.mermaid,
        nodes: [],
        edges: [],
        resources: result.resources,
      });

      setSavedMsg("Saved!");
      setTimeout(() => setSavedMsg(""), 2500);
      setStep("done");
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to generate map. Try again.");
      setStep("error");
    }
  }, [currentProjectId]);

  const handleTextSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!textInput.trim()) return;
      await processText(textInput.trim());
    },
    [textInput, processText]
  );

  const handleError = useCallback((msg: string) => {
    setErrorMsg(msg);
    setStep("error");
  }, []);

  const reset = () => {
    setStep("idle");
    setTranscript("");
    setMermaidCode("");
    setResources([]);
    setErrorMsg("");
    setTextInput("");
    setCurrentProjectId("");
    setResourcesOpen(false);
    setGenerationMeta(null);
  };

  // ─── Export functions ──────────────────────────────────────────────────
  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPng = async () => {
    if (!canvasDivRef.current) return;
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(canvasDivRef.current, {
        backgroundColor: "#0a0b0e",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = "audiomap.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("PNG export failed:", err);
    }
  };

  const handleExportSvg = async () => {
    if (!canvasDivRef.current) return;
    try {
      const { toSvg } = await import("html-to-image");
      const dataUrl = await toSvg(canvasDivRef.current, {
        backgroundColor: "#0a0b0e",
      });
      const link = document.createElement("a");
      link.download = "audiomap.svg";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("SVG export failed:", err);
    }
  };

  const handleExportJson = () => {
    const data = {
      transcript,
      mermaid: mermaidCode,
      nodes: flowNodes,
      edges: flowEdges,
      resources,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "audiomap.json";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = async () => {
    const md = flowToMarkdown(flowNodes, flowEdges);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isProcessing = step === "generating";
  const hasMap = !!mermaidCode;

  return (
    <div className="app-layout">

      {/* ─── LEFT SIDEBAR ─── */}
      <aside className="app-sidebar">

        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "9px", fontWeight: 700, fontSize: "15px", color: "var(--text)", textDecoration: "none" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "5px", background: "linear-gradient(135deg, var(--accent) 0%, #3b5b7d 100%)" }} />
            audiomap
          </Link>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <ThemeToggle />
            <Link href="/dashboard" title="My Maps" style={{
              width: "36px", height: "36px", borderRadius: "8px",
              border: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-2)", textDecoration: "none", transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-2)"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: "20px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Input Mode Toggle */}
          <div>
            <div style={{ display: "flex", padding: "3px", background: "rgba(0,0,0,0.15)", borderRadius: "8px", marginBottom: "14px", border: "1px solid var(--border)" }}>
              {(["voice", "text"] as InputMode[]).map((mode) => (
                <button key={mode} onClick={() => setInputMode(mode)} style={{
                  flex: 1, padding: "8px", background: inputMode === mode ? "var(--bg)" : "transparent",
                  border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
                  color: inputMode === mode ? "var(--text)" : "var(--muted)",
                  boxShadow: inputMode === mode ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                  {mode === "voice" ? "🎙 Voice" : "✍️ Text"}
                </button>
              ))}
            </div>

            {inputMode === "voice" ? (
              <AudioRecorder onTranscript={processText} onError={handleError} isProcessing={isProcessing} />
            ) : (
              <form onSubmit={handleTextSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="e.g. Map out a user registration flow..."
                  rows={5}
                  disabled={isProcessing}
                  style={{
                    width: "100%", padding: "12px", background: "rgba(0,0,0,0.12)",
                    border: "1px solid var(--border)", borderRadius: "8px",
                    color: "var(--text)", fontSize: "13px", lineHeight: 1.6,
                    resize: "none", outline: "none", fontFamily: "inherit",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button type="submit" disabled={isProcessing || !textInput.trim()} style={{
                  padding: "11px", width: "100%",
                  background: isProcessing || !textInput.trim() ? "var(--border)" : "var(--accent)",
                  color: "#fff", border: "none", borderRadius: "8px",
                  fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s",
                }}>
                  {isProcessing ? "Generating…" : "Generate Map →"}
                </button>
              </form>
            )}

            {/* Status */}
            {step !== "idle" && (
              <div style={{
                marginTop: "12px", padding: "10px 12px", borderRadius: "8px",
                background: "var(--bg)", border: "1px solid var(--border)",
                fontSize: "12px", color: step === "error" ? "var(--error)" : "var(--muted)", lineHeight: 1.5,
              }}>
                {step === "generating" && (
                  <span>
                    <span className="pulse-ring" style={{ display: "inline-block", width: "7px", height: "7px", background: "var(--accent)", borderRadius: "50%", marginRight: "8px" }} />
                    Generating mind map…
                  </span>
                )}
                {step === "done" && transcript && (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ color: "var(--accent)" }}>✓</span>
                    &quot;{transcript.length > 60 ? transcript.slice(0, 60) + "…" : transcript}&quot;
                    {savedMsg && (
                      <span style={{ marginLeft: "auto", color: "var(--accent)", fontWeight: 600, fontSize: "11px" }}>
                        {savedMsg}
                      </span>
                    )}
                  </span>
                )}
                {step === "done" && generationMeta?.notice && (
                  <span style={{ display: "block", marginTop: "8px", color: "#d4a853" }}>{generationMeta.notice}</span>
                )}
                {step === "error" && <span>⚠ {errorMsg}</span>}
              </div>
            )}

            {(step === "done" || step === "error") && (
              <button onClick={reset} style={{
                marginTop: "10px", padding: "8px", width: "100%", background: "transparent",
                border: "1px dashed var(--border-2)", borderRadius: "8px",
                color: "var(--muted)", fontSize: "12px", cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { (e.currentTarget.style.borderColor = "var(--accent)"); (e.currentTarget.style.color = "var(--accent)"); }}
                onMouseLeave={(e) => { (e.currentTarget.style.borderColor = "var(--border-2)"); (e.currentTarget.style.color = "var(--muted)"); }}
              >
                + New Map
              </button>
            )}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

          {/* Recent sessions */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>
              Recent Sessions
            </p>
            {history.length === 0 ? (
              <div style={{ padding: "14px", textAlign: "center", border: "1px dashed var(--border)", borderRadius: "8px", fontSize: "12px", color: "var(--muted)" }}>
                No history yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {history.map((item) => (
                  <button key={item.id}
                    onClick={() => { setMermaidCode(item.mermaid); setTranscript(item.transcript); setResources(item.resources); setStep("done"); setResourcesOpen(false); }}
                    style={{
                      padding: "9px 12px", background: "transparent", border: "1px solid var(--border)",
                      borderRadius: "8px", color: "var(--text)", fontSize: "12px", cursor: "pointer",
                      textAlign: "left", transition: "all 0.15s", display: "flex", gap: "8px", alignItems: "center",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget.style.borderColor = "var(--border-2)"); (e.currentTarget.style.background = "rgba(255,255,255,0.02)"); }}
                    onMouseLeave={(e) => { (e.currentTarget.style.borderColor = "var(--border)"); (e.currentTarget.style.background = "transparent"); }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{item.transcript.slice(0, 38)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ─── MAIN CANVAS AREA ─── */}
      <main className="app-main">

        {/* Toolbar */}
        <header className="canvas-toolbar" style={{
          height: "56px",
          borderBottom: "1px solid var(--border)",
          background: "rgba(13, 15, 19, 0.7)",
          backdropFilter: "blur(12px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          zIndex: 5,
          flexShrink: 0,
        }}>
          <div style={{ fontSize: "13px", color: hasMap ? "var(--text-2)" : "var(--muted)", fontWeight: 500 }}>
            {hasMap ? (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent)", display: "inline-block", flexShrink: 0 }} />
                <span style={{ whiteSpace: "nowrap" }}>Interactive Canvas</span>
                <span style={{ color: "var(--muted)", fontSize: "11px", whiteSpace: "nowrap", display: "inline-block" }}>— drag nodes to rearrange</span>
              </span>
            ) : "Workspace is empty. Describe an idea to map it."}
          </div>

          {/* Toolbar Actions */}
          <div className="canvas-toolbar-actions" style={{ display: "flex", gap: "6px", alignItems: "center", opacity: hasMap ? 1 : 0.4, pointerEvents: hasMap ? "auto" : "none" }}>

            {/* Copy Mermaid Code */}
            <ToolbarBtn onClick={handleCopyCode} active={copied}>
              {copied ? "✓ Copied" : "{ } Code"}
            </ToolbarBtn>

            <div style={{ width: "1px", height: "20px", background: "var(--border)" }} />

            {/* Export group */}
            <ToolbarBtn onClick={handleExportPng}>PNG</ToolbarBtn>
            <ToolbarBtn onClick={handleExportSvg}>SVG</ToolbarBtn>
            <ToolbarBtn onClick={handleExportJson}>{'{ }'} JSON</ToolbarBtn>
            <ToolbarBtn onClick={handleCopyMarkdown}>Markdown</ToolbarBtn>

            {/* Resources toggle */}
            {resources.length > 0 && (
              <>
                <div style={{ width: "1px", height: "20px", background: "var(--border)" }} />
                <ToolbarBtn onClick={() => setResourcesOpen((o) => !o)} active={resourcesOpen}>
                  📚 Resources{resourcesOpen ? " ×" : ""}
                </ToolbarBtn>
              </>
            )}
          </div>
        </header>

        {/* Canvas */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {!hasMap ? (
            <EmptyState />
          ) : (
            <FlowCanvas
              code={mermaidCode}
              onStateChange={handleFlowStateChange}
              canvasDivRef={canvasDivRef}
            />
          )}

          {/* Resources Overlay */}
          {resourcesOpen && resources.length > 0 && (
            <div style={{
              position: "absolute", bottom: "16px", left: "16px", right: "16px",
              background: "rgba(19, 22, 28, 0.92)", backdropFilter: "blur(24px)",
              border: "1px solid var(--border)", borderRadius: "16px", padding: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)", maxHeight: "260px", overflowY: "auto", zIndex: 20,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>Curated Resources</span>
                </div>
                <button onClick={() => setResourcesOpen(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "16px", lineHeight: 1 }}>×</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
                {resources.map((group) => (
                  <div key={group.topic}>
                    <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: "7px", fontWeight: 700 }}>
                      {group.topic}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {group.links.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                          display: "flex", alignItems: "center", gap: "8px", padding: "7px 9px",
                          background: "rgba(255,255,255,0.03)", border: "1px solid transparent",
                          borderRadius: "7px", textDecoration: "none", transition: "all 0.15s",
                        }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "var(--border-2)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "transparent"; }}
                        >
                          <span style={{ fontSize: "11px" }}>{TYPE_ICONS[link.type] ?? "🔗"}</span>
                          <span style={{ fontSize: "11px", color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────
function ToolbarBtn({ children, onClick, active }: { children: React.ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} style={{
      padding: "0 12px", height: "30px", background: active ? "var(--accent-dim)" : "var(--surface)",
      border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
      borderRadius: "6px", color: active ? "var(--accent)" : "var(--text-2)",
      fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
      display: "flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap",
    }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--text)"; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.color = "var(--text-2)"; } }}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", userSelect: "none" }}>
      <div style={{ width: "64px", height: "64px", borderRadius: "16px", border: "1px dashed var(--border-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--border-2)" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
          <path d="M2 12h20"/>
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-2)", marginBottom: "4px" }}>Empty Canvas</p>
        <p style={{ fontSize: "12px", color: "var(--muted)" }}>Speak or type an idea to generate an interactive mind map</p>
      </div>
    </div>
  );
}

// ─── Suspense wrapper (required for useSearchParams in Next.js) ──────────────
export default function AppWorkspace() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg)", color: "var(--muted)", fontSize: "14px" }}>
        Loading…
      </div>
    }>
      <AppWorkspaceInner />
    </Suspense>
  );
}
