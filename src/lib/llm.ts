import { createResilientLLM } from '@yuyuqueen/resilient-llm';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI, { AzureOpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const env = (key: string) =>
  import.meta.env?.[key] || process.env[key] || '';

let _resilient: ReturnType<typeof createResilientLLM> | null = null;

export function getLLM() {
  if (_resilient) return _resilient;

  const providers: Parameters<typeof createResilientLLM>[0]['providers'] = [];

  // Azure OpenAI — 优先（免费额度大，gpt-5.2 可用）
  const azureKey = env('AZURE_OPENAI_API_KEY');
  const azureEndpoint = env('AZURE_OPENAI_ENDPOINT');
  if (azureKey && azureEndpoint) {
    providers.push({
      name: 'azure-openai',
      model: 'gpt-5.2',
      keys: [{ id: 'azure-default', value: azureKey }],
    });
  }

  // Anthropic Claude
  const anthropicKey = env('ANTHROPIC_API_KEY');
  if (anthropicKey) {
    providers.push({
      name: 'anthropic',
      model: 'claude-sonnet-4-20250514',
      keys: [{ id: 'anthropic-default', value: anthropicKey }],
    });
  }

  // OpenAI (direct)
  const openaiKey = env('OPENAI_API_KEY');
  if (openaiKey) {
    providers.push({
      name: 'openai',
      model: 'gpt-5.2',
      keys: [{ id: 'openai-default', value: openaiKey }],
    });
  }

  // Google Gemini
  const googleKey = env('GEMINI_API_KEY') || env('GOOGLE_AI_API_KEY');
  if (googleKey) {
    providers.push({
      name: 'google',
      model: 'gemini-3-flash-preview',
      keys: [{ id: 'google-default', value: googleKey }],
    });
  }

  if (providers.length === 0) {
    throw new Error(
      'No LLM API key configured. Set at least one of: AZURE_OPENAI_API_KEY+AZURE_OPENAI_ENDPOINT, ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY',
    );
  }

  _resilient = createResilientLLM({ providers, timeoutMs: 120_000 });
  return _resilient;
}

export async function chat(systemPrompt: string, userMessage: string): Promise<string> {
  const resilient = getLLM();

  const result = await resilient.call(async (ctx) => {
    if (ctx.provider === 'azure-openai') {
      const client = new AzureOpenAI({
        endpoint: env('AZURE_OPENAI_ENDPOINT'),
        apiKey: ctx.apiKey.value,
        apiVersion: env('AZURE_OPENAI_API_VERSION') || '2025-04-01-preview',
      });
      const response = await client.chat.completions.create({
        model: ctx.model,
        max_tokens: 8192,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      });
      return {
        response: response.choices[0]?.message?.content ?? '',
        usage: response.usage,
      };
    }

    if (ctx.provider === 'anthropic') {
      const client = new Anthropic({ apiKey: ctx.apiKey.value });
      const response = await client.messages.create({
        model: ctx.model,
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });
      const text = response.content.find((b) => b.type === 'text');
      return { response: text?.text ?? '', usage: response.usage };
    }

    if (ctx.provider === 'openai') {
      const client = new OpenAI({ apiKey: ctx.apiKey.value });
      const response = await client.chat.completions.create({
        model: ctx.model,
        max_tokens: 8192,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      });
      return {
        response: response.choices[0]?.message?.content ?? '',
        usage: response.usage,
      };
    }

    if (ctx.provider === 'google') {
      const genAI = new GoogleGenerativeAI(ctx.apiKey.value);
      const model = genAI.getGenerativeModel({
        model: ctx.model,
        systemInstruction: systemPrompt,
      });
      const response = await model.generateContent(userMessage);
      return {
        response: response.response.text(),
        usage: response.response.usageMetadata,
      };
    }

    throw new Error(`Unknown provider: ${ctx.provider}`);
  });

  return result.response;
}
