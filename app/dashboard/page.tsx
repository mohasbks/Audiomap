"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteNavbar, SiteFooter } from "@/app/page";
import { getProjects, deleteProject, renameProject, type MapProject } from "@/lib/storage";

const IcPlus = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14m-7-7h14"/></svg>;
const IcOpen = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>;
const IcMap  = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4m0 0-7 6m7-6 7 6"/></svg>;

export default function DashboardPage() {
  const [projects, setProjects] = useState<MapProject[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getProjects().then(p => { setProjects(p); setLoading(false); });
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this map permanently?")) return;
    await deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleRename = async (id: string, currentName: string) => {
    const name = window.prompt("New name:", currentName);
    if (!name || name === currentName) return;
    await renameProject(id, name);
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, name } : p)));
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <SiteNavbar />

      <main style={{ flex: 1, paddingTop: "60px" }}>

        {/* ── PAGE HEADER ── */}
        <section style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-alt)" }}>
          <div className="dash-header" style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 48px 48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>Workspace</p>
              <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.05em", marginBottom: "8px" }}>Saved Maps</h1>
              <p style={{ fontSize: "14px", color: "var(--muted)" }}>
                {loading ? "Loading…" : `${projects.length} ${projects.length === 1 ? "map" : "maps"} saved locally`}
              </p>
            </div>
            <Link href="/app" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "var(--text)", color: "var(--bg)",
              padding: "11px 24px", borderRadius: "9px",
              fontSize: "13px", fontWeight: 700, textDecoration: "none",
              transition: "opacity 0.18s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              <IcPlus /> New Map
            </Link>
          </div>
        </section>

        {/* ── CONTENT ── */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 48px 100px" }}>

          {loading ? (
            /* Skeleton */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="card" style={{ height: "220px", animationDelay: `${i * 0.07}s` }}>
                  <div style={{ height: "100%", background: "linear-gradient(90deg, var(--surface) 0%, var(--surface-2) 50%, var(--surface) 100%)", backgroundSize: "600px 100%", animation: "shimmer 1.5s infinite" }} />
                </div>
              ))}
            </div>

          ) : projects.length === 0 ? (
            /* Empty state */
            <div style={{
              textAlign: "center", padding: "100px 40px",
              border: "1px dashed var(--border-2)", borderRadius: "16px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
            }}>
              <div style={{ color: "var(--border-2)" }}><IcMap /></div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.03em" }}>No maps yet</h2>
              <p style={{ color: "var(--muted)", fontSize: "14px", maxWidth: "300px", lineHeight: 1.65 }}>
                Generate your first mind map in the workspace. Maps save automatically.
              </p>
              <Link href="/app" style={{
                marginTop: "8px", color: "var(--accent)", fontSize: "14px",
                fontWeight: 600, textDecoration: "none",
                padding: "10px 24px", border: "1px solid rgba(74,123,189,0.3)",
                borderRadius: "8px", transition: "all 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-dim)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                Open Workspace
              </Link>
            </div>

          ) : (
            /* Project grid */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {projects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onDelete={handleDelete}
                  onRename={handleRename}
                />
              ))}
            </div>
          )}

        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ── Project Card ── */
function ProjectCard({
  project, index, onDelete, onRename,
}: {
  project: MapProject;
  index: number;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const date = new Date(project.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div
      className="card"
      style={{ padding: "0", overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.2s, transform 0.2s", animationDelay: `${index * 0.04}s` }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)";   e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Preview */}
      <div style={{ height: "120px", background: "var(--bg)", borderBottom: "1px solid var(--border)", overflow: "hidden", position: "relative" }}>
        <svg width="100%" height="100%" viewBox="0 0 300 120" style={{ opacity: 0.6 }}>
          <ellipse cx="150" cy="60" rx="40" ry="20" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="1.2"/>
          <text x="150" y="65" textAnchor="middle" fill="var(--text)" fontSize="9" fontWeight="600" fontFamily="Inter,sans-serif">
            {project.name.split(" ").slice(0, 2).join(" ")}
          </text>
          {[[55, 25], [55, 95], [245, 25], [245, 95]].map(([bx, by], i) => (
            <g key={i}>
              <line x1="150" y1="60" x2={bx} y2={by} stroke="var(--border-2)" strokeWidth="1"/>
              <rect x={bx - 30} y={by - 13} width="60" height="26" rx="5" fill="var(--surface)" stroke="var(--border-2)" strokeWidth="1"/>
            </g>
          ))}
          {[[18, 10], [18, 42], [282, 10], [282, 42], [18, 78], [18, 110], [282, 78], [282, 110]].map(([lx, ly], i) => (
            <rect key={i} x={lx - 13} y={ly - 7} width="26" height="14" rx="3" fill="var(--bg-alt)" stroke="var(--border)" strokeWidth="0.7" opacity="0.5"/>
          ))}
        </svg>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, var(--surface) 100%)", pointerEvents: "none" }} />
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px 14px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "4px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
            {project.name}
          </h3>
          <p style={{ fontSize: "11.5px", color: "var(--muted)", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {project.transcript}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
          <span style={{ fontSize: "10.5px", color: "var(--muted)" }}>{date}</span>
          <div style={{ display: "flex", gap: "5px" }}>
            <Link href={`/app?id=${project.id}`} style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "5px 12px", background: "var(--accent)", color: "#fff",
              borderRadius: "6px", fontSize: "11px", fontWeight: 700, textDecoration: "none", transition: "opacity 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              Open <IcOpen />
            </Link>

            {[{ label: "Rename", action: () => onRename(project.id, project.name), danger: false },
              { label: "Delete", action: () => onDelete(project.id), danger: true }].map(btn => (
              <button key={btn.label} onClick={btn.action} style={{
                padding: "5px 10px", background: "transparent",
                border: "1px solid var(--border-2)", borderRadius: "6px",
                color: "var(--muted)", fontSize: "11px", cursor: "pointer", transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = btn.danger ? "var(--error)" : "var(--text)"; e.currentTarget.style.borderColor = btn.danger ? "var(--error)" : "var(--muted)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border-2)"; }}>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
