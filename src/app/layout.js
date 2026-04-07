// src/app/layout.js
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import { usePathname } from 'next/navigation';
import AppSidebar from './components/layout/AppSidebar';
import AppHeader from './components/layout/AppHeader';

import './globals.css';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/';

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              token: {
                colorPrimary: '#722ed1',
                colorBgBase: '#0f0f0f',
                colorBgContainer: '#1a1a1a',
                fontFamily: 'Inter, sans-serif',
              },
            }}
          >
            {isLoginPage ? (
              // Kalau di halaman login, tampilkan polos tanpa sidebar
              children
            ) : (
              // Kalau di dalam app, tampilkan layout dashboard
              <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                <AppSidebar />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <AppHeader />
                  <main style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: '#0f0f0f' }}>
                    {children}
                  </main>
                </div>
              </div>
            )}
          </ConfigProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}