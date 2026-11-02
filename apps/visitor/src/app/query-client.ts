import { QueryClient } from '@tanstack/react-query';
import { VenueNotFoundError } from '../data/client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => !(error instanceof VenueNotFoundError) && failureCount < 2,
    },
  },
});
