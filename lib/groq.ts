export const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
export const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-20b';

export function currentGroqModel() {
  const configured = process.env.GROQ_CHAT_MODEL?.trim();
  if (!configured || configured === 'openai/gpt-oss-20') return DEFAULT_GROQ_MODEL;
  return configured;
}

export class GroqRequestError extends Error {
  constructor(public status: number, detail: string) {
    super(`Groq ${status}: ${detail}`);
  }
}

export function describeGroqError(error: unknown) {
  const status = error instanceof GroqRequestError ? error.status : undefined;
  if (status === 401) return { notice: 'Groq rejected GROQ_API_KEY (401). Replace the Production key in Vercel, then redeploy.', reason: 'authentication', providerStatus: status };
  if (status === 403) return { notice: 'Groq denied model access (403). Enable GPT-OSS 20B in Groq model permissions.', reason: 'permission', providerStatus: status };
  if (status === 429) return { notice: 'The Groq rate limit was reached (429). Retry after the limit resets.', reason: 'rate_limit', providerStatus: status };
  if (status === 400 || status === 404 || status === 422) return { notice: `Groq rejected the model request (${status}). Check GROQ_CHAT_MODEL and project permissions.`, reason: 'invalid_request', providerStatus: status };
  if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) return { notice: 'Groq timed out, so Audiomap generated this map locally.', reason: 'timeout' };
  return { notice: 'Groq is temporarily unavailable, so Audiomap generated this map locally.', reason: 'upstream', providerStatus: status };
}

export async function checkGroqStatus() {
  const apiKey = process.env.GROQ_API_KEY;
  const model = currentGroqModel();
  if (!apiKey) return { configured: false, reachable: false, model, reason: 'not_configured', message: 'GROQ_API_KEY is missing in this deployment.' };
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(10_000), cache: 'no-store',
    });
    if (!response.ok) {
      const failure = describeGroqError(new GroqRequestError(response.status, 'status check'));
      return { configured: true, reachable: false, model, reason: failure.reason, providerStatus: response.status, message: failure.notice };
    }
    const data = await response.json();
    const modelAccessible = Array.isArray(data?.data) && data.data.some((item: { id?: string }) => item.id === model);
    return { configured: true, reachable: true, model, modelAccessible, reason: modelAccessible ? null : 'permission', message: modelAccessible ? 'Groq key and model are ready.' : 'The key works, but this model is not available to the selected Groq project.' };
  } catch (error) {
    const failure = describeGroqError(error);
    return { configured: true, reachable: false, model, reason: failure.reason, message: failure.notice };
  }
}
