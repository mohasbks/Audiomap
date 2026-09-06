"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════════════
   SHARED NAVBAR — with hamburger menu
══════════════════════════════════════════════ */
export function SiteNavbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (path?.startsWith("/app")) return null;

  const links = [
    { href: "/pricing",   label: "Pricing"      },
    { href: "/about",     label: "Architecture" },
    { href: "/dashboard", label: "Dashboard"    },
    { href: "https://github.com/Almotasembellahawwad/Audiomap", label: "GitHub", ext: true },
  ];

  const lk = (active: boolean): React.CSSProperties => ({
    color: active ? "var(--text)" : "var(--muted)",
    textDecoration: "none", fontSize: "14px", fontWeight: 500,
    transition: "color 0.18s", letterSpacing: "0.01em",
  });

  return (
    <>
      <nav className="site-nav" style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        height: "60px", position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: "1px solid var(--border)",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="0.75" y="0.75" width="18.5" height="18.5" rx="4.5" stroke="var(--accent)" strokeWidth="1.5"/>
            <circle cx="10" cy="10" r="2.5" fill="var(--accent)"/>
            <line x1="10" y1="3.5" x2="10" y2="7" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="10" y1="13" x2="10" y2="16.5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="3.5" y1="10" x2="7" y2="10" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="13" y1="10" x2="16.5" y2="10" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--text)", letterSpacing: "-0.025em" }}>audiomap</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links-desktop">
          {links.map(({ href, label, ext }) => (
            <a key={href} href={href} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined}
              style={lk(!ext && path === href)}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = (!ext && path === href) ? "var(--text)" : "var(--muted)")}>
              {label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ThemeToggle />
          <Link href="/app" className="nav-links-desktop" style={{
            background: "var(--text)", color: "var(--bg)",
            padding: "7px 18px", borderRadius: "7px",
            fontSize: "13px", fontWeight: 600, textDecoration: "none", transition: "opacity 0.18s",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            Open App
          </Link>

          {/* Hamburger */}
          <button className="nav-hamburger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div className={`nav-mobile-panel ${open ? "open" : ""}`}>
        {links.map(({ href, label, ext }) => (
          <a key={href} href={href} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined}
            className="nav-mobile-link" onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <Link href="/app" className="nav-mobile-cta" onClick={() => setOpen(false)}>Open App →</Link>
      </div>
      {open && <div className="nav-mobile-overlay" style={{ display: "block" }} onClick={() => setOpen(false)} />}
    </>
  );
}

/* ══════════════════════════════════════════════
   SHARED FOOTER
══════════════════════════════════════════════ */
export function SiteFooter() {
  const muted: React.CSSProperties = { color: "var(--muted)", fontSize: "13px", textDecoration: "none", display: "block", marginBottom: "10px", transition: "color 0.18s" };
  const head: React.CSSProperties = { fontSize: "11px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "18px" };
  const hov = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => { e.currentTarget.style.color = enter ? "var(--text)" : "var(--muted)"; };

  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-alt)" }}>
      <div className="r-grid-footer inner" style={{ padding: "64px 48px 48px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ width: "16px", height: "16px", background: "var(--accent)", borderRadius: "3px" }} />
            <span style={{ fontWeight: 700, color: "var(--text)", fontSize: "14px", letterSpacing: "-0.02em" }}>audiomap</span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.75, maxWidth: "220px" }}>
            Voice-to-mindmap AI. Built on Groq, GPT-OSS, Whisper, and React Flow.
          </p>
        </div>
        {[
          { title: "Product", links: [{ label: "App Workspace", href: "/app" }, { label: "Pricing", href: "/pricing" }, { label: "Dashboard", href: "/dashboard" }] },
          { title: "Company", links: [{ label: "Architecture", href: "/about" }, { label: "GitHub", href: "https://github.com/Almotasembellahawwad/Audiomap" }, { label: "Groq API", href: "https://groq.com" }] },
          { title: "Developer", links: [{ label: "@Almotasembellahawwad", href: "https://github.com/Almotasembellahawwad" }, { label: "React Flow", href: "https://reactflow.dev" }, { label: "Next.js", href: "https://nextjs.org" }] },
        ].map(col => (
          <div key={col.title}>
            <div style={head}>{col.title}</div>
            {col.links.map(l => (
              <a key={l.label} href={l.href} style={muted} onMouseEnter={e => hov(e, true)} onMouseLeave={e => hov(e, false)}>{l.label}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 48px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>© 2026 Audiomap. Built by Motasem Bellah.</span>
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>Next.js · Groq · React Flow</span>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════
   HERO BACKGROUND
══════════════════════════════════════════════ */
function HeroBg() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const fn = (e: MouseEvent) => {
      el.style.setProperty("--mx", `${(e.clientX / innerWidth  - 0.5) * 22}px`);
      el.style.setProperty("--my", `${(e.clientY / innerHeight - 0.5) * 14}px`);
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
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

/* ══════════════════════════════════════════════
   FEATURE CARD
══════════════════════════════════════════════ */
function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card"
      style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "14px", transition: "border-color 0.2s, transform 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div style={{ width: "40px", height: "40px", background: "var(--accent-dim)", border: "1px solid rgba(74,123,189,0.2)", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)", marginBottom: "6px", letterSpacing: "-0.01em" }}>{title}</p>
        <p style={{ fontSize: "13.5px", color: "var(--text-2)", lineHeight: 1.65 }}>{body}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <SiteNavbar />
      <main style={{ flex: 1 }}>

        {/* ── HERO ── */}
        <section className="hero-section" style={{ position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 40px 80px" }}>
          <HeroBg />
          <div aria-hidden className="hero-overlay" />
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "820px", width: "100%" }}>

            <div className="badge" style={{ marginBottom: "32px", display: "inline-flex" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", flexShrink: 0 }} />
              Live AI · resilient local fallback
            </div>

            <h1 style={{ fontSize: "clamp(38px, 7vw, 84px)", fontWeight: 700, letterSpacing: "-0.055em", lineHeight: 1.0, marginBottom: "24px", color: "var(--text)" }}>
              Turn{" "}
              <span className="gradient-text">voice</span>
              {" "}into<br />
              <span style={{ color: "var(--text-2)", fontWeight: 300 }}>structured maps</span>
            </h1>

            <p style={{ fontSize: "clamp(15px, 1.6vw, 18px)", color: "var(--text-2)", lineHeight: 1.8, maxWidth: "460px", margin: "0 auto 44px" }}>
              Speak or type any topic. AI produces an interactive, draggable mind map in under a second.
            </p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginBottom: "60px" }}>
              <Link href="/app" style={{
                background: "var(--accent)", color: "#fff", height: "48px", padding: "0 28px",
                borderRadius: "9px", fontSize: "14px", fontWeight: 600, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "8px",
                boxShadow: "0 0 0 1px rgba(74,123,189,0.4), 0 4px 20px rgba(74,123,189,0.3)",
                transition: "transform 0.18s, box-shadow 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(74,123,189,0.5), 0 8px 28px rgba(74,123,189,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(74,123,189,0.4), 0 4px 20px rgba(74,123,189,0.3)"; }}>
                <IcMic /> Start Mapping Free
              </Link>
              <Link href="/about" style={{
                background: "var(--surface)", color: "var(--text-2)", height: "48px", padding: "0 24px",
                borderRadius: "9px", fontSize: "14px", fontWeight: 500, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "7px",
                border: "1px solid var(--border-2)", transition: "color 0.18s, border-color 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--muted)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-2)"; e.currentTarget.style.borderColor = "var(--border-2)"; }}>
                How it&apos;s built <IcArrow />
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", color: "var(--muted)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              <span>Scroll</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "scrollBounce 2s ease infinite" }}><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </section>

        {/* ── POWERED BY STRIP ── */}
        <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-alt)", padding: "0 48px" }}>
          <div className="powered-strip" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap", padding: "20px 0", flexShrink: 0 }}>
              Powered by
            </span>
            {[
              { name: "Groq",      sub: "LPU Inference"  },
              { name: "OpenAI",    sub: "GPT-OSS 20B"     },
              { name: "Whisper",   sub: "Large v3 Turbo"  },
              { name: "Next.js",   sub: "App Router"      },
              { name: "React Flow",sub: "Canvas"          },
              { name: "IndexedDB", sub: "Persistence"     },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", padding: "20px 0", whiteSpace: "nowrap", borderLeft: i === 0 ? "1px solid var(--border)" : "none", paddingLeft: i === 0 ? "48px" : 0, flexShrink: 0 }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>{t.name}</span>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>{t.sub}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "120px 48px 80px" }}>
          <div style={{ marginBottom: "64px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Process</p>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 700, letterSpacing: "-0.04em", marginBottom: "14px" }}>Three steps, one mind map.</h2>
            <p style={{ fontSize: "15px", color: "var(--text-2)", maxWidth: "400px", lineHeight: 1.7 }}>From scattered thoughts to a fully structured, interactive diagram.</p>
          </div>

          <div className="r-steps">
            {[
              { n: "01", title: "Speak or Type",    body: "Record your voice in Arabic or English, or type an idea. Whisper Large v3 Turbo handles fast multilingual transcription.", icon: <IcMic /> },
              { n: "02", title: "AI Structures It", body: "GPT-OSS on Groq builds a useful concept hierarchy. A transparent local structurer keeps text mode available during provider outages.", icon: <IcZap /> },
              { n: "03", title: "Explore & Export", body: "Drag nodes, zoom in, add connections. Export as PNG, SVG, JSON, or Markdown for Notion and GitHub.", icon: <IcFlow /> },
            ].map(step => (
              <div key={step.n} style={{ background: "var(--surface)", padding: "44px 36px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "var(--accent-dim)", border: "1px solid rgba(74,123,189,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>{step.icon}</div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.06em" }}>{step.n}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "10px", letterSpacing: "-0.02em" }}>{step.title}</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.7 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-alt)" }}>
          <div className="r-stats" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 48px" }}>
            {[
              { value: "24/7", label: "Text availability", sub: "with local fallback" },
              { value: "2",  label: "Input modes",  sub: "voice and text"      },
              { value: "20B",  label: "Default AI model",sub: "GPT-OSS"          },
              { value: "4",    label: "Export formats",  sub: "PNG · SVG · JSON · MD" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "32px 24px", borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-0.06em", color: "var(--text)", lineHeight: 1, marginBottom: "8px" }}>{s.value}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-2)", marginBottom: "2px" }}>{s.label}</div>
                <div style={{ fontSize: "11px", color: "var(--muted)" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "120px 48px 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Features</p>
              <h2 style={{ fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 700, letterSpacing: "-0.04em" }}>
                Everything you need.<br />
                <span style={{ color: "var(--text-2)", fontWeight: 300 }}>Nothing you don&apos;t.</span>
              </h2>
            </div>
            <Link href="/app" style={{ color: "var(--accent)", fontSize: "14px", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
              Try it now <IcArrow />
            </Link>
          </div>
          <div className="r-grid-features">
            <FeatureCard icon={<IcMic />}    title="Voice First"         body="Arabic and English transcription powered by Whisper Large v3 Turbo on Groq." />
            <FeatureCard icon={<IcZap />}    title="Resilient AI"        body="GPT-OSS structures rich maps, while a labeled local fallback keeps text ideas moving." />
            <FeatureCard icon={<IcFlow />}   title="React Flow Canvas"   body="Drag, rearrange, and zoom nodes freely. Every map is interactive — not a static image." />
            <FeatureCard icon={<IcBook />}   title="Curated Resources"   body="AI surfaces relevant courses, docs, and references for your topic automatically." />
            <FeatureCard icon={<IcExport />} title="Pro Export"          body="PNG · SVG · JSON · Markdown. High-res, ready for slides, Notion, and GitHub READMEs." />
            <FeatureCard icon={<IcSave />}   title="Auto-Save"           body="Maps persist to IndexedDB locally. Reopen, rename, or delete from your dashboard anytime." />
          </div>
        </section>

        {/* ── QUOTE ── */}
        <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto", padding: "96px 48px", textAlign: "center" }}>
            <svg width="24" height="18" viewBox="0 0 28 20" fill="none" style={{ marginBottom: "28px", color: "var(--border-2)" }}>
              <path d="M0 20V12C0 5.373 4.477 1.12 13.43 0l1.14 2.4C10 3.733 7.333 6.667 7.333 11.333H12V20H0ZM16 20V12C16 5.373 20.477 1.12 29.43 0l1.14 2.4C26 3.733 23.333 6.667 23.333 11.333H28V20H16Z" fill="currentColor"/>
            </svg>
            <p style={{ fontSize: "clamp(16px, 2.5vw, 24px)", fontWeight: 400, color: "var(--text)", lineHeight: 1.6, letterSpacing: "-0.02em", marginBottom: "32px" }}>
              The best thinking tools get out of the way and let you think. Audiomap turns the chaos of a voice note into a structured map before you&apos;ve even put down your pen.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent-dim)", border: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)" }}>Motasem Bellah</div>
                <div style={{ fontSize: "11px", color: "var(--muted)" }}>Builder of Audiomap</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ padding: "120px 24px 140px", display: "flex", justifyContent: "center" }}>
          <div style={{
            maxWidth: "720px", width: "100%", textAlign: "center",
            padding: "clamp(48px, 8vw, 80px) clamp(24px, 6vw, 48px)",
            background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: "20px",
          }}>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.05em", marginBottom: "16px" }}>
              Start mapping your ideas.
            </h2>
            <p style={{ color: "var(--text-2)", fontSize: "15px", maxWidth: "360px", margin: "0 auto 40px", lineHeight: 1.7 }}>
              Free to use. No account required. Your first mind map in under 10 seconds.
            </p>
            <Link href="/app" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "var(--text)", color: "var(--bg)", height: "48px", padding: "0 32px",
              borderRadius: "9px", fontSize: "14px", fontWeight: 700, textDecoration: "none", transition: "opacity 0.18s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              Open Workspace
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}

/* ══════════════════════════════════════════════
   SVG ICON SET
══════════════════════════════════════════════ */
const IcMic    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>;
const IcZap    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcFlow   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4m0 0-7 6m7-6 7 6"/></svg>;
const IcBook   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IcExport = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IcSave   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IcArrow  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>;
