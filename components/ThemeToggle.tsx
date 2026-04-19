"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved =
      (localStorage.getItem("audiomap-theme") as "dark" | "light") ?? "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("audiomap-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (!mounted) return <div style={{ width: 36, height: 36 }} />;

  return (
    <button
      onClick={toggle}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label="Toggle theme"
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        background: "transparent",
        border: "1px solid var(--border-2)",
        color: "var(--text-2)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = "var(--surface-2)";
        el.style.color = "var(--text)";
        el.style.borderColor = "var(--border-2)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = "transparent";
        el.style.color = "var(--text-2)";
        el.style.borderColor = "var(--border-2)";
      }}
    >
      {theme === "dark" ? (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
