import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { Suspense, lazy } from "react";
import { BackToTop } from "./components/BackToTop";
import { Layout } from "./components/Layout";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const Home = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.Home })),
);
const NotFound = lazy(() =>
  import("./pages/NotFound").then((m) => ({ default: m.NotFound })),
);
const Transparency = lazy(() =>
  import("./pages/Transparency").then((m) => ({ default: m.Transparency })),
);
const OfficialLinks = lazy(() =>
  import("./pages/OfficialLinks").then((m) => ({ default: m.OfficialLinks })),
);
const CommunityGuidelines = lazy(() =>
  import("./pages/CommunityGuidelines").then((m) => ({
    default: m.CommunityGuidelines,
  })),
);
const LaunchAnnouncement = lazy(() =>
  import("./pages/LaunchAnnouncement").then((m) => ({
    default: m.LaunchAnnouncement,
  })),
);
const PostLaunchPlan = lazy(() =>
  import("./pages/PostLaunchPlan").then((m) => ({ default: m.PostLaunchPlan })),
);
const LegalDisclaimer = lazy(() =>
  import("./pages/LegalDisclaimer").then((m) => ({
    default: m.LegalDisclaimer,
  })),
);
const WhyDemonZeno = lazy(() =>
  import("./pages/WhyDemonZeno").then((m) => ({ default: m.WhyDemonZeno })),
);
const Changelog = lazy(() =>
  import("./pages/Changelog").then((m) => ({ default: m.Changelog })),
);
const RiskDisclosure = lazy(() =>
  import("./pages/RiskDisclosure").then((m) => ({
    default: m.RiskDisclosure,
  })),
);
const LessonsFromFailures = lazy(() =>
  import("./pages/LessonsFromFailures").then((m) => ({
    default: m.LessonsFromFailures,
  })),
);

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-16 h-16 bg-primary flex items-center justify-center"
          style={{ borderRadius: "2px" }}
        >
          <Zap className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span
            className="font-display font-black text-2xl"
            style={{ color: "var(--foreground)" }}
          >
            DEMON<span style={{ color: "var(--primary)" }}>ZENO</span>
          </span>
          <span
            className="text-sm font-mono"
            style={{ color: "var(--muted-foreground)" }}
          >
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
      {children}
      <BackToTop />
    </>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <AppShell>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </AppShell>
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

const notFoundRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/404",
  component: NotFound,
});

const transparencyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/transparency",
  component: Transparency,
});
const officialLinksRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/official-links",
  component: OfficialLinks,
});
const communityGuidelinesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/community-guidelines",
  component: CommunityGuidelines,
});
const launchRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/launch",
  component: LaunchAnnouncement,
});
const postLaunchRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/post-launch",
  component: PostLaunchPlan,
});
const burnEventRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/burn-event-preview",
  component: PostLaunchPlan,
});
const legalRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/legal",
  component: LegalDisclaimer,
});
const notAScamRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/not-a-scam",
  component: Transparency,
});
const whyDemonZenoRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/why-demonzeno",
  component: WhyDemonZeno,
});
const changelogRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/changelog",
  component: Changelog,
});
const riskRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/risk-disclosure",
  component: RiskDisclosure,
});
const lessonsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/lessons-from-failures",
  component: LessonsFromFailures,
});

const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$",
  beforeLoad: () => {
    window.location.replace("/");
  },
  component: () => null,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    indexRoute,
    notFoundRoute,
    transparencyRoute,
    officialLinksRoute,
    communityGuidelinesRoute,
    launchRoute,
    postLaunchRoute,
    burnEventRoute,
    legalRoute,
    notAScamRoute,
    whyDemonZenoRoute,
    changelogRoute,
    riskRoute,
    lessonsRoute,
  ]),
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
