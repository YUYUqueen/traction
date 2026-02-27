import { createResilientLLM } from '@yuyuqueen/resilient-llm';
import Anthropic from '@anthropic-ai/sdk';

let _resilient: ReturnType<typeof createResilientLLM> | null = null;

export function getLLM() {
  if (_resilient) return _resilient;

  const apiKey = import.meta.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  _resilient = createResilientLLM({
    providers: [
      {
        name: 'anthropic',
        model: 'claude-sonnet-4-20250514',
        keys: [{ id: 'default', value: apiKey }],
      },
    ],
    timeoutMs: 120_000,
  });

  return _resilient;
}

export async function chat(systemPrompt: string, userMessage: string): Promise<string> {
  const resilient = getLLM();

  const result = await resilient.call(async (ctx) => {
    const client = new Anthropic({ apiKey: ctx.apiKey.value });
    const response = await client.messages.create({
      model: ctx.model,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    return { response: textBlock?.text ?? '', usage: response.usage };
  });

  return result.response;
}
