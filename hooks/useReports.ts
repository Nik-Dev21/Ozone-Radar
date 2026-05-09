import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getReports, saveReport } from '../services/cloudant';
import type { CitizenReport } from '../services/types';

const REPORTS_KEY = ['reports'] as const;

/**
 * Fetch citizen reports from Cloudant.
 */
export function useReports() {
  return useQuery<CitizenReport[]>({
    queryKey: REPORTS_KEY,
    queryFn: getReports,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Mutation to save a new citizen report with optimistic update.
 * The report appears in the list instantly; rolls back on failure.
 */
export function useSaveReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveReport,

    onMutate: async (newReport) => {
      await queryClient.cancelQueries({ queryKey: REPORTS_KEY });

      const previous = queryClient.getQueryData<CitizenReport[]>(REPORTS_KEY);

      // Optimistic: insert at the top of the list
      const optimistic: CitizenReport = {
        ...newReport,
        _id: 'optimistic-temp',
        type: 'report',
      };

      queryClient.setQueryData<CitizenReport[]>(REPORTS_KEY, (old) =>
        [optimistic, ...(old ?? [])],
      );

      return { previous };
    },

    onError: (_err, _newReport, context) => {
      // Roll back to the previous list
      if (context?.previous) {
        queryClient.setQueryData(REPORTS_KEY, context.previous);
      }
    },

    onSettled: () => {
      // Refetch to get the real _id and _rev from Cloudant
      queryClient.invalidateQueries({ queryKey: REPORTS_KEY });
    },
  });
}
