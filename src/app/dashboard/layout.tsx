import React from "react";
import { Sidebar } from "@/presentation/components/layout/Sidebar";
import { Topbar } from "@/presentation/components/layout/Topbar";
import { RouteGuard } from "@/infrastructure/guards/RouteGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Topbar />
          <main
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "32px 40px",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
