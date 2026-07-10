import { Outlet } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AuthenticatedLayout() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-screen overflow-hidden bg-surface">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
