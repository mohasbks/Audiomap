import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert mind map generator AND educational resource curator.

Given a topic or text, you must return a valid JSON object with this EXACT structure:
{
  "mermaid": "<mermaid mindmap code here>",
  "resources": [
    {
      "topic": "<branch name>",
      "links": [
        { "title": "<resource title>", "url": "<real url>", "type": "course|doc|video|article" }
      ]
    }
  ]
}

MERMAID RULES:
- Output valid Mermaid mindmap syntax only inside the "mermaid" field
- Always start with: mindmap
- Root node must use: root((Topic Name))
- Generate AT LEAST 3 levels deep with 3-5 branches each
- Each branch should have 2-4 specific sub-topics
- Be specific and technical — no vague labels like "Other" or "More"
- Max 5 words per node label

RESOURCES RULES:
- For each TOP-LEVEL branch, provide 2-3 real learning resources
- Only use well-known, reliable URLs: YouTube, Coursera, fast.ai, official docs, MDN, Wikipedia, freeCodeCamp, MIT OpenCourseWare, etc.
- "type" must be one of: course, doc, video, article
- Titles must be specific (e.g. "fast.ai - Practical Deep Learning" not just "Course")

EXAMPLE OUTPUT (for "I want to learn React"):
{
  "mermaid": "mindmap\\n  root((React))\\n    Core Concepts\\n      JSX Syntax\\n      Components\\n      Props & State\\n    Hooks\\n      useState\\n      useEffect\\n      Custom Hooks\\n    Ecosystem\\n      React Router\\n      Redux Toolkit\\n      Next.js\\n    Performance\\n      Memoization\\n      Code Splitting\\n      Lazy Loading",
  "resources": [
    {
      "topic": "Core Concepts",
      "links": [
        { "title": "React Official Docs", "url": "https://react.dev", "type": "doc" },
        { "title": "freeCodeCamp React Course", "url": "https://www.freecodecamp.org/learn/front-end-development-libraries/", "type": "course" }
      ]
    },
    {
      "topic": "Hooks",
      "links": [
        { "title": "React Hooks in Depth - YouTube", "url": "https://www.youtube.com/results?search_query=react+hooks+tutorial", "type": "video" },
        { "title": "useHooks.com - Hook Recipes", "url": "https://usehooks.com", "type": "article" }
      ]
    }
  ]
}

Return ONLY the JSON object. No explanation, no markdown fences, no extra text.`;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content ?? "{}";

    let parsed: { mermaid?: string; resources?: unknown[] };
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Fallback: try to extract mermaid code manually
      const mermaidMatch = raw.match(/mindmap[\s\S]+/);
      parsed = { mermaid: mermaidMatch ? mermaidMatch[0].trim() : raw, resources: [] };
    }

    // Clean up any accidental markdown fences
    const mermaid = (parsed.mermaid ?? "")
      .replace(/```mermaid\n?/gi, "")
      .replace(/```\n?/gi, "")
      .trim();

    return NextResponse.json({ mermaid, resources: parsed.resources ?? [] });
  } catch (err) {
    console.error("Generate map error:", err);
    return NextResponse.json({ error: "Failed to generate mind map" }, { status: 500 });
  }
}
