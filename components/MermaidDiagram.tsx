"use client";

import { useEffect, useRef } from "react";

// Initialize once at module level — before any component mounts
let initialized = false;

interface MermaidDiagramProps {
  code: string;
}

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !code) return;

    const render = async () => {
      try {
        // Dynamic import to guarantee client-side only
        const mermaid = (await import("mermaid")).default;

        if (!initialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "base",
            themeVariables: {
              background: "#1a1d24",
              primaryColor: "#252933",
              primaryTextColor: "#e2e4e8",
              primaryBorderColor: "#2a2d35",
              lineColor: "#3a4050",
              secondaryColor: "#1a1d24",
              tertiaryColor: "#111318",
              fontFamily: "Inter, -apple-system, sans-serif",
              fontSize: "14px",
              nodeBorder: "#2a2d35",
              clusterBkg: "#1a1d24",
              titleColor: "#e2e4e8",
              edgeLabelBackground: "#1a1d24",
            },
          });
          initialized = true;
        }

        // Use a unique ID every render to avoid Mermaid v10/11 ID conflict
        const uniqueId = `mm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        const { svg } = await mermaid.render(uniqueId, code);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          // Make SVG fill container
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
          }
        }
      } catch (err) {
        console.error("Mermaid render error:", err);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div style="text-align:center;padding:24px;">
              <p style="color:#8b8f9a;font-size:13px;margin-bottom:8px;">⚠ Could not render diagram</p>
              <p style="color:#4a5260;font-size:12px;font-family:monospace;white-space:pre-wrap;text-align:left;max-width:400px;">${code.slice(0, 200)}</p>
            </div>`;
        }
      }
    };

    render();
  }, [code]);

  return (
    <div
      ref={containerRef}
      className="mermaid-container fade-in"
      style={{
        width: "100%",
        minHeight: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        borderRadius: "8px",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        overflow: "auto",
      }}
    >
      <p style={{ color: "var(--muted)", fontSize: "13px" }}>Rendering diagram...</p>
    </div>
  );
}
