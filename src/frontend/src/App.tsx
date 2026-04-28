import { useActor } from "@caffeineai/core-infrastructure";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { createActor } from "./backend";
import { AdminGuard } from "./components/AdminGuard";
import { BackToTop } from "./components/BackToTop";
import { CustomCursor } from "./components/CustomCursor";
import { Layout } from "./components/Layout";
import { LoadingScreen } from "./components/LoadingScreen";
import { MaintenanceBanner } from "./components/MaintenanceBanner";
import { PushNotificationDisplay } from "./components/PushNotificationDisplay";
import { ScrollProgress } from "./components/ScrollProgress";
import { AiSessionProvider } from "./contexts/AiSessionContext";
import {
  AdminSessionProvider,
  SessionProvider,
} from "./contexts/SessionContext";
import { SignalAccuracyProvider } from "./contexts/SignalAccuracyContext";

const Home = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.Home })),
);
const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard").then((m) => ({ default: m.AdminDashboard })),
);
const NotFound = lazy(() =>
  import("./pages/NotFound").then((m) => ({ default: m.NotFound })),
);
const AiChat = lazy(() =>
  import("./pages/AiChat").then((m) => ({ default: m.AiChat })),
);

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center animate-pulse-glow shadow-elevated">
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

// ─── Maintenance check (needs useActor hook context) ─────────────────────
function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const { actor, isFetching } = useActor(createActor);
  const [maintenanceMode, setMaintenanceMode] = useState<{
    enabled: boolean;
    message: string;
  } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .getMaintenanceMode()
      .then((mode) => {
        if (mode.enabled) {
          setMaintenanceMode({ enabled: mode.enabled, message: mode.message });
        }
        setChecked(true);
      })
      .catch(() => {
        setChecked(true);
      });
  }, [actor, isFetching]);

  if (checked && maintenanceMode?.enabled) {
    return <MaintenanceBanner message={maintenanceMode.message} />;
  }

  return <>{children}</>;
}

// ─── App Shell with global overlays ────────────────────────────────────────
function AppShell({ children }: { children: React.ReactNode }) {
  const [showLoading, setShowLoading] = useState(() => {
    try {
      return !sessionStorage.getItem("dz-loaded");
    } catch {
      return true;
    }
  });

  function handleLoadingDone() {
    try {
      sessionStorage.setItem("dz-loaded", "1");
    } catch {
      // ignore
    }
    setShowLoading(false);
  }

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingDone} />;
  }

  return (
    <MaintenanceCheck>
      <ScrollProgress />
      {children}
      <BackToTop />
      <PushNotificationDisplay />
      <CustomCursor />
    </MaintenanceCheck>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <SessionProvider>
      <AdminSessionProvider>
        <AiSessionProvider>
          <SignalAccuracyProvider>
            <AppShell>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </AppShell>
          </SignalAccuracyProvider>
        </AiSessionProvider>
      </AdminSessionProvider>
    </SessionProvider>
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

const notFoundRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/404",
  component: NotFound,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  ),
});

const aiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai",
  component: AiChat,
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
  layoutRoute.addChildren([indexRoute, notFoundRoute]),
  adminRoute,
  aiRoute,
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
