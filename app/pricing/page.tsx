"use client";

import Link from "next/link";
import { SiteNavbar, SiteFooter } from "../page";

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNavbar />

      <main style={{ flex: 1, padding: "160px 24px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <h1 className="animate-slide-up" style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: "16px" }}>
            Simple pricing for clear thinkers.
          </h1>
          <p className="animate-slide-up" style={{ fontSize: "18px", color: "var(--muted)", maxWidth: "600px", margin: "0 auto", animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards" }}>
            Start building your mental models for free. Upgrade when you need infinite history and team collaboration.
          </p>
        </div>

        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "32px", alignItems: "start" }}>
          
          {/* Free Tier */}
          <div className="animate-slide-up" style={{
            background: "linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)",
            border: "1px solid var(--border)", borderRadius: "24px", padding: "48px",
            animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards"
          }}>
            <h3 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text)", marginBottom: "8px" }}>Hobby</h3>
            <p style={{ fontSize: "15px", color: "var(--muted)", marginBottom: "32px" }}>For students and individuals mapping out their personal projects.</p>
            <div style={{ fontSize: "56px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: "32px" }}>
              $0<span style={{ fontSize: "16px", color: "var(--muted)", fontWeight: 500, letterSpacing: "0" }}>/mo</span>
            </div>
            
            <Link href="/app" style={{
              display: "block", width: "100%", padding: "16px", textAlign: "center",
              background: "var(--bg)", border: "1px solid var(--border-focus)", borderRadius: "12px",
              color: "var(--text)", fontWeight: 600, textDecoration: "none", marginBottom: "40px", transition: "all 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg)")}>
              Start for Free
            </Link>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px", color: "var(--muted)", fontSize: "15px" }}>
              {[
                "Unlimited Text to Map",
                "Up to 30 Voice mapped diagrams / mo",
                "Mermaid.js code export",
                "PNG Image Export",
                "History for last 10 maps"
              ].map((feature, i) => (
                <li key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="animate-slide-up" style={{
            background: "linear-gradient(135deg, rgba(94, 129, 172, 0.1) 0%, var(--surface) 100%)",
            border: "1px solid var(--accent)", borderRadius: "24px", padding: "48px", position: "relative",
            boxShadow: "0 24px 64px rgba(94, 129, 172, 0.15)",
            animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards"
          }}>
            <div style={{ position: "absolute", top: "-14px", left: "48px", background: "var(--accent)", color: "#fff", fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Most Popular</div>
            <h3 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text)", marginBottom: "8px" }}>Professional</h3>
            <p style={{ fontSize: "15px", color: "var(--muted)", marginBottom: "32px" }}>For engineers, architects, and product managers shipping fast.</p>
            <div style={{ fontSize: "56px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: "32px" }}>
              $12<span style={{ fontSize: "16px", color: "var(--muted)", fontWeight: 500, letterSpacing: "0" }}>/mo</span>
            </div>
            
            <button style={{
              display: "block", width: "100%", padding: "16px", textAlign: "center", cursor: "pointer",
              background: "var(--text)", border: "none", borderRadius: "12px",
              color: "var(--bg)", fontWeight: 600, marginBottom: "40px", transition: "opacity 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
              Upgrade to Pro
            </button>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px", color: "var(--muted)", fontSize: "15px" }}>
              {[
                "Everything in Hobby",
                "Unlimited Voice Mapping",
                "Grok 1.5 & LLaMA 3 70B Models",
                "Unlimited Save History & Cloud Sync",
                "Priority Email Support"
              ].map((feature, i) => (
                <li key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "var(--text)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
