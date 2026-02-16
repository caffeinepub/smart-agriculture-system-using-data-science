import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';
import CropYieldPage from './pages/CropYieldPage';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';
import IrrigationPage from './pages/IrrigationPage';
import VisualizationsPage from './pages/VisualizationsPage';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const cropYieldRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/crop-yield',
  component: CropYieldPage,
});

const diseaseDetectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/disease-detection',
  component: DiseaseDetectionPage,
});

const irrigationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/irrigation',
  component: IrrigationPage,
});

const visualizationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/visualizations',
  component: VisualizationsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  cropYieldRoute,
  diseaseDetectionRoute,
  irrigationRoute,
  visualizationsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
