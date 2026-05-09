import { useMutation } from '@tanstack/react-query';
import { generateBriefing } from '../services/llm';
import type { AIBriefing, PollutionPoint } from '../services/types';

/**
 * TanStack mutation that takes a PollutionPoint and returns an AIBriefing.
 * The LLM service already handles fallback on failure, so no extra error
 * handling is needed here.
 */
export function useAIExplanation() {
  return useMutation<AIBriefing, Error, PollutionPoint>({
    mutationFn: generateBriefing,
  });
}
