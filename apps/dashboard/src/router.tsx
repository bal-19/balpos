import { Outlet, createRootRoute, createRoute, createRouter } from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
      <Outlet />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <div className="text-center">
      <h1 className="text-2xl font-semibold">Restaurant POS & CRM</h1>
      <p className="mt-2 text-slate-400">Dashboard — Phase 1 belum dimulai.</p>
    </div>
  ),
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
