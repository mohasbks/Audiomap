import { NextRequest, NextResponse } from 'next/server';
import { createLocalMap, normalizeAiMap } from '@/lib/map-generator';
import { currentGroqModel, describeGroqError, GROQ_ENDPOINT, GroqRequestError } from '@/lib/groq';

const SYSTEM_PROMPT = `Turn the user's text into a clear Mermaid mindmap. Return only JSON with {"mermaid":"...","resources":[...]}. Mermaid must start with mindmap, then root((topic)), have 3-5 useful branches and 2-4 children per branch, and use short labels without brackets or quotes. Resources must contain only URLs you are certain are real HTTPS pages, grouped by top-level topic, with type course, doc, video, or article. Never invent a URL. Preserve the user's language.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = String(body?.text || '').trim();
    if (text.length < 3) return NextResponse.json({ error: 'Enter at least 3 characters.' }, { status: 400 });
    if (text.length > 12_000) return NextResponse.json({ error: 'Text is too long. Keep it under 12,000 characters.' }, { status: 413 });
    const apiKey = process.env.GROQ_API_KEY;
    const model = currentGroqModel();
    if (!apiKey) return NextResponse.json(createLocalMap(text, 'GROQ_API_KEY is missing in this deployment. Add it to Vercel Production and redeploy.', { reason: 'not_configured' }));

    try {
      const response = await fetch(GROQ_ENDPOINT, {
        method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: `${SYSTEM_PROMPT}\n\nUser input:\n${text}` }],
          include_reasoning: false,
          reasoning_effort: 'low',
          max_completion_tokens: 2400,
          response_format: { type: 'json_object' },
        }),
        signal: AbortSignal.timeout(25_000), cache: 'no-store',
      });
      if (!response.ok) throw new GroqRequestError(response.status, (await response.text()).slice(0, 250));
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== 'string') throw new Error('The AI returned an empty response');
      return NextResponse.json(normalizeAiMap(JSON.parse(content), model), { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
      console.error('Live map generation unavailable:', error);
      const failure = describeGroqError(error);
      return NextResponse.json(createLocalMap(text, failure.notice, { reason: failure.reason, providerStatus: failure.providerStatus }));
    }
  } catch (error) {
    console.error('Generate map request error:', error);
    return NextResponse.json({ error: 'The request could not be processed.' }, { status: 400 });
  }
}
