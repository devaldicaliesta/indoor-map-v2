import type { VenueId } from '@indoor/domain';
import { useQuery } from '@tanstack/react-query';
import { loadSnapshot } from './client';

export function useSnapshot(venueId: VenueId) {
  return useQuery({
    queryKey: ['snapshot', venueId],
    queryFn: () => loadSnapshot(venueId),
    staleTime: Number.POSITIVE_INFINITY,
  });
}
