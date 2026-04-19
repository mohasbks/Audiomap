"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useRef } from "react";

/* ─── Shared Navbar ─── */
export function SiteNavbar() {
  const path = usePathname();
  const isApp = path?.startsWith("/app");
  if (isApp) return null;

  const linkStyle = (active: boolean) => ({
    color: active ? "var(--text)" : "var(--muted)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    transition: "color 0.2s",
    padding: "4px 0",
    borderBottom: active ? "1px solid var(--border-2)" : "1px solid transparent",
  } as React.CSSProperties);

  return (
    <nav className="site-nav" style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 48px", height: "62px",
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      borderBottom: "1px solid var(--border)",
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="1" y="1" width="20" height="20" rx="5" stroke="var(--accent)" strokeWidth="1.5"/>
          <circle cx="11" cy="11" r="3" fill="var(--accent)" opacity="0.8"/>
          <line x1="11" y1="4" x2="11" y2="8" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="11" y1="14" x2="11" y2="18" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="4" y1="11" x2="8" y2="11" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="14" y1="11" x2="18" y2="11" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ fontWeight: 700, fontSize: "16px", color: "var(--text)", letterSpacing: "-0.02em" }}>audiomap</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <Link href="/pricing" style={linkStyle(path === "/pricing")}>Pricing</Link>
        <Link href="/about" style={linkStyle(path === "/about")}>Architecture</Link>
        <Link href="/dashboard" style={linkStyle(path === "/dashboard")}>Dashboard</Link>
        <a href="https://github.com/mohasbks/Audiomap" target="_blank" rel="noopener noreferrer" style={linkStyle(false)}>GitHub</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <ThemeToggle />
        <Link href="/app" style={{
          background: "var(--accent)", color: "#fff", padding: "8px 20px", borderRadius: "8px",
          fontSize: "14px", fontWeight: 600, textDecoration: "none", transition: "opacity 0.2s, transform 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
          Open App
        </Link>
      </div>
    </nav>
  );
}

/* ─── Shared Footer ─── */
export function SiteFooter() {
  const colHead: React.CSSProperties = { fontSize: "11px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "16px" };
  const colLink: React.CSSProperties = { color: "var(--muted)", fontSize: "14px", textDecoration: "none", display: "block", marginBottom: "10px", transition: "color 0.2s" };
  const hov = { enter: (e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "var(--text)"), leave: (e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "var(--muted)") };

  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-alt)", paddingTop: "64px", paddingBottom: "40px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{ width: "18px", height: "18px", background: "var(--accent)", borderRadius: "4px" }} />
            <span style={{ fontWeight: 700, color: "var(--text)", fontSize: "15px" }}>audiomap</span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.7, maxWidth: "250px" }}>
            Voice-to-mindmap intelligence. Powered by Groq, LLaMA 3.3, and Whisper.
          </p>
        </div>
        <div>
          <div style={colHead}>Product</div>
          <Link href="/app" style={colLink} onMouseEnter={hov.enter} onMouseLeave={hov.leave}>App Workspace</Link>
          <Link href="/pricing" style={colLink} onMouseEnter={hov.enter} onMouseLeave={hov.leave}>Pricing</Link>
          <Link href="/dashboard" style={colLink} onMouseEnter={hov.enter} onMouseLeave={hov.leave}>Dashboard</Link>
        </div>
        <div>
          <div style={colHead}>Tech</div>
          <Link href="/about" style={colLink} onMouseEnter={hov.enter} onMouseLeave={hov.leave}>Architecture</Link>
          <a href="https://groq.com" target="_blank" rel="noopener" style={colLink} onMouseEnter={hov.enter} onMouseLeave={hov.leave}>Groq API</a>
          <a href="https://reactflow.dev" target="_blank" rel="noopener" style={colLink} onMouseEnter={hov.enter} onMouseLeave={hov.leave}>React Flow</a>
        </div>
        <div>
          <div style={colHead}>Links</div>
          <a href="https://github.com/mohasbks/Audiomap" target="_blank" rel="noopener" style={colLink} onMouseEnter={hov.enter} onMouseLeave={hov.leave}>GitHub Repo</a>
          <a href="https://github.com/mohasbks" target="_blank" rel="noopener" style={colLink} onMouseEnter={hov.enter} onMouseLeave={hov.leave}>@mohasbks</a>
        </div>
      </div>
      <div style={{ maxWidth: "1100px", margin: "48px auto 0", padding: "24px 40px 0", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted)" }}>
        <span>© 2026 Audiomap — Built by Motasem Bellah</span>
        <span>Next.js 16 · Groq · React Flow</span>
      </div>
    </footer>
  );
}

/* ─── Feature card ─── */
function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card anim-up" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ width: "44px", height: "44px", background: "var(--accent-dim)", border: "1px solid var(--border-2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
        {icon}
      </div>
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", marginBottom: "8px" }}>{title}</h3>
        <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.65 }}>{body}</p>
      </div>
    </div>
  );
}

/* ─── Stat block ─── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 24px" }}>
      <div style={{ fontSize: "48px", fontWeight: 700, letterSpacing: "-0.05em", color: "var(--text)", marginBottom: "8px" }}>{value}</div>
      <div style={{ fontSize: "13px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</div>
    </div>
  );
}

/* ─── Hero Background: Dot Grid + Glow Orbs ─── */
function HeroBg() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={ref} className="hero-bg" aria-hidden>
      <div className="hero-dots" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
    </div>
  );
}

/* ─── Landing Page ─── */
export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNavbar />
      <main style={{ flex: 1 }}>

        {/* ══════ HERO ══════ */}
        <section style={{ position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 40px 80px" }}>
          <HeroBg />
          <div aria-hidden className="hero-overlay" />

          {/* Hero Content */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: "880px" }}>

            {/* Badge */}
            <div className="badge anim-up" style={{ marginBottom: "28px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 8px var(--accent)", flexShrink: 0 }} />
              Live · Groq LPU · 800+ tok/s
            </div>

            {/* Headline */}
            <h1 className="anim-up anim-up-1" style={{ fontSize: "clamp(40px, 7.5vw, 88px)", fontWeight: 700, letterSpacing: "-0.055em", lineHeight: 0.98, marginBottom: "28px" }}>
              Turn{" "}
              <span style={{ background: "linear-gradient(135deg, #6ea8e0 0%, #4a7bbd 50%, #6ea8e0 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                voice
              </span>
              {" "}into<br />interactive maps
            </h1>

            {/* Subtitle */}
            <p className="anim-up anim-up-2" style={{ fontSize: "clamp(16px, 1.8vw, 18px)", color: "var(--text-2)", lineHeight: 1.75, marginBottom: "44px", maxWidth: "440px" }}>
              Speak or type any idea. AI structures it into a draggable, exportable mind map — in seconds.
            </p>

            {/* CTA */}
            <div className="anim-up anim-up-3" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginBottom: "56px" }}>
              <Link href="/app" style={{
                background: "var(--accent)", color: "#fff", height: "52px", padding: "0 32px",
                borderRadius: "10px", fontSize: "15px", fontWeight: 700, textDecoration: "none",
                display: "flex", alignItems: "center", gap: "9px",
                boxShadow: "0 4px 24px rgba(74,123,189,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 36px rgba(74,123,189,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(74,123,189,0.35)"; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                Start Mapping Free
              </Link>
              <Link href="/dashboard" style={{
                background: "var(--surface)", color: "var(--text-2)", height: "52px", padding: "0 28px",
                borderRadius: "10px", fontSize: "15px", fontWeight: 500, textDecoration: "none",
                display: "flex", alignItems: "center", gap: "8px",
                border: "1px solid var(--border-2)", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--muted)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-2)"; e.currentTarget.style.borderColor = "var(--border-2)"; }}>
                View Dashboard
              </Link>
            </div>

            {/* Scroll hint */}
            <div className="anim-up anim-up-4" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", color: "var(--muted)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <span>Scroll</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "scrollBounce 2s ease infinite" }}><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </section>

        {/* ══════ STATS ══════ */}
        <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-alt)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", padding: "0 40px" }}>
            {[
              { value: "800+", label: "Tokens / Sec (Groq)" },
              { value: "<1s",  label: "Map Generation" },
              { value: "70B",  label: "LLaMA Parameters" },
              { value: "∞",    label: "Ideas You Can Map" },
            ].map((s, i) => (
              <div key={i} style={{ borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
                <Stat value={s.value} label={s.label} />
              </div>
            ))}
          </div>
        </section>

        {/* ══════ HOW IT WORKS ══════ */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "120px 40px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ fontSize: "11px", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: "12px" }}>
              Simple as 1-2-3
            </p>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, marginBottom: "16px" }}>How it works</h2>
            <p style={{ fontSize: "16px", color: "var(--text-2)", maxWidth: "380px", margin: "0 auto", lineHeight: 1.65 }}>
              From scattered thoughts to structured map in three steps.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px", background: "var(--border)", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--border)" }}>
            {[
              { step: "01", icon: "🎙", title: "Speak or Type", body: "Record your voice or type your idea in any language. Whisper STT handles the transcription instantly." },
              { step: "02", icon: "⚡", title: "AI Processes", body: "LLaMA 3.3 70B running on Groq LPU analyzes your input and builds a structured concept hierarchy." },
              { step: "03", icon: "🗺", title: "Explore & Export", body: "Drag nodes, zoom in, add connections, then export as PNG, SVG, JSON, or Markdown." },
            ].map((s, i) => (
              <div key={i} style={{ padding: "48px 40px", background: "var(--surface)", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "36px" }}>{s.icon}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.06em" }}>{s.step}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>{s.title}</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.7 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════ FEATURES ══════ */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px 120px" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, marginBottom: "12px" }}>Everything you need.</h2>
            <p style={{ fontSize: "16px", color: "var(--text-2)", maxWidth: "400px", margin: "0 auto", lineHeight: 1.65 }}>
              Built for thinkers, engineers, and visionaries who value clarity over clutter.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            <Feature icon={<MicIcon />}    title="Voice First"        body="Arabic or English — Whisper STT transcribes with studio-level accuracy before you finish speaking." />
            <Feature icon={<ZapIcon />}    title="Groq-Speed AI"      body="LLaMA 3.3 70B at 800+ tok/s. Your mind map renders before you lift your finger off the button." />
            <Feature icon={<FlowIcon />}   title="React Flow Canvas"  body="Drag, rearrange, and zoom nodes freely. Every map is a living, interactive diagram — not a static image." />
            <Feature icon={<BookIcon />}   title="Curated Resources"  body="AI surfaces relevant courses, docs, and videos for your specific topic automatically." />
            <Feature icon={<ExportIcon />} title="Pro Exports"        body="PNG (2×), SVG, JSON, or Markdown. High-res ready for slides, Notion, and GitHub READMEs." />
            <Feature icon={<SaveIcon />}   title="Persistent Storage" body="Maps save automatically to IndexedDB. Reopen, rename, or delete from your personal dashboard." />
          </div>
        </section>

        {/* ══════ CTA ══════ */}
        <section style={{ padding: "0 40px 140px", display: "flex", justifyContent: "center" }}>
          <div className="card" style={{
            maxWidth: "820px", width: "100%", padding: "80px 40px", textAlign: "center",
            background: "linear-gradient(160deg, var(--surface-2) 0%, var(--bg) 100%)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "20px" }}>🧠</div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 44px)", fontWeight: 700, marginBottom: "14px", letterSpacing: "-0.03em" }}>
              Ready to map your thinking?
            </h2>
            <p style={{ color: "var(--text-2)", fontSize: "16px", marginBottom: "40px", lineHeight: 1.7, maxWidth: "380px", margin: "0 auto 40px" }}>
              Open the workspace and turn your first idea into a structured mind map in under 10 seconds.
            </p>
            <Link href="/app" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "var(--text)", color: "var(--bg)", height: "52px", padding: "0 32px",
              borderRadius: "10px", fontSize: "15px", fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              Open Workspace →
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}

/* ─── SVG Icons ─── */
const MicIcon    = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>;
const ZapIcon    = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const FlowIcon   = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4"/><path d="M12 11 5 17"/><path d="M12 11l7 6"/></svg>;
const BookIcon   = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const ExportIcon = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const SaveIcon   = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
