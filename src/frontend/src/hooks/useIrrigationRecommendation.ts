import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { IrrigationInput, IrrigationResult } from '../backend';

/**
 * Hook for smart irrigation recommendation.
 * Accepts soil moisture level, weather condition, and temperature.
 * Returns water required (liters/acre) and a boolean recommendation (yes/no).
 * Results are automatically stored in the user's history on the backend.
 */
export function useIrrigationRecommendation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<IrrigationResult, Error, IrrigationInput>({
    mutationFn: async (input: IrrigationInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getIrrigationRecommendation(input);
    },
    onSuccess: () => {
      // Invalidate history to refresh the list
      queryClient.invalidateQueries({ queryKey: ['irrigationHistory'] });
    },
  });
}
