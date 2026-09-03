import { z } from "zod";

export const generateOptionsSchema = z.object({
  prompt: z.string().min(1),
  system: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().int().positive().default(1024),
});

export type GenerateOptions = z.infer<typeof generateOptionsSchema>;

export interface AiProvider {
  generateText(options: GenerateOptions): Promise<string>;
}

/**
 * Provider-agnostic AI wrapper. Implement `AiProvider` with the Vercel AI SDK,
 * OpenAI, Anthropic, etc. and register it via `setAiProvider`.
 */
let provider: AiProvider | null = null;

export function setAiProvider(next: AiProvider) {
  provider = next;
}

export async function generateText(
  options: GenerateOptions,
): Promise<string> {
  if (!provider) {
    throw new Error(
      "No AI provider configured. Call setAiProvider() during app startup.",
    );
  }
  return provider.generateText(generateOptionsSchema.parse(options));
}
