// src/app/[locale]/(admin)/settings/layout.tsx
import React from 'react';
import DashboardNav from '@/components/navigation/navbar';
import type { SidebarNavItem } from '@/types/nav-types';
import UpdgradeAccBtn from '@/components/navigation/updgradeAccBtn';

// (optional) include your upgrade widget if you want it on Settings too
// import UpdgradeAccBtn from '@/components/navigation/updgradeAccBtn';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const sidebarNav: SidebarNavItem[] = [
      { title: 'My Forms',  href: '/view-forms', icon: 'library' },
      { title: 'Results',   href: '/results',    icon: 'list' },
      { title: 'Analytics', href: '/analytics',  icon: 'lineChart' },
      { title: 'Charts',    href: '/charts',     icon: 'pieChart' },
      { title: 'Settings',  href: '/settings',   icon: 'settings' },
    ];
  

  return (
    <div className="container mx-auto grid gap-12 md:grid-cols-[200px_1fr] flex-1 px-4 py-6">
      <aside className="hidden w-[200px] md:flex flex-col justify-start pr-2 border-r bg-white">
        <DashboardNav items={sidebarNav} variant="light" />
       <UpdgradeAccBtn />
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
