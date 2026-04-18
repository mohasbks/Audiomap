"use client";

import Link from "next/link";
import { SiteNavbar, SiteFooter } from "../page";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNavbar />

      <main style={{ flex: 1, padding: "160px 24px" }}>
        
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h1 className="animate-slide-up" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: "32px" }}>
            Architected for Speed & Clarity.
          </h1>
          <p className="animate-slide-up" style={{ fontSize: "18px", color: "var(--muted)", lineHeight: 1.8, marginBottom: "80px", animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards" }}>
            Audiomap was built out of the frustration of dealing with manual, dragging-and-dropping node-based editors. We believe that the fastest way to get an idea out of your head is to speak it. The fastest way to see it is an LLM outputting declarative graph syntax.
          </p>
        </div>

        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
          
          <div className="animate-slide-up" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "24px", padding: "48px", animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--accent-faint)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
              <h3 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text)" }}>Groq + Llama 3.3 70B</h3>
            </div>
            <p style={{ fontSize: "16px", color: "var(--muted)", lineHeight: 1.6 }}>By utilizing Groq's LPU™ Inference Engine, Audiomap achieves an astonishing 800+ tokens per second. We use the massive LLaMA 3.3 70B model to ensure that deeply complex conceptual architectures are mapped precisely to Mermaid.js code in less than a single second.</p>
          </div>

          <div className="animate-slide-up" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "24px", padding: "48px", animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--accent-faint)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              </div>
              <h3 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text)" }}>Next.js 16 & Serverless</h3>
            </div>
            <p style={{ fontSize: "16px", color: "var(--muted)", lineHeight: 1.6 }}>The entire system is powered by Next.js App Router. This allows us to serve static Marketing and Pricing pages globally from edge CDNs, while securely processing API requests to Groq privately on the backend, without breaking a sweat.</p>
          </div>

        </div>

        <div style={{ textAlign: "center", marginTop: "120px" }}>
          <Link href="https://github.com/mohasbks" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: "10px", padding: "16px 32px",
            background: "var(--bg)", border: "1px solid var(--border-focus)", borderRadius: "32px",
            color: "var(--text)", fontWeight: 600, textDecoration: "none", transition: "all 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--text)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-focus)")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            Follow development on GitHub
          </Link>
        </div>

      </main>

      <SiteFooter />
    </div>
  );
}
