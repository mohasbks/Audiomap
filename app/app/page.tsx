"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import AudioRecorder from "@/components/AudioRecorder";

const MermaidDiagram = dynamic(() => import("@/components/MermaidDiagram"), { ssr: false });

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

async function generateMap(text: string): Promise<{ mermaid: string; resources: ResourceGroup[] }> {
  const res = await fetch("/api/generate-map", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return { mermaid: data.mermaid, resources: data.resources ?? [] };
}

export default function AppWorkspace() {
  const [step, setStep] = useState<Step>("idle");
  const [inputMode, setInputMode] = useState<InputMode>("voice");
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const [resources, setResources] = useState<ResourceGroup[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);

  const processText = useCallback(async (text: string) => {
    setTranscript(text);
    setStep("generating");
    setErrorMsg("");
    setZoom(1);
    setResources([]);
    try {
      const result = await generateMap(text);
      setMermaidCode(result.mermaid);
      setResources(result.resources);
      setHistory((prev) => [
        { id: Date.now().toString(), transcript: text, mermaid: result.mermaid, resources: result.resources },
        ...prev.filter(i => i.transcript !== text).slice(0, 9), // Keep distinct history entries
      ]);
      setStep("done");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to generate map. Try again.");
      setStep("error");
    }
  }, []);

  const handleTextSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    await processText(textInput.trim());
  }, [textInput, processText]);

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
    setZoom(1);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPng = async () => {
    if (!diagramRef.current) return;
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(diagramRef.current, { backgroundColor: "#0d0f13", pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = "audiomap.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("PNG export failed:", err);
    }
  };

  const isProcessing = step === "generating";

  return (
    <div style={{ display: "flex", height: "100vh", w: "100%", overflow: "hidden", background: "var(--bg)" }}>
      
      {/* 🔴 LEFT SIDEBAR - CONTROLS & HISTORY */}
      <aside style={{
        width: "360px", background: "var(--surface)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", zIndex: 10, boxShadow: "4px 0 24px rgba(0,0,0,0.2)"
      }}>
        {/* Branding header */}
        <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid var(--border)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 600, fontSize: "16px", color: "var(--text)", textDecoration: "none" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "4px", background: "linear-gradient(135deg, var(--accent) 0%, #3b5b7d 100%)" }} />
            Audiomap App
          </Link>
          <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "8px", lineHeight: 1.5 }}>
            Describe your idea clearly and let AI build the structure.
          </p>
        </div>

        <div style={{ padding: "24px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Input Panel */}
          <div>
            <div style={{ display: "flex", padding: "4px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", marginBottom: "16px", border: "1px solid var(--border)" }}>
              {(["voice", "text"] as InputMode[]).map((mode) => (
                <button key={mode} onClick={() => setInputMode(mode)} style={{
                  flex: 1, padding: "8px", background: inputMode === mode ? "var(--bg)" : "transparent", border: "none",
                  borderRadius: "6px", fontSize: "12px", fontWeight: 500,
                  color: inputMode === mode ? "var(--text)" : "var(--muted)",
                  boxShadow: inputMode === mode ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
                  cursor: "pointer", transition: "all 0.15s"
                }}>
                  {mode === "voice" ? "🎙 Voice" : "✍️ Text"}
                </button>
              ))}
            </div>

            {inputMode === "voice" ? (
              <AudioRecorder onTranscript={processText} onError={handleError} isProcessing={isProcessing} />
            ) : (
              <form onSubmit={handleTextSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <textarea
                  value={textInput} onChange={(e) => setTextInput(e.target.value)}
                  placeholder="e.g. Map out a user reg flow..."
                  rows={5} disabled={isProcessing}
                  style={{
                    width: "100%", padding: "12px", background: "rgba(0,0,0,0.1)",
                    border: "1px solid var(--border)", borderRadius: "8px",
                    color: "var(--text)", fontSize: "13px", lineHeight: 1.6,
                    resize: "none", outline: "none", fontFamily: "inherit", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--border-focus)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button type="submit" disabled={isProcessing || !textInput.trim()} style={{
                  padding: "12px", width: "100%",
                  background: isProcessing || !textInput.trim() ? "var(--border)" : "var(--accent)", color: "#fff",
                  border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                  cursor: isProcessing || !textInput.trim() ? "not-allowed" : "pointer", transition: "opacity 0.2s",
                  opacity: (isProcessing || !textInput.trim()) ? 0.6 : 1
                }}>
                  {isProcessing ? "Processing..." : "Generate Map"}
                </button>
              </form>
            )}

            {/* Status Messages */}
            {step !== "idle" && (
              <div className="animate-slide-up" style={{
                marginTop: "16px", padding: "12px", borderRadius: "8px",
                background: "var(--bg)", border: "1px solid var(--border)",
                fontSize: "12px", color: step === "error" ? "var(--error)" : "var(--muted)", lineHeight: 1.5,
              }}>
                {step === "generating" && <span><span className="pulse-ring" style={{ display: "inline-block", width: "8px", height: "8px", background: "var(--accent)", borderRadius: "50%", marginRight: "8px" }} /> Generating mind map...</span>}
                {step === "done" && transcript && <span><span style={{ color: "var(--accent)", marginRight: "4px" }}>✓</span> "{transcript.length > 80 ? transcript.slice(0, 80) + '...' : transcript}"</span>}
                {step === "error" && <span>⚠ {errorMsg}</span>}
              </div>
            )}
            
            {(step === "done" || step === "error") && (
              <button onClick={reset} style={{
                marginTop: "12px", padding: "8px", width: "100%", background: "transparent",
                border: "1px dashed var(--border-focus)", borderRadius: "8px", color: "var(--muted)",
                fontSize: "12px", cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "var(--accent)"; (e.target as HTMLElement).style.color = "var(--text)"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "var(--border-focus)"; (e.target as HTMLElement).style.color = "var(--muted)"; }}
              >
                + Create New Map
              </button>
            )}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

          {/* History */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "12px", fontWeight: 600 }}>
              Recent Sessions
            </p>
            {history.length === 0 ? (
              <div style={{ padding: "16px", textAlign: "center", border: "1px dashed var(--border)", borderRadius: "8px", fontSize: "12px", color: "var(--muted)" }}>No history yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {history.map((item) => (
                  <button key={item.id} onClick={() => { setMermaidCode(item.mermaid); setTranscript(item.transcript); setResources(item.resources); setStep("done"); setZoom(1); }}
                    style={{
                      padding: "10px 12px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px",
                      color: "var(--text)", fontSize: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", gap: "8px", alignItems: "center"
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "var(--border-focus)"; (e.target as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "var(--border)"; (e.target as HTMLElement).style.background = "transparent"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {item.transcript.slice(0, 40)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 🔵 RIGHT CANVAS - DIAGRAM & RESOURCES */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        
        {/* Canvas Toolbar */}
        <header style={{
          height: "60px", borderBottom: "1px solid var(--border)", background: "rgba(13, 15, 19, 0.6)",
          backdropFilter: "blur(12px)", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 24px", zIndex: 5
        }}>
          <div>
            {!mermaidCode ? (
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Workspace is empty. Map it out.</span>
            ) : (
              <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)" }}>Workspace Canvas</span>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center", opacity: mermaidCode ? 1 : 0.5, pointerEvents: mermaidCode ? "auto" : "none" }}>
            <div style={{ display: "flex", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
              {([["−", -0.2], ["+", 0.2]] as [string, number][]).map(([label, delta]) => (
                <button key={label} onClick={() => setZoom((z) => Math.min(2.5, Math.max(0.4, z + delta)))} style={{
                  width: "32px", height: "30px", background: "transparent", border: "none", color: "var(--muted)", fontSize: "16px", cursor: "pointer", transition: "background 0.1s"
                }} onMouseEnter={(e) => (e.target as HTMLElement).style.background = "var(--border-focus)"} onMouseLeave={(e) => (e.target as HTMLElement).style.background = "transparent"}>
                  {label}
                </button>
              ))}
              <button onClick={() => setZoom(1)} style={{
                padding: "0 12px", height: "30px", background: "transparent", border: "none", borderLeft: "1px solid var(--border)",
                color: "var(--muted)", fontSize: "12px", cursor: "pointer"
              }}>
                {Math.round(zoom * 100)}%
              </button>
            </div>
            
            <div style={{ width: "1px", height: "24px", background: "var(--border)", margin: "0 8px" }} />
            
            <button onClick={handleCopy} className="glass-panel" style={{ padding: "0 14px", height: "32px", borderRadius: "6px", color: copied ? "var(--accent)" : "var(--text)", fontSize: "12px", cursor: "pointer", border: copied ? "1px solid var(--accent)" : "1px solid var(--border)"}}>
              {copied ? "Copied" : "Copy Code"}
            </button>
            <button onClick={handleExportPng} className="glass-panel" style={{ padding: "0 14px", height: "32px", borderRadius: "6px", color: "var(--text)", fontSize: "12px", cursor: "pointer", display: "flex", gap: "6px", alignItems: "center"}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
              Export PNG
            </button>
          </div>
        </header>

        {/* The Diagram Area */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {!mermaidCode ? (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--border-focus)", userSelect: "none" }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
            </div>
          ) : (
            <div className="animate-slide-up" style={{ width: "100%", height: "100%", overflow: "auto", padding: "40px", cursor: "grab" }}>
              <div ref={diagramRef} style={{ transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 0.15s ease", minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MermaidDiagram code={mermaidCode} />
              </div>
            </div>
          )}
        </div>

        {/* Resources Drawer (Overlay layout at the bottom) */}
        {resources.length > 0 && (
          <div className="animate-slide-up" style={{
            position: "absolute", bottom: "24px", left: "24px", right: "24px",
            background: "rgba(21, 24, 30, 0.8)", backdropFilter: "blur(24px)",
            border: "1px solid var(--border)", borderRadius: "16px", padding: "20px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)", maxHeight: "250px", overflowY: "auto"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>Curated Learning Resources</h3>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
              {resources.map((group) => (
                <div key={group.topic}>
                  <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", marginBottom: "8px", fontWeight: 600 }}>{group.topic}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {group.links.map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                        display: "flex", alignItems: "center", gap: "8px", padding: "8px",
                        background: "rgba(255,255,255,0.03)", border: "1px solid transparent",
                        borderRadius: "8px", textDecoration: "none", transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget.style.background = "rgba(255,255,255,0.06)"); (e.currentTarget.style.borderColor = "var(--border-focus)"); }}
                      onMouseLeave={(e) => { (e.currentTarget.style.background = "rgba(255,255,255,0.03)"); (e.currentTarget.style.borderColor = "transparent"); }}
                      >
                        <span style={{ fontSize: "12px", background: "var(--bg)", border: "1px solid var(--border)", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px" }}>{TYPE_ICONS[link.type] ?? "🔗"}</span>
                        <span style={{ fontSize: "12px", color: "var(--text)", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{link.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
