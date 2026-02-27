import { chat } from './llm';
import { playbookPrompt, type PlaybookContext } from './prompts';

export interface PlaybookAction {
  day: number;
  action: string;
  channel: string;
  template: string | null;
  tips: string;
}

export interface PlaybookWeek {
  week: number;
  theme: string;
  actions: PlaybookAction[];
}

export interface Competitor {
  name: string;
  url: string;
  pricing: string;
  gap: string;
}

export interface PricingSuggestion {
  model: string;
  tiers: { name: string; price: string; features: string }[];
  reasoning: string;
}

export interface Playbook {
  positioning: string;
  target_audience: {
    primary: string;
    channels: string[];
  };
  competitors: Competitor[];
  pricing_suggestion: PricingSuggestion;
  weeks: PlaybookWeek[];
}

export async function generatePlaybook(input: {
  productDescription: string;
  productType?: string;
  targetAudience?: string;
}): Promise<Playbook> {
  const context: PlaybookContext = {
    productDescription: input.productDescription,
    productType: input.productType,
    targetAudience: input.targetAudience,
  };

  const systemPrompt = playbookPrompt.build(context);
  const userMessage = `Here is the product I need a GTM playbook for:\n\n${input.productDescription}`;

  const raw = await chat(systemPrompt, userMessage);

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, raw];
  const jsonStr = jsonMatch[1]?.trim() || raw.trim();

  const playbook = JSON.parse(jsonStr) as Playbook;
  return playbook;
}
