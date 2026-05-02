import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { Suspense, lazy } from "react";
import { BackToTop } from "./components/BackToTop";
import { Layout } from "./components/Layout";
import { ScrollProgress } from "./components/ScrollProgress";
import { SessionProvider } from "./contexts/SessionContext";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const Home = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.Home })),
);
const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard").then((m) => ({ default: m.AdminDashboard })),
);
const CertificateWall = lazy(() =>
  import("./pages/CertificateWall").then((m) => ({
    default: m.CertificateWall,
  })),
);
const VerifyCertificate = lazy(() =>
  import("./pages/VerifyCertificate").then((m) => ({
    default: m.VerifyCertificate,
  })),
);
const NotFound = lazy(() =>
  import("./pages/NotFound").then((m) => ({ default: m.NotFound })),
);

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-elevated">
          <Zap className="w-8 h-8 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-display font-bold text-2xl text-foreground text-glow">
            DemonZeno
          </span>
          <span className="text-muted-foreground text-sm font-mono">
            Loading…
          </span>
        </div>
      </div>
    </div>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      {children}
      <BackToTop />
    </>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AppShell>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </AppShell>
      </SessionProvider>
    </QueryClientProvider>
  ),
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: Home,
});

const certificatesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/certificates",
  component: CertificateWall,
});

const verifyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/verify/$certId",
  component: VerifyCertificate,
});

const notFoundRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/404",
  component: NotFound,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$",
  beforeLoad: () => {
    throw redirect({ to: "/404" });
  },
  component: () => null,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    indexRoute,
    certificatesRoute,
    verifyRoute,
    notFoundRoute,
  ]),
  adminRoute,
  catchAllRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
