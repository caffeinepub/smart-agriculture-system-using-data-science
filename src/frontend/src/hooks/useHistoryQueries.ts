import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { CropYieldResult, PlantDiseaseResult, IrrigationResult } from '../backend';

export function useGetCropYieldHistory() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<CropYieldResult[]>({
    queryKey: ['cropYieldHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCropYieldHistory();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetPlantDiseaseHistory() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<PlantDiseaseResult[]>({
    queryKey: ['plantDiseaseHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPlantDiseaseHistory();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetIrrigationHistory() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<IrrigationResult[]>({
    queryKey: ['irrigationHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIrrigationHistory();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useClearHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearHistory();
    },
    onSuccess: () => {
      // Invalidate all history queries to refresh immediately
      queryClient.invalidateQueries({ queryKey: ['cropYieldHistory'] });
      queryClient.invalidateQueries({ queryKey: ['plantDiseaseHistory'] });
      queryClient.invalidateQueries({ queryKey: ['irrigationHistory'] });
    },
  });
}
