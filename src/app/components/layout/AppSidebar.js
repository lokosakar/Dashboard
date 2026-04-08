// src/app/components/layout/AppSidebar.js
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, BookOutlined, RobotOutlined, InboxOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Sider } = Layout;

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined style={{ fontSize: '18px' }} />, label: 'Command Center' },
    { type: 'divider', style: { borderColor: '#222', margin: '16px 24px' } }, // Garis pemisah
    
    // Core Engine
    { key: 'grp1', type: 'group', label: <span style={{ color: '#555', fontSize: '11px', letterSpacing: '1px' }}>CORE ENGINE</span>, children: [
      { key: '/notes', icon: <BookOutlined style={{ fontSize: '18px' }} />, label: 'Second Brain' },
      { key: '/chat', icon: <RobotOutlined style={{ fontSize: '18px' }} />, label: 'AI Assistant' },
    ]},

    { type: 'divider', style: { borderColor: '#222', margin: '16px 24px' } },

    // Finance ERP
    { key: 'grp2', type: 'group', label: <span style={{ color: '#6d28d9', fontSize: '11px', letterSpacing: '1px', textShadow: '0 0 10px rgba(139,92,246,0.5)' }}>FINANCE ERP</span>, children: [
      { key: '/finance/products', icon: <InboxOutlined style={{ fontSize: '18px' }} />, label: 'Inventory' },
      { key: '/finance/orders', icon: <ShoppingCartOutlined style={{ fontSize: '18px' }} />, label: 'Sales & Orders' },
    ]},
  ];

  return (
    <Sider 
      width={280} 
      style={{ 
        background: '#050505', 
        borderRight: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.5)'
      }}
    >
      {/* BAGIAN LOGO PREMIUM */}
      <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          width: 36, 
          height: 36, 
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', 
          borderRadius: 10,
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
        }}></div>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
            LIONEL DASHBOARD
          </h2>
          <span style={{ color: '#8b5cf6', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '2px' }}>SYSTEM.V2</span>
        </div>
      </div>

      {/* MENU ANT DESIGN (Custom Style) */}
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        onClick={({ key }) => router.push(key)}
        items={menuItems}
        style={{ 
          background: 'transparent', 
          borderRight: 'none',
          padding: '0 12px'
        }}
      />
    </Sider>
  );
}