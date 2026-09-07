export type ResourceLink = { title: string; url: string; type: 'course' | 'doc' | 'video' | 'article' };
export type ResourceGroup = { topic: string; links: ResourceLink[] };
export type MapResult = { mermaid: string; resources: ResourceGroup[]; meta: { mode: 'ai' | 'local'; model: string; notice?: string; reason?: string; providerStatus?: number } };

function cleanLabel(value: string, fallback: string) {
  const cleaned = value.replace(/[\r\n\t]+/g, ' ').replace(/[()[\]{}"`]/g, '').replace(/\s+/g, ' ').trim();
  return (cleaned || fallback).split(' ').slice(0, 7).join(' ');
}

function chunks(text: string) {
  return text.split(/(?:[.!?؛،]\s+|\n+|;\s*)/).map((item) => cleanLabel(item, '')).filter((item) => item.length > 2);
}

export function createLocalMap(text: string, notice: string, diagnostic: { reason?: string; providerStatus?: number } = {}): MapResult {
  const ideas = chunks(text);
  const root = cleanLabel(ideas[0] || text, 'New Idea');
  const branches = ideas.length > 1 ? ideas.slice(0, 5) : ['Foundations', 'Core Concepts', 'Applications', 'Next Steps'];
  const lines = ['mindmap', `  root((${root}))`];
  branches.forEach((branch, index) => {
    const safeBranch = cleanLabel(branch, `Area ${index + 1}`);
    lines.push(`    ${safeBranch}`);
    if (ideas.length > 1) {
      const words = safeBranch.split(' ');
      lines.push(`      ${cleanLabel(words.slice(0, Math.ceil(words.length / 2)).join(' '), 'Main point')}`);
      lines.push(`      ${cleanLabel(words.slice(Math.ceil(words.length / 2)).join(' '), 'Supporting detail')}`);
    } else {
      const children = index === 0 ? ['Definitions', 'Key Principles'] : index === 1 ? ['Components', 'Relationships'] : index === 2 ? ['Use Cases', 'Examples'] : ['Priorities', 'Action Plan'];
      children.forEach((child) => lines.push(`      ${child}`));
    }
  });
  return {
    mermaid: lines.join('\n'),
    resources: [{ topic: 'Research', links: [
      { title: 'Wikipedia — topic overview', url: `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(root)}`, type: 'article' },
      { title: 'MIT OpenCourseWare — related courses', url: `https://ocw.mit.edu/search/?q=${encodeURIComponent(root)}`, type: 'course' },
    ] }],
    meta: { mode: 'local', model: 'Audiomap local structurer', notice, ...diagnostic },
  };
}

function validResources(input: unknown): ResourceGroup[] {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 5).flatMap((group) => {
    if (!group || typeof group !== 'object') return [];
    const candidate = group as { topic?: unknown; links?: unknown };
    const links = Array.isArray(candidate.links) ? candidate.links.flatMap((link) => {
      if (!link || typeof link !== 'object') return [];
      const item = link as Record<string, unknown>;
      const type = ['course', 'doc', 'video', 'article'].includes(String(item.type)) ? String(item.type) as ResourceLink['type'] : 'article';
      try {
        const url = new URL(String(item.url));
        if (url.protocol !== 'https:') return [];
        return [{ title: cleanLabel(String(item.title), 'Learning resource'), url: url.toString(), type }];
      } catch { return []; }
    }) : [];
    return links.length ? [{ topic: cleanLabel(String(candidate.topic), 'Resources'), links: links.slice(0, 3) }] : [];
  });
}

export function normalizeAiMap(raw: unknown, model: string): MapResult {
  const parsed = raw as { mermaid?: unknown; resources?: unknown };
  const mermaid = String(parsed?.mermaid || '').replace(/```mermaid\s*/gi, '').replace(/```/g, '').trim();
  if (!mermaid.startsWith('mindmap') || mermaid.length > 20_000) throw new Error('The model returned an invalid map');
  return { mermaid, resources: validResources(parsed.resources), meta: { mode: 'ai', model } };
}
