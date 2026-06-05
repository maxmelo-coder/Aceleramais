'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { currentUser } from '@/lib/mock-data';
import { MunicipioProvider } from '@/lib/municipio-context';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('eleva_user');
    if (!stored) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  if (!checked) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
      <div className="flex flex-col items-center gap-3">
        <img src="/logo.png" alt="Acelera+" className="h-12 w-auto opacity-60" />
        <p className="text-sm text-gray-400">Carregando...</p>
      </div>
    </div>
  );

  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('eleva_user') : null;
  let loggedUser = currentUser;
  if (storedUser) {
    try { loggedUser = JSON.parse(storedUser); } catch { loggedUser = currentUser; }
  }

  return (
    <MunicipioProvider>
      <div className="flex h-screen overflow-hidden bg-[#F7F8FA]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar
            user={{ ...currentUser, name: loggedUser.name, role: loggedUser.role }}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </MunicipioProvider>
  );
}
