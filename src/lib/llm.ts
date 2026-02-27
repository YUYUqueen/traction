import { chat as aiChat } from '../../../../toolkit/ai/ts/index.js';

export async function chat(systemPrompt: string, userMessage: string): Promise<string> {
  return aiChat('playbook-generation', systemPrompt, userMessage);
}
