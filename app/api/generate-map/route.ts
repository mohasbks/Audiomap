import { NextRequest, NextResponse } from 'next/server';
import { createLocalMap, normalizeAiMap } from '@/lib/map-generator';

const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-oss-20b';
const SYSTEM_PROMPT = `Turn the user's text into a clear Mermaid mindmap. Return only JSON with {"mermaid":"...","resources":[...]}. Mermaid must start with mindmap, then root((topic)), have 3-5 useful branches and 2-4 children per branch, and use short labels without brackets or quotes. Resources must contain only URLs you are certain are real HTTPS pages, grouped by top-level topic, with type course, doc, video, or article. Never invent a URL. Preserve the user's language.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = String(body?.text || '').trim();
    if (text.length < 3) return NextResponse.json({ error: 'Enter at least 3 characters.' }, { status: 400 });
    if (text.length > 12_000) return NextResponse.json({ error: 'Text is too long. Keep it under 12,000 characters.' }, { status: 413 });
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_CHAT_MODEL?.trim() || DEFAULT_MODEL;
    if (!apiKey) return NextResponse.json(createLocalMap(text, 'Live AI is not configured, so Audiomap built this map locally.'));

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: text }], temperature: 0.2, max_completion_tokens: 2400, response_format: { type: 'json_object' } }),
        signal: AbortSignal.timeout(25_000), cache: 'no-store',
      });
      if (!response.ok) throw new Error(`Groq returned ${response.status}: ${(await response.text()).slice(0, 250)}`);
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== 'string') throw new Error('The AI returned an empty response');
      return NextResponse.json(normalizeAiMap(JSON.parse(content), model), { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
      console.error('Live map generation unavailable:', error);
      return NextResponse.json(createLocalMap(text, 'Live AI was unavailable, so Audiomap built a reliable local map instead.'));
    }
  } catch (error) {
    console.error('Generate map request error:', error);
    return NextResponse.json({ error: 'The request could not be processed.' }, { status: 400 });
  }
}
