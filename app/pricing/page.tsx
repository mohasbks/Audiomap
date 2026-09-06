"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteNavbar, SiteFooter } from "@/app/page";

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const plans = [
  {
    name: "Hobby",
    price: "$0",
    period: "",
    desc: "For students and solo learners exploring ideas.",
    cta: "Start Free",
    href: "/app",
    featured: false,
    features: [
      "Unlimited text-to-mindmap",
      "30 voice maps / month",
      "Curated learning resources",
      "PNG & SVG export",
      "Last 10 maps saved locally",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    desc: "For engineers, researchers, and product thinkers.",
    cta: "Upgrade to Pro",
    href: "#",
    featured: true,
    features: [
      "Everything in Hobby",
      "Unlimited voice mapping",
      "GPT-OSS structured mapping",
      "Unlimited save history",
      "Cloud sync across devices",
      "JSON & Markdown export",
      "Priority email support",
    ],
  },
];

const faqs = [
  {
    q: "Is Audiomap really free?",
    a: "Yes. The Hobby plan is permanently free with 30 voice maps per month and unlimited text-to-mindmap generation. No credit card required.",
  },
  {
    q: "What's the difference between voice and text mode?",
    a: "Text mode sends your prompt to the map engine. Voice mode adds a Whisper transcription step first. If live structuring is unavailable, text mode uses a clearly labeled local fallback.",
  },
  {
    q: "Where are my maps stored?",
    a: "Maps are saved locally in your browser using IndexedDB. Nothing is sent to a server (except the AI API calls). Your data stays on your device.",
  },
  {
    q: "Does it support Arabic?",
    a: "Yes. Whisper v3 supports Arabic and most major languages with high accuracy. The AI will respond in the same language as your input.",
  },
  {
    q: "When will Pro be available?",
    a: "Pro features are in development. Join the waitlist on GitHub and you'll be the first to know.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "20px 0", background: "none",
          border: "none", cursor: "pointer", gap: "16px",
          color: "var(--text)", textAlign: "left",
        }}
      >
        <span style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "-0.01em" }}>{q}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.75, paddingBottom: "20px", maxWidth: "580px" }}>{a}</p>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <SiteNavbar />

      <main style={{ flex: 1, paddingTop: "60px" }}>

        {/* ── PAGE HEADER ── */}
        <section style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-alt)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 48px 64px", textAlign: "center" }}>
            <div className="badge" style={{ marginBottom: "20px", display: "inline-flex" }}>Pricing</div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 700, letterSpacing: "-0.05em", marginBottom: "16px", lineHeight: 1.0 }}>
              Clear thinkers deserve<br />clear pricing.
            </h1>
            <p style={{ fontSize: "16px", color: "var(--text-2)", maxWidth: "420px", margin: "0 auto", lineHeight: 1.75 }}>
              Start free. No card required. Upgrade when you need more.
            </p>
          </div>
        </section>

        {/* ── PLAN CARDS ── */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px", maxWidth: "780px", margin: "0 auto" }}>
            {plans.map((plan) => (
              <div key={plan.name} style={{
                background: plan.featured ? "var(--surface-2)" : "var(--surface)",
                border: `1px solid ${plan.featured ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "16px", padding: "36px",
                position: "relative",
                boxShadow: plan.featured ? "0 0 0 1px rgba(74,123,189,0.15), 0 24px 60px rgba(0,0,0,0.2)" : "none",
              }}>
                {plan.featured && (
                  <div style={{
                    position: "absolute", top: "-12px", left: "32px",
                    background: "var(--accent)", color: "#fff",
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase", padding: "3px 12px", borderRadius: "99px",
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{ marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px", letterSpacing: "-0.02em" }}>{plan.name}</h2>
                  <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>{plan.desc}</p>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "3px", marginBottom: "28px" }}>
                  <span style={{ fontSize: "48px", fontWeight: 700, letterSpacing: "-0.06em", lineHeight: 1 }}>{plan.price}</span>
                  {plan.period && <span style={{ fontSize: "14px", color: "var(--muted)" }}>{plan.period}</span>}
                </div>

                <Link href={plan.href} style={{
                  display: "block", textAlign: "center", padding: "12px 20px",
                  borderRadius: "9px", fontWeight: 600, fontSize: "14px",
                  textDecoration: "none", marginBottom: "32px", transition: "opacity 0.18s",
                  background: plan.featured ? "var(--accent)" : "transparent",
                  color: plan.featured ? "#fff" : "var(--text)",
                  border: plan.featured ? "none" : "1px solid var(--border-2)",
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  {plan.cta}
                </Link>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Check />
                      <span style={{ fontSize: "13.5px", color: "var(--text-2)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ borderTop: "1px solid var(--border)", background: "var(--bg-alt)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 48px" }}>
            <div className="r-grid-2-faq">
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>FAQ</p>
                <h2 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.2, marginBottom: "14px" }}>Common questions</h2>
                <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.7 }}>
                  Can&apos;t find the answer? Ask on{" "}
                  <a href="https://github.com/Almotasembellahawwad/Audiomap" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text)", textDecoration: "underline", textDecorationColor: "var(--border-2)" }}>
                    GitHub
                  </a>.
                </p>
              </div>
              <div>
                {faqs.map(faq => <FAQItem key={faq.q} {...faq} />)}
              </div>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}
