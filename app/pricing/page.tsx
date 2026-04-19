"use client";

import Link from "next/link";
import { SiteNavbar, SiteFooter } from "@/app/page";

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const plans = [
  {
    name: "Hobby",
    price: "$0",
    desc: "For students and solo learners exploring ideas.",
    cta: "Start Free",
    href: "/app",
    highlight: false,
    features: [
      "Unlimited text-to-mindmap",
      "30 voice maps / month",
      "Curated learning resources",
      "PNG & .mmd export",
      "Last 10 maps in history",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    suffix: "/mo",
    desc: "For engineers, researchers, and product thinkers.",
    cta: "Upgrade to Pro",
    href: "#",
    highlight: true,
    features: [
      "Everything in Hobby",
      "Unlimited voice mapping",
      "LLaMA 3.3 70B full model",
      "Unlimited save history",
      "Cloud sync across devices",
      "Priority email support",
    ],
  },
];

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <SiteNavbar />

      <main style={{ flex: 1, padding: "160px 40px 120px", maxWidth: "1100px", margin: "0 auto", width: "100%" }}>

        {/* Header */}
        <div className="anim-up" style={{ textAlign: "center", marginBottom: "80px" }}>
          <div className="badge" style={{ marginBottom: "24px" }}>Simple Pricing</div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 700, letterSpacing: "-0.04em", marginBottom: "16px" }}>
            Clear thinkers deserve clear pricing.
          </h1>
          <p style={{ fontSize: "17px", color: "var(--text-2)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.65 }}>
            Start for free. Upgrade when you're ready to go unlimited.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px", maxWidth: "820px", margin: "0 auto" }}>
          {plans.map((plan) => (
            <div key={plan.name} className="anim-up" style={{
              background: plan.highlight
                ? "linear-gradient(145deg, rgba(74,123,189,0.12) 0%, var(--surface) 60%)"
                : "var(--surface)",
              border: `1px solid ${plan.highlight ? "var(--accent)" : "var(--border)"}`,
              borderRadius: "20px",
              padding: "40px 36px",
              position: "relative",
              boxShadow: plan.highlight ? "0 0 40px rgba(74,123,189,0.1), 0 24px 60px rgba(0,0,0,0.4)" : "0 12px 40px rgba(0,0,0,0.3)",
            }}>
              {plan.highlight && (
                <div style={{
                  position: "absolute", top: "-13px", left: "36px",
                  background: "var(--accent)", color: "#fff",
                  fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em",
                  textTransform: "uppercase", padding: "4px 14px", borderRadius: "99px",
                }}>
                  Most Popular
                </div>
              )}

              <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>{plan.name}</h2>
              <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "28px", lineHeight: 1.5 }}>{plan.desc}</p>

              <div style={{ marginBottom: "32px", display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{ fontSize: "54px", fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>{plan.price}</span>
                {plan.suffix && <span style={{ fontSize: "16px", color: "var(--muted)", fontWeight: 400 }}>{plan.suffix}</span>}
              </div>

              <Link href={plan.href} style={{
                display: "block", textAlign: "center", padding: "14px",
                borderRadius: "10px", fontWeight: 600, fontSize: "14px",
                textDecoration: "none", marginBottom: "36px", transition: "opacity 0.2s",
                background: plan.highlight ? "var(--accent)" : "transparent",
                color: plan.highlight ? "#fff" : "var(--text)",
                border: plan.highlight ? "none" : "1px solid var(--border-2)",
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                {plan.cta}
              </Link>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text-2)" }}>
                    <Check />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ strip */}
        <div className="anim-up" style={{ marginTop: "100px", textAlign: "center" }}>
          <p style={{ fontSize: "15px", color: "var(--muted)" }}>
            Questions? Reach out on{" "}
            <a href="https://github.com/mohasbks/Audiomap" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text)", textDecoration: "underline", textDecorationColor: "var(--border-2)" }}>
              GitHub
            </a>
            .
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
