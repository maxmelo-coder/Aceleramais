'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { currentUser } from '@/lib/mock-data';

export default function ElevaLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/login') { setChecked(true); return; }
    const stored = localStorage.getItem('eleva_user');
    if (!stored) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  if (pathname === '/login') return <>{children}</>;
  if (!checked) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#F48B1B] flex items-center justify-center text-white font-black text-xl">E+</div>
        <p className="text-sm text-gray-400">Carregando...</p>
      </div>
    </div>
  );

  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('eleva_user') : null;
  const loggedUser = storedUser ? JSON.parse(storedUser) : currentUser;

  return (
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
  );
}
