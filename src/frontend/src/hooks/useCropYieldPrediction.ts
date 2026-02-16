import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CropYieldInput, CropYieldResult } from '../backend';

/**
 * Hook for crop yield prediction.
 * Accepts soil type, rainfall, temperature, humidity, and fertilizer usage.
 * Returns predicted yield (tons/hectare) and accuracy score.
 * Results are automatically stored in the user's history on the backend.
 */
export function useCropYieldPrediction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<CropYieldResult, Error, CropYieldInput>({
    mutationFn: async (input: CropYieldInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.predictYield(input);
    },
    onSuccess: () => {
      // Invalidate history to refresh the list
      queryClient.invalidateQueries({ queryKey: ['cropYieldHistory'] });
    },
  });
}
