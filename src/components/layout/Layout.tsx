import React from 'react';
import { ResponsiveNav } from './ResponsiveNav';
import { useNavigation } from '../../contexts/NavigationContext';
import { Logo } from '../common/Logo';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentRoute } = useNavigation();
  const showNav = ['home', 'groups', 'profile', 'payment'].includes(currentRoute);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col xl:flex-row xl:justify-center">
      {/* Desktop Sidebar */}
      {showNav && (
        <div className="hidden xl:flex w-64 flex-col border-r border-slate-200 bg-white h-screen sticky top-0">
          <div className="p-6 pb-2">
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <h1 className="font-bold text-xl tracking-tight text-[#0052FF]">AjoSmart</h1>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-2 uppercase tracking-wider pl-[40px]">Dashboard</p>
          </div>
          <ResponsiveNav isDesktop={true} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1200px] xl:max-w-[800px] 2xl:max-w-[1000px] mx-auto pb-24 xl:pb-0 min-h-screen bg-[#F8FAFC]">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      {showNav && (
        <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
          <ResponsiveNav isDesktop={false} />
        </div>
      )}
    </div>
  );
}
