import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--text)]">
      <div className="flex min-h-screen">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onToggleCollapsed={() =>
            setIsSidebarCollapsed((current) => !current)
          }
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() =>
              setIsSidebarCollapsed((current) => !current)
            }
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />

          <main className="flex-1 px-3 py-4 sm:px-6 sm:py-5 lg:px-7">
            <div className="w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
