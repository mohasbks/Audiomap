# Audiomap

**Turn voice into interactive mind maps — in under a second.**

Audiomap is an AI-powered tool that converts voice recordings or text prompts into fully interactive, draggable mind maps. Built on Groq LPU, LLaMA 3.3 70B, and Whisper v3.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=flat-square)](https://audiomap-ten.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Groq](https://img.shields.io/badge/Groq-LPU-orange?style=flat-square)](https://groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## What it does

1. **Speak or type** any concept, topic, or question
2. **Whisper v3** transcribes your voice with near-human accuracy (Arabic + English)
3. **LLaMA 3.3 70B** on Groq LPU structures it into a hierarchical mind map in <1s
4. **React Flow** renders an interactive, draggable canvas
5. **Export** as PNG, SVG, JSON, or Markdown

---

## Features

| Feature | Description |
|---|---|
| Voice Input | Arabic & English via Whisper v3 on Groq |
| Text Input | Direct prompt to mind map |
| Interactive Canvas | React Flow — drag, zoom, pan nodes |
| Auto-Save | IndexedDB local persistence, no backend needed |
| Dashboard | Manage all saved maps |
| Export | PNG (2×), SVG, JSON, Markdown |
| Dark / Light Mode | System-aware theme toggle |
| Curated Resources | AI-surfaced docs, courses, videos per topic |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| AI Inference | Groq LPU — 800+ tok/s |
| Language Model | Meta LLaMA 3.3 70B |
| Speech-to-Text | OpenAI Whisper v3 |
| Canvas | React Flow (`@xyflow/react`) |
| Storage | IndexedDB via `idb` |
| Styling | Vanilla CSS (no Tailwind) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Groq API Key](https://console.groq.com) (free tier available)

### Installation

```bash
git clone https://github.com/mohasbks/Audiomap.git
cd Audiomap
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
GROQ_API_KEY=gsk_your_key_here
```

Get your key from [console.groq.com](https://console.groq.com) — it's free.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
audiomap/
├── app/
│   ├── page.tsx          # Landing page
│   ├── app/page.tsx      # Main workspace
│   ├── dashboard/        # Saved maps
│   ├── pricing/          # Pricing page
│   ├── about/            # Architecture page
│   └── api/
│       ├── generate-map/ # LLaMA 3.3 → Mermaid
│       └── transcribe/   # Whisper STT
├── components/
│   ├── FlowCanvas.tsx    # React Flow wrapper
│   ├── AudioRecorder.tsx # MediaRecorder API
│   └── ThemeToggle.tsx
└── lib/
    ├── storage.ts         # IndexedDB helpers
    └── mermaid-to-flow.ts # Mermaid → React Flow nodes
```

---

## How It Works

```
Voice/Text → Whisper v3 (STT) → LLaMA 3.3 70B → Mermaid Syntax → React Flow Canvas
```

All AI calls go through Next.js API routes so your Groq key never reaches the client.

---

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mohasbks/Audiomap)

Add your `GROQ_API_KEY` in Vercel's Environment Variables settings after deployment.

---

## Roadmap

- [ ] Shareable links (Base64 URL encoding)
- [ ] Inline node editing on the canvas
- [ ] Multi-language UI
- [ ] Cloud sync (Supabase/PlanetScale)
- [ ] Team collaboration (Yjs / WebSockets)
- [ ] Browser extension

---

## Author

Built by **Motasem Bellah** ([@mohasbks](https://github.com/mohasbks))

---

## License

MIT — do whatever you want with it.
