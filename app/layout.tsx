import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Audiomap — Turn Voice and Text into Mind Maps",
  description: "Transform thoughts into editable, structured mind maps using voice, text, and AI-assisted organization.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {/*
          ── GOOSEBUMPS TEXTURE OVERLAY ──
          SVG filter must live directly in the DOM (not as CSS data URI)
          for feTurbulence + feDiffuseLighting to render in the browser.
          Two layers:
            1. 3D Bump map  → looks like raised skin / leather grain
            2. Micro noise  → fine-grain film texture on top
        */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0 }}
          >
            <defs>
              {/* Layer 1 — 3D bumps (goosebumps / pore texture) */}
              <filter id="skin-bump" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="linearRGB">
                <feTurbulence
                  type="turbulence"
                  baseFrequency="0.62 0.65"
                  numOctaves="4"
                  seed="12"
                  stitchTiles="stitch"
                  result="turbOut"
                />
                <feDiffuseLighting
                  in="turbOut"
                  lightingColor="#ffffff"
                  surfaceScale="2.5"
                  result="bumpOut"
                >
                  <feDistantLight azimuth="135" elevation="50" />
                </feDiffuseLighting>
                <feBlend in="SourceGraphic" in2="bumpOut" mode="multiply" result="blended" />
                <feComposite in="blended" in2="bumpOut" operator="in" />
              </filter>

              {/* Layer 2 — fine fractal grain */}
              <filter id="micro-grain" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.85"
                  numOctaves="3"
                  stitchTiles="stitch"
                />
              </filter>
            </defs>

            {/* Bump layer — organic 3D pore effect, very subtle */}
            <rect
              width="100%"
              height="100%"
              filter="url(#skin-bump)"
              opacity="0.04"
              fill="white"
            />

            {/* Grain layer — fine film grain over everything */}
            <rect
              width="100%"
              height="100%"
              filter="url(#micro-grain)"
              opacity="0.038"
              fill="white"
            />
          </svg>
        </div>

        {children}
      </body>
    </html>
  );
}
