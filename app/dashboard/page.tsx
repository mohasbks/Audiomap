"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteNavbar, SiteFooter } from "@/app/page";
import { getProjects, deleteProject, renameProject, type MapProject } from "@/lib/storage";

export default function DashboardPage() {
  const [projects, setProjects] = useState<MapProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then((p) => {
      setProjects(p);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this map permanently?")) return;
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleRename = async (id: string, currentName: string) => {
    const name = window.prompt("New name:", currentName);
    if (!name || name === currentName) return;
    await renameProject(id, name);
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNavbar />

      <main style={{ flex: 1, maxWidth: "1100px", margin: "0 auto", padding: "100px 40px 80px", width: "100%" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "52px" }}>
          <div>
            <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: "10px" }}>
              Your Workspace
            </p>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.04em", marginBottom: "8px" }}>
              Saved Maps
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "15px" }}>
              {loading ? "Loading…" : `${projects.length} saved ${projects.length === 1 ? "map" : "maps"}`}
            </p>
          </div>
          <Link href="/app" style={{
            background: "var(--accent)", color: "#fff", padding: "12px 28px",
            borderRadius: "10px", fontSize: "14px", fontWeight: 700, textDecoration: "none",
            display: "flex", alignItems: "center", gap: "8px",
            boxShadow: "0 8px 24px rgba(74,123,189,0.3)", transition: "opacity 0.2s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14m-7-7h14"/></svg>
            New Map
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="card" style={{ height: "220px", animation: "fadeUp 0.5s ease both", animationDelay: `${i * 0.08}s` }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg, var(--surface) 0%, var(--surface-2) 50%, var(--surface) 100%)", backgroundSize: "600px 100%", animation: "shimmer 1.5s infinite" }} />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "100px 40px", border: "1px dashed var(--border-2)",
            borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
          }}>
            <div style={{ fontSize: "52px" }}>🗺️</div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.03em" }}>No maps saved yet</h2>
            <p style={{ color: "var(--muted)", fontSize: "15px", maxWidth: "340px", lineHeight: 1.6 }}>
              Generate your first mind map in the workspace. Maps are saved automatically.
            </p>
            <Link href="/app" style={{
              marginTop: "8px", color: "var(--accent)", fontSize: "15px", fontWeight: 600, textDecoration: "none",
              padding: "10px 24px", border: "1px solid var(--accent)", borderRadius: "8px", transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-dim)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Open Workspace →
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
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
      </main>

      <SiteFooter />
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  onDelete,
  onRename,
}: {
  project: MapProject;
  index: number;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const date = new Date(project.updatedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div
      className="card anim-up"
      style={{
        padding: "0", overflow: "hidden", display: "flex", flexDirection: "column",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        animationDelay: `${index * 0.05}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-2)";
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Preview SVG */}
      <div style={{ height: "130px", background: "var(--bg)", borderBottom: "1px solid var(--border)", overflow: "hidden", position: "relative" }}>
        <svg width="100%" height="100%" viewBox="0 0 300 130" style={{ opacity: 0.7 }}>
          {/* Central node */}
          <ellipse cx="150" cy="65" rx="42" ry="22" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="1.2" />
          <text x="150" y="70" textAnchor="middle" fill="var(--text)" fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">
            {project.name.split(" ").slice(0, 2).join(" ")}
          </text>
          {/* Branch nodes */}
          {[
            [55, 28], [55, 102], [245, 28], [245, 102]
          ].map(([bx, by], i) => (
            <g key={i}>
              <line x1="150" y1="65" x2={bx} y2={by} stroke="var(--border-2)" strokeWidth="1" />
              <rect x={bx - 32} y={by - 14} width="64" height="28" rx="5" fill="var(--surface)" stroke="var(--border-2)" strokeWidth="1" />
            </g>
          ))}
          {/* Leaf nodes */}
          {[
            [18, 12], [18, 48], [282, 12], [282, 48], [18, 82], [18, 118], [282, 82], [282, 118]
          ].map(([lx, ly], i) => (
            <g key={i}>
              <rect x={lx - 14} y={ly - 8} width="28" height="16" rx="3" fill="var(--bg-alt)" stroke="var(--border)" strokeWidth="0.8" opacity="0.6" />
            </g>
          ))}
        </svg>
        {/* Gradient fade */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, var(--surface-2) 100%)", pointerEvents: "none" }} />
      </div>

      {/* Card body */}
      <div style={{ padding: "18px 20px 16px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)", marginBottom: "5px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
            {project.name}
          </h3>
          <p style={{
            fontSize: "12px", color: "var(--muted)", lineHeight: 1.55,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {project.transcript}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
          <span style={{ fontSize: "11px", color: "var(--muted)" }}>{date}</span>
          <div style={{ display: "flex", gap: "6px" }}>
            <Link href={`/app?id=${project.id}`} style={{
              padding: "5px 14px", background: "var(--accent)", color: "#fff",
              borderRadius: "6px", fontSize: "11px", fontWeight: 700, textDecoration: "none",
              transition: "opacity 0.15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Open
            </Link>
            <button onClick={() => onRename(project.id, project.name)} style={{
              padding: "5px 10px", background: "transparent", border: "1px solid var(--border-2)",
              borderRadius: "6px", color: "var(--muted)", fontSize: "11px", cursor: "pointer",
              transition: "all 0.15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--muted)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border-2)"; }}
            >
              Rename
            </button>
            <button onClick={() => onDelete(project.id)} style={{
              padding: "5px 10px", background: "transparent", border: "1px solid var(--border-2)",
              borderRadius: "6px", color: "var(--muted)", fontSize: "11px", cursor: "pointer",
              transition: "all 0.15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--error)"; e.currentTarget.style.borderColor = "var(--error)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border-2)"; }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
