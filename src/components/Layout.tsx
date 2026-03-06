import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Calendar, Target, BarChart2, Settings, Menu, X, Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Tarefas', href: '/tasks', icon: CheckSquare },
    { name: 'Hábitos', href: '/habitos', icon: Calendar },
    { name: 'Metas', href: '/metas', icon: Target },
    { name: 'KPIs', href: '/kpis', icon: Activity },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bg-main text-text-main flex font-sans selection:bg-accent-blue/30">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 w-72 bg-bg-sec border-r border-border-subtle transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl lg:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-border-subtle bg-bg-sec">
          <span className="text-2xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent tracking-tight">O Arquiteto</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-text-sec hover:text-text-main transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={clsx(
                  isActive 
                    ? 'bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 text-white border border-accent-blue/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]' 
                    : 'text-text-sec hover:bg-bg-card hover:text-white border border-transparent',
                  'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300'
                )}
              >
                <item.icon className={clsx(
                  isActive ? 'text-accent-blue' : 'text-text-sec group-hover:text-white',
                  'mr-4 flex-shrink-0 h-5 w-5 transition-colors'
                )} aria-hidden="true" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-bg-main relative">
        {/* Top gradient blur effect for modern feel */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-accent-blue/5 to-transparent pointer-events-none -z-10"></div>
        
        <div className="lg:hidden flex items-center justify-between px-4 py-4 bg-bg-sec/80 backdrop-blur-md border-b border-border-subtle sticky top-0 z-30">
          <span className="text-xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">O Arquiteto</span>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg text-text-sec hover:text-white hover:bg-bg-card transition-colors"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu size={24} />
          </button>
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

