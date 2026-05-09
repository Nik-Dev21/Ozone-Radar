import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '../constants/prompts';
import type { AIBriefing, PollutionPoint, Urgency } from './types';

// ---------------------------------------------------------------------------
// LLM Configuration
//
// Currently using OpenAI (gpt-4o-mini).
//
// To switch to Featherless when credits arrive, change these 3 lines:
//   1. apiKey  -> process.env.EXPO_PUBLIC_FEATHERLESS_API_KEY
//   2. baseURL -> 'https://api.featherless.ai/v1'
//   3. model   -> 'meta-llama/Meta-Llama-3.1-70B-Instruct'
//
// No other code changes are needed — the OpenAI SDK is fully compatible.
// ---------------------------------------------------------------------------

const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '',
  dangerouslyAllowBrowser: true, // Required in Expo / React Native
});

const MODEL = 'gpt-4o-mini';

// ---------------------------------------------------------------------------
// Derive urgency from the point's severity as a fallback
// ---------------------------------------------------------------------------

function severityToUrgency(severity: PollutionPoint['severity']): Urgency {
  switch (severity) {
    case 'high':
      return 'Avoid';
    case 'medium':
      return 'Caution';
    default:
      return 'Safe';
  }
}

// ---------------------------------------------------------------------------
// Generate an AI health briefing for a pollution hotspot
// ---------------------------------------------------------------------------

export async function generateBriefing(point: PollutionPoint): Promise<AIBriefing> {
  try {
    const userMessage = `Pollutant: ${point.layerId}\nValue: ${point.value} ${point.unit}\nSeverity: ${point.severity}`;

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('Empty LLM response');
    }

    const parsed = JSON.parse(content) as AIBriefing;

    // Validate required fields exist
    if (!parsed.explanation || !parsed.action || !parsed.urgency) {
      throw new Error('Incomplete LLM response');
    }

    return parsed;
  } catch {
    // Fallback briefing derived from the point's raw data
    return {
      explanation: `${point.layerId.toUpperCase()} levels are currently at ${point.value} ${point.unit}, which is considered ${point.severity} severity.`,
      action: point.severity === 'high'
        ? 'Limit outdoor activities and stay indoors if possible.'
        : 'Monitor conditions and reduce prolonged outdoor exposure.',
      urgency: severityToUrgency(point.severity),
    };
  }
}
