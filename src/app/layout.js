// src/app/layout.js
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme, Layout } from 'antd';
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
      <body style={{ margin: 0, padding: 0, backgroundColor: '#000' }}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              token: {
                colorPrimary: '#8b5cf6', // Ungu modern ala SaaS
                colorBgBase: '#000000',
                colorBgContainer: '#121212',
                colorBgElevated: '#1e1e1e',
                fontFamily: 'Inter, sans-serif',
                borderRadius: 8,
              },
              components: {
                Menu: {
                  itemBg: 'transparent',
                  itemSelectedBg: 'rgba(139, 92, 246, 0.15)',
                  itemSelectedColor: '#c4b5fd',
                  itemHoverBg: 'rgba(255, 255, 255, 0.05)',
                }
              }
            }}
          >
            {isLoginPage ? (
              children
            ) : (
              <Layout style={{ minHeight: '100vh', background: '#000' }}>
                <AppSidebar />
                <Layout style={{ background: '#0a0a0a' }}>
                  <AppHeader />
                  <Layout.Content style={{ 
                    padding: '32px', 
                    margin: 0, 
                    overflowY: 'auto',
                    height: 'calc(100vh - 64px)'
                  }}>
                    {children}
                  </Layout.Content>
                </Layout>
              </Layout>
            )}
          </ConfigProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}