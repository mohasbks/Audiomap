"use client";

import Link from "next/link";
import { SiteNavbar, SiteFooter } from "@/app/page";

const techStack = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    name: "Groq LPU™ Inference",
    badge: "800+ tok/s",
    desc: "Groq's Language Processing Unit delivers sub-second LLM inferences — making Audiomap feel instant rather than like waiting on an API.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>,
    name: "OpenAI Whisper v3",
    badge: "Multilingual",
    desc: "Best-in-class speech recognition. Handles Arabic, English, and mixed input with near-human accuracy, running entirely on Groq's infrastructure.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    name: "LLaMA 3.3 70B",
    badge: "Meta AI",
    desc: "70 billion parameter open-weights model. Understands complex conceptual relationships and produces well-structured Mermaid.js mindmap syntax reliably.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
    name: "Next.js 16 App Router",
    badge: "Serverless",
    desc: "API routes keep sensitive keys off the client. Turbopack makes development fast. Edge-ready for global deployment on Vercel or any serverless host.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    name: "Mermaid.js v11",
    badge: "Rendering",
    desc: "Declarative graph syntax converted to interactive SVG diagrams. Supports mindmap, flowchart, sequence, and more — all themed to match the dark UI.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <SiteNavbar />

      <main style={{ flex: 1, padding: "160px 40px 120px" }}>

        {/* Hero */}
        <div className="anim-up" style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 100px" }}>
          <div className="badge" style={{ marginBottom: "24px" }}>Architecture</div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 700, letterSpacing: "-0.04em", marginBottom: "20px" }}>
            Built for speed.<br />Designed for thought.
          </h1>
          <p style={{ fontSize: "17px", color: "var(--text-2)", lineHeight: 1.7 }}>
            Audiomap chains three of the most powerful AI APIs in the world — Whisper, LLaMA, and Groq's inference engine — to produce mind maps that feel instantaneous.
          </p>
        </div>

        {/* Flow diagram */}
        <div className="anim-up" style={{ maxWidth: "900px", margin: "0 auto 100px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "40px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600, marginBottom: "32px" }}>Request Flow</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0", overflow: "auto" }}>
            {["🎙 Voice / Text", "Whisper v3 STT", "LLaMA 3.3 70B", "Mermaid Parser", "🧠 Mind Map"].map((step, i, arr) => (
              <>
                <div key={step} style={{
                  flex: 1, minWidth: "120px", padding: "16px 12px", background: "var(--bg-alt)",
                  border: "1px solid var(--border-2)", borderRadius: "10px", textAlign: "center",
                  fontSize: "13px", fontWeight: 600, color: i === 0 || i === arr.length - 1 ? "var(--text)" : "var(--text-2)",
                  borderColor: i === 2 ? "var(--accent)" : "var(--border-2)",
                }}>
                  {step}
                  {i === 2 && <div style={{ fontSize: "10px", color: "var(--accent)", marginTop: "4px", fontWeight: 500 }}>800+ tok/s</div>}
                </div>
                {i < arr.length - 1 && (
                  <div key={`arrow-${i}`} style={{ padding: "0 8px", color: "var(--muted)", fontSize: "18px", flexShrink: 0 }}>→</div>
                )}
              </>
            ))}
          </div>
        </div>

        {/* Tech stack cards */}
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "20px" }}>
          {techStack.map((tech) => (
            <div key={tech.name} className="anim-up card" style={{
              padding: "28px 32px", display: "flex", gap: "20px",
              transition: "border-color 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => { (e.currentTarget.style.borderColor = "var(--border-2)"); (e.currentTarget.style.transform = "translateY(-2px)"); }}
              onMouseLeave={e => { (e.currentTarget.style.borderColor = "var(--border)"); (e.currentTarget.style.transform = "translateY(0)"); }}
            >
              <div style={{ flexShrink: 0, width: "44px", height: "44px", background: "var(--accent-dim)", border: "1px solid var(--border-2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                {tech.icon}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{tech.name}</h3>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--accent)", background: "var(--accent-dim)", padding: "2px 8px", borderRadius: "6px", border: "1px solid rgba(74,123,189,0.2)" }}>
                    {tech.badge}
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.65 }}>{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="anim-up" style={{ textAlign: "center", marginTop: "100px" }}>
          <a href="https://github.com/mohasbks/Audiomap" target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "14px 28px", background: "var(--surface)", border: "1px solid var(--border-2)",
              borderRadius: "12px", color: "var(--text)", textDecoration: "none",
              fontSize: "15px", fontWeight: 600, transition: "all 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget.style.borderColor = "var(--text)"); }}
            onMouseLeave={e => { (e.currentTarget.style.borderColor = "var(--border-2)"); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            View on GitHub — mohasbks/Audiomap
          </a>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
