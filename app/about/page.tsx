"use client";

import Link from "next/link";
import { SiteNavbar, SiteFooter } from "@/app/page";

const stack = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    name: "Groq LPU Inference",
    badge: "800+ tok/s",
    desc: "Groq's Language Processing Unit delivers sub-second LLM inference — making Audiomap feel instant rather than waiting on a remote API.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>,
    name: "OpenAI Whisper v3",
    badge: "Multilingual",
    desc: "Best-in-class automatic speech recognition. Handles Arabic, English, and mixed input with near-human accuracy on Groq's infrastructure.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    name: "LLaMA 3.3 70B",
    badge: "Meta AI",
    desc: "70-billion parameter open-weights model. Understands complex conceptual relationships and produces structured Mermaid.js mindmap syntax reliably.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
    name: "Next.js 16 App Router",
    badge: "Serverless",
    desc: "API routes keep sensitive keys off the client. Edge-ready for global deployment. Turbopack for fast local development.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4m0 0-7 6m7-6 7 6"/></svg>,
    name: "React Flow",
    badge: "Canvas",
    desc: "Interactive node-based canvas. Supports drag, zoom, pan, custom node types, and minimap navigation out of the box.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
    name: "IndexedDB via idb",
    badge: "Persistence",
    desc: "Maps are saved locally using IndexedDB — no backend, no account required. Instant save, instant retrieval, fully offline capable.",
  },
];

const pipeline = [
  { label: "Voice / Text", sub: "User input" },
  { label: "Whisper v3", sub: "Transcription" },
  { label: "LLaMA 3.3", sub: "Structuring", accent: true },
  { label: "Mermaid Parser", sub: "Conversion" },
  { label: "React Flow", sub: "Rendering" },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <SiteNavbar />

      <main style={{ flex: 1, paddingTop: "60px" }}>

        {/* ── PAGE HEADER ── */}
        <section style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-alt)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 48px 64px" }}>
            <div className="badge" style={{ marginBottom: "20px", display: "inline-flex" }}>Architecture</div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 700, letterSpacing: "-0.05em", marginBottom: "16px", maxWidth: "600px", lineHeight: 1.05 }}>
              Built for speed.<br />Designed for thought.
            </h1>
            <p style={{ fontSize: "16px", color: "var(--text-2)", lineHeight: 1.75, maxWidth: "540px" }}>
              Audiomap chains Whisper, LLaMA 3.3, and Groq&apos;s inference engine to produce mind maps that feel instantaneous — typically under one second end-to-end.
            </p>
          </div>
        </section>

        {/* ── PIPELINE DIAGRAM ── */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 48px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "32px" }}>Request Pipeline</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", background: "var(--surface)" }}>
            {pipeline.map((step, i) => (
              <div key={i} style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <div style={{
                  flex: 1, padding: "28px 20px", textAlign: "center",
                  borderRight: i < pipeline.length - 1 ? "1px solid var(--border)" : "none",
                  background: step.accent ? "rgba(74,123,189,0.06)" : "transparent",
                }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: step.accent ? "var(--accent)" : "var(--text)", marginBottom: "4px", letterSpacing: "-0.01em" }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--muted)" }}>{step.sub}</div>
                  {step.accent && <div style={{ fontSize: "10px", color: "var(--accent)", marginTop: "4px", fontWeight: 600 }}>800+ tok/s</div>}
                </div>
                {i < pipeline.length - 1 && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--border-2)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, margin: "0 -8px", zIndex: 1 }}>
                    <path d="M5 12h14m-7-7 7 7-7 7"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 48px 100px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "32px" }}>Technology Stack</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(440px, 1fr))", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
            {stack.map((tech) => (
              <div key={tech.name} style={{
                background: "var(--surface)", padding: "28px 32px",
                display: "flex", gap: "20px", alignItems: "flex-start",
                transition: "background 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--surface)")}>
                <div style={{ flexShrink: 0, width: "40px", height: "40px", background: "var(--accent-dim)", border: "1px solid rgba(74,123,189,0.2)", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                  {tech.icon}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.02em" }}>{tech.name}</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--accent)", background: "var(--accent-dim)", padding: "2px 8px", borderRadius: "5px", border: "1px solid rgba(74,123,189,0.2)" }}>
                      {tech.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.65 }}>{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── GITHUB CTA ── */}
        <section style={{ borderTop: "1px solid var(--border)", background: "var(--bg-alt)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "6px" }}>Open source on GitHub</h2>
              <p style={{ fontSize: "14px", color: "var(--text-2)" }}>100% open source. Read the code, contribute, or fork it.</p>
            </div>
            <a href="https://github.com/mohasbks/Audiomap" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "12px 24px", background: "var(--surface)", border: "1px solid var(--border-2)",
              borderRadius: "10px", color: "var(--text)", textDecoration: "none",
              fontSize: "14px", fontWeight: 600, transition: "border-color 0.18s",
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-2)")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
              mohasbks / Audiomap
            </a>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}
