import { createBrowserRouter, type RouteObject } from 'react-router';
import { HomePage } from './routes/home-page';
import { NotFoundPage, RouteError } from './routes/route-error';

// Pratinjau peta dengan fixture hanya ada saat pengembangan.
const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: '/_map',
        lazy: async () => ({ Component: (await import('./dev/map-preview-page')).MapPreviewPage }),
      },
    ]
  : [];

export const router = createBrowserRouter([
  {
    errorElement: <RouteError />,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: '/v/:venue',
        lazy: async () => ({ Component: (await import('./routes/venue-page')).VenuePage }),
      },
      ...devRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
