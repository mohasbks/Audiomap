"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteNavbar() {
  const pathname = usePathname();
  
  return (
    <nav style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "16px 40px", borderBottom: "1px solid var(--border)",
      background: "rgba(13, 15, 19, 0.75)", backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)", position: "fixed", top: 0, left: 0, right: 0, zIndex: 100
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, fontSize: "16px", color: "var(--text)" }}>
        <div style={{
          width: "24px", height: "24px", borderRadius: "6px",
          background: "linear-gradient(135deg, var(--accent) 0%, #3b5b7d 100%)",
          boxShadow: "0 0 12px rgba(94, 129, 172, 0.4)"
        }} />
        Audiomap
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "32px", fontSize: "14px", fontWeight: 500 }}>
        <Link href="/" style={{ color: pathname === "/" ? "var(--text)" : "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
           onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
           onMouseLeave={(e) => (e.currentTarget.style.color = pathname === "/" ? "var(--text)" : "var(--muted)")}>Product</Link>
        <Link href="/pricing" style={{ color: pathname === "/pricing" ? "var(--text)" : "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
           onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
           onMouseLeave={(e) => (e.currentTarget.style.color = pathname === "/pricing" ? "var(--text)" : "var(--muted)")}>Pricing</Link>
        <Link href="/about" style={{ color: pathname === "/about" ? "var(--text)" : "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
           onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
           onMouseLeave={(e) => (e.currentTarget.style.color = pathname === "/about" ? "var(--text)" : "var(--muted)")}>Architecture</Link>
        <Link href="/app" style={{
          background: "var(--text)", color: "var(--bg)", padding: "8px 16px",
          borderRadius: "8px", textDecoration: "none", transition: "transform 0.1s, opacity 0.2s",
          boxShadow: "0 4px 12px rgba(236, 237, 238, 0.15)"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Open App
        </Link>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)", background: "rgba(13, 15, 19, 0.9)",
      padding: "64px 40px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, fontSize: "16px", color: "var(--text)", marginBottom: "16px" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "4px", background: "var(--accent)" }} />
            Audiomap
          </div>
          <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6, maxWidth: "260px" }}>
            Transform unstructured thoughts into highly structured visual intelligence instantly using advanced LLMs.
          </p>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
          <h4 style={{ color: "var(--text)", fontWeight: 600, marginBottom: "8px" }}>Product</h4>
          <Link href="/app" style={{ color: "var(--muted)", textDecoration: "none" }}>Workspace</Link>
          <Link href="/pricing" style={{ color: "var(--muted)", textDecoration: "none" }}>Pricing</Link>
          <Link href="#" style={{ color: "var(--muted)", textDecoration: "none" }}>Changelog</Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
          <h4 style={{ color: "var(--text)", fontWeight: 600, marginBottom: "8px" }}>Technology</h4>
          <Link href="/about" style={{ color: "var(--muted)", textDecoration: "none" }}>Architecture</Link>
          <a href="https://groq.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>Groq API</a>
          <a href="https://mermaid.js.org/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>Mermaid.js</a>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
          <h4 style={{ color: "var(--text)", fontWeight: 600, marginBottom: "8px" }}>Legal</h4>
          <Link href="#" style={{ color: "var(--muted)", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="#" style={{ color: "var(--muted)", textDecoration: "none" }}>Terms of Service</Link>
          <a href="https://github.com/mohasbks" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>GitHub</a>
        </div>
      </div>
      
      <div style={{ maxWidth: "1200px", margin: "64px auto 0", pt: "24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: "13px" }}>
        <span>© 2026 Audiomap. Built by Motasem Bellah.</span>
        <span>Made with Next.js 16</span>
      </div>
    </footer>
  );
}

export default function EpicLandingPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNavbar />

      <main style={{ flex: 1, paddingBottom: "120px" }}>
        
        {/* --- MEGA HERO --- */}
        <section style={{ padding: "200px 24px 100px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="animate-slide-up" style={{
            display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "32px",
            padding: "8px 16px", border: "1px solid var(--border)", borderRadius: "30px",
            background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px)",
            fontSize: "13px", color: "var(--text)", fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
          }}>
            <span style={{ color: "var(--accent)" }}>New</span>
            <span style={{ width: "1px", height: "12px", background: "var(--border)" }} />
            Llama 3.3 70B Integration Live
          </div>

          <h1 className="animate-slide-up" style={{
            fontSize: "clamp(56px, 10vw, 96px)", fontWeight: 700, letterSpacing: "-0.04em",
            lineHeight: 1.05, maxWidth: "900px", marginBottom: "24px", color: "var(--text)",
            textShadow: "0 0 40px rgba(236,237,238,0.1)", animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards"
          }}>
            Think out loud.<br/>
            <span style={{ background: "linear-gradient(135deg, var(--text) 0%, var(--muted) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              See the structure.
            </span>
          </h1>
          
          <p className="animate-slide-up" style={{
            fontSize: "clamp(18px, 2vw, 22px)", color: "var(--muted)", maxWidth: "600px",
            lineHeight: 1.6, marginBottom: "48px", animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards"
          }}>
            Audiomap uses ultra-fast inference and speech recognition to transform your scattered thoughts into perfect, structured systems.
          </p>

          <div className="animate-slide-up" style={{ display: "flex", gap: "16px", animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards" }}>
            <Link href="/app" style={{
              background: "var(--text)", color: "var(--bg)", padding: "0 36px", height: "56px",
              borderRadius: "12px", fontSize: "16px", fontWeight: 600, textDecoration: "none",
              display: "flex", alignItems: "center", gap: "8px", transition: "transform 0.1s",
              boxShadow: "0 12px 32px rgba(255,255,255,0.15)"
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Start Building Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </Link>
          </div>
        </section>

        {/* --- LOGO STRIP --- */}
        <section className="animate-slide-up" style={{ animationDelay: "0.4s", opacity: 0, animationFillMode: "forwards", padding: "0 24px 120px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontSize: "13px", color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "32px", fontWeight: 600 }}>Powered by Industry Leaders</p>
          <div style={{ display: "flex", gap: "64px", alignItems: "center", flexWrap: "wrap", justifyContent: "center", opacity: 0.6, filter: "grayscale(100%)" }}>
            <span style={{ fontSize: "24px", fontWeight: 700, fontFamily: "serif" }}>GROQ</span>
            <span style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-1px" }}>Meta LLaMA</span>
            <span style={{ fontSize: "24px", fontWeight: 700, fontFamily: "monospace" }}>next.js</span>
            <span style={{ fontSize: "24px", fontWeight: 700, fontStyle: "italic" }}>OpenAI Whisper</span>
          </div>
        </section>

        {/* --- FEATURE DEEP DIVES --- */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "160px", padding: "0 24px" }}>
          
          {/* Deep Dive 1: Voice */}
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "64px", alignItems: "center" }}>
            <div>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--accent-faint)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
              </div>
              <h2 style={{ fontSize: "40px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: "20px", lineHeight: 1.1 }}>Voice to architecture in seconds.</h2>
              <p style={{ fontSize: "18px", color: "var(--muted)", lineHeight: 1.6 }}>Typing out structural markdown is tedious. With our advanced Whisper integration, simply describe your system architecture, workflow, or idea aloud. We handle the syntax translation instantly.</p>
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "24px", height: "400px", padding: "32px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
               <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "var(--accent)", opacity: 0.1, position: "absolute", filter: "blur(40px)" }} />
               <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, boxShadow: "0 0 0 16px rgba(94, 129, 172, 0.1)" }}>
                 <div className="pulse-ring" style={{ position: "absolute", width: "120px", height: "120px", borderRadius: "50%", border: "2px solid var(--accent)" }} />
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path></svg>
               </div>
            </div>
          </section>

          {/* Deep Dive 2: Diagramming */}
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "64px", alignItems: "center" }}>
            <div style={{ order: 2 }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--accent-faint)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              </div>
              <h2 style={{ fontSize: "40px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: "20px", lineHeight: 1.1 }}>Rendered with precision.</h2>
              <p style={{ fontSize: "18px", color: "var(--muted)", lineHeight: 1.6 }}>Our engine natively compiles responses into Mermaid.js syntax. Navigate complex mind maps, zoom infinitely, and export highly polished resolution versions straight to PNG.</p>
            </div>
            <div style={{ order: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "24px", height: "400px", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
              <div style={{ width: "100%", height: "100%", background: "var(--bg)", border: "1px dashed var(--border-focus)", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "8px", padding: "24px" }}>
                 <div style={{ width: "100%", height: "32px", background: "var(--border)", borderRadius: "6px", width: "80%" }} />
                 <div style={{ display: "flex", gap: "24px", flex: 1 }}>
                   <div style={{ width: "2px", background: "var(--border-focus)", marginLeft: "40px" }} />
                   <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, justifyContent: "center" }}>
                     <div style={{ height: "40px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                     <div style={{ height: "40px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", marginLeft: "20px" }} />
                     <div style={{ height: "40px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", marginLeft: "20px" }} />
                   </div>
                 </div>
              </div>
            </div>
          </section>

        </div>

        {/* --- PERFORMANCE STRIP --- */}
        <section style={{ margin: "160px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "rgba(21, 24, 30, 0.4)", padding: "80px 24px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "56px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: "8px" }}>800+</div>
              <div style={{ fontSize: "16px", color: "var(--muted)" }}>Llama 3.3 Tokens/sec</div>
            </div>
            <div>
              <div style={{ fontSize: "56px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: "8px" }}>{"<1s"}</div>
              <div style={{ fontSize: "16px", color: "var(--muted)" }}>Generation Latency</div>
            </div>
            <div>
              <div style={{ fontSize: "56px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: "8px" }}>∞</div>
              <div style={{ fontSize: "16px", color: "var(--muted)" }}>Infinite Canvas</div>
            </div>
          </div>
        </section>

        {/* --- BOTTOM CTA --- */}
        <section style={{ padding: "0 24px", display: "flex", justifyContent: "center" }}>
          <div style={{
            background: "linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)", border: "1px solid var(--border)",
            borderRadius: "32px", padding: "80px 40px", textAlign: "center", maxWidth: "900px", width: "100%",
            boxShadow: "0 40px 100px rgba(0,0,0,0.4)"
          }}>
            <h2 style={{ fontSize: "48px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: "24px" }}>Ready to map your mind?</h2>
            <p style={{ fontSize: "18px", color: "var(--muted)", marginBottom: "40px" }}>Join thousands of developers using Audiomap to instantly structure their architecture.</p>
            <Link href="/app" style={{
              background: "var(--accent)", color: "#fff", padding: "0 40px", height: "64px",
              borderRadius: "16px", fontSize: "16px", fontWeight: 600, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: "8px", border: "none"
            }}>
              Open the Workspace Workspace →
            </Link>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
