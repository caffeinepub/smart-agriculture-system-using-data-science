import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';
import { fileToUint8Array } from '../utils/fileToUint8Array';
import type { PlantDiseaseResult } from '../backend';

/**
 * Hook for plant disease detection.
 * Accepts a File object (image), converts it to bytes using ExternalBlob,
 * and sends it to the backend for analysis.
 * Returns disease name, confidence percentage, and suggested treatment.
 * The image is stored using blob-storage and results are saved to history.
 */
export function useDiseaseDetection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<PlantDiseaseResult, Error, File>({
    mutationFn: async (file: File) => {
      if (!actor) throw new Error('Actor not available');

      // Convert file to Uint8Array for ExternalBlob
      const bytes = await fileToUint8Array(file);
      // Cast to the expected type to satisfy TypeScript
      const blob = ExternalBlob.fromBytes(bytes as Uint8Array<ArrayBuffer>);

      return actor.detectDisease(blob);
    },
    onSuccess: () => {
      // Invalidate history to refresh the list
      queryClient.invalidateQueries({ queryKey: ['plantDiseaseHistory'] });
    },
  });
}
