'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import { useAuthStore } from './store/useAuthStore';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// INI OTAK API LU YANG KEMAREN HILANG:
const queryClient = new QueryClient();

export default function ClientShell({ children }) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="min-h-screen bg-[#050505]"></div>;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    { name: 'Command Center', path: '/', icon: '⎈', category: 'CORE' },
    { name: 'Second Brain', path: '/notes', icon: '🧠', category: 'CORE' },
    { name: 'AI Assistant', path: '/chat', icon: '🤖', category: 'CORE' },
    { name: 'Inventory', path: '/finance/products', icon: '📦', category: 'FINANCE ERP' },
    { name: 'Sales & Orders', path: '/finance/orders', icon: '🛒', category: 'FINANCE ERP' },
  ];

  // =================================================================
  // KITA BUNGKUS SEMUA PAKAI TANSTACK QUERY & ANT DESIGN PROVIDER
  // =================================================================
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#a855f7', // Gw sesuaikan ungunya sama tema Tailwind
            colorBgBase: '#050505',
            colorBgContainer: '#1e1e1e',
            fontFamily: 'var(--font-inter), sans-serif',
          },
        }}
      >
        {/* LOGIKA TAMPILAN BERDASARKAN LOGIN */}
        {!user ? (
          // KALAU BELUM LOGIN (Tampilan Full Layar)
          <main className="w-full h-full relative z-10">{children}</main>
        ) : (
          // KALAU SUDAH LOGIN (Muncul Sidebar Finance + Core)
          <div className="flex min-h-screen w-full relative z-10">
            
            {/* SIDEBAR SADIS */}
            <aside className="w-72 fixed top-0 left-0 h-full border-r border-white/[0.05] bg-black/40 backdrop-blur-2xl shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-50 flex flex-col transition-all duration-500">
              <div className="p-8 border-b border-white/[0.05]">
                <h1 className="text-3xl font-black tracking-tighter font-space bg-gradient-to-br from-white via-purple-300 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  LN CORE <span className="text-xs text-purple-400 font-mono align-top ml-1 drop-shadow-none">v2.0</span>
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
                  <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">System Online</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-8 px-4 space-y-8 no-scrollbar">
                <div>
                  <div className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4 font-space">Core Engine</div>
                  <nav className="space-y-2">
                    {menuItems.filter(m => m.category === 'CORE').map(menu => {
                      const isActive = pathname === menu.path;
                      return (
                        <Link key={menu.path} href={menu.path} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group ${isActive ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-purple-500 rounded-r-full shadow-[0_0_12px_rgba(168,85,247,1)]"></div>}
                          <span className={`text-xl group-hover:scale-110 transition-transform ${isActive ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]' : ''}`}>{menu.icon}</span>
                          <span className="font-medium text-sm tracking-wide">{menu.name}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div>
                  <div className="px-4 text-[10px] font-bold text-purple-900/80 uppercase tracking-widest mb-4 font-space drop-shadow-[0_0_5px_rgba(168,85,247,0.3)]">Finance Module</div>
                  <nav className="space-y-2">
                    {menuItems.filter(m => m.category === 'FINANCE ERP').map(menu => {
                      const isActive = pathname === menu.path;
                      return (
                        <Link key={menu.path} href={menu.path} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group ${isActive ? 'bg-purple-500/10 text-purple-200 border border-purple-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' : 'text-gray-500 hover:text-purple-300 hover:bg-purple-500/5'}`}>
                          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-purple-500 rounded-r-full shadow-[0_0_12px_rgba(168,85,247,1)]"></div>}
                          <span className={`text-xl group-hover:scale-110 transition-transform ${isActive ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''}`}>{menu.icon}</span>
                          <span className="font-medium text-sm tracking-wide">{menu.name}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>

              <div className="p-6 border-t border-white/[0.05] bg-gradient-to-t from-black/60 to-transparent">
                <div onClick={handleLogout} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-red-500/20">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-red-600 flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all">
                    {user.email.substring(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate text-gray-200 group-hover:text-white transition-colors">{user.email}</p>
                    <p className="text-[10px] text-red-500/70 font-mono mt-1 group-hover:text-red-400 transition-colors tracking-widest">⚠️ DISCONNECT</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <main className="flex-1 ml-72 relative">
              <div className="min-h-screen w-full p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                {children}
              </div>
            </main>
            
          </div>
        )}
      </ConfigProvider>
    </QueryClientProvider>
  );
}