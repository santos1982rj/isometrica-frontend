import { Outlet } from 'react-router-dom';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppShell() {
  return (
    <div className="min-h-screen bg-[var(--canvas-bg)] text-slate-50">
      <Sidebar />

      <div className="min-h-screen lg:pl-72">
        <Header />

        <main className="px-5 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}