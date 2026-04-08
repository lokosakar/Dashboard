'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu, Drawer, Grid } from 'antd';
import { DashboardOutlined, BookOutlined, RobotOutlined, InboxOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Sider } = Layout;
const { useBreakpoint } = Grid;

export default function AppSidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const screens = useBreakpoint();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Otomatis nutup menu di HP kalau kita pindah halaman
  useEffect(() => { setMobileMenuOpen(false); }, [pathname, setMobileMenuOpen]);

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined style={{ fontSize: '18px' }} />, label: 'Command Center' },
    { type: 'divider', style: { borderColor: '#222', margin: '16px 24px' } },
    { key: 'grp1', type: 'group', label: <span style={{ color: '#555', fontSize: '11px', letterSpacing: '1px' }}>CORE ENGINE</span>, children: [
      { key: '/notes', icon: <BookOutlined style={{ fontSize: '18px' }} />, label: 'Second Brain' },
      { key: '/chat', icon: <RobotOutlined style={{ fontSize: '18px' }} />, label: 'AI Assistant' },
    ]},
    { type: 'divider', style: { borderColor: '#222', margin: '16px 24px' } },
    { key: 'grp2', type: 'group', label: <span style={{ color: '#6d28d9', fontSize: '11px', letterSpacing: '1px', textShadow: '0 0 10px rgba(139,92,246,0.5)' }}>FINANCE ERP</span>, children: [
      { key: '/finance/products', icon: <InboxOutlined style={{ fontSize: '18px' }} />, label: 'Inventory' },
      { key: '/finance/orders', icon: <ShoppingCartOutlined style={{ fontSize: '18px' }} />, label: 'Sales & Orders' },
    ]},
  ];

  // Kita bungkus isinya biar gak ngetik 2 kali
  const SidebarContent = () => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#050505' }}>
      <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: 10, boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}></div>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>LN CORE</h2>
          <span style={{ color: '#8b5cf6', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '2px' }}>SYSTEM.V2</span>
        </div>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        onClick={({ key }) => router.push(key)}
        items={menuItems}
        style={{ background: 'transparent', borderRight: 'none', padding: '0 12px', flex: 1 }}
      />
    </div>
  );

  if (!mounted) return null;

  // KALAU DI HP: Pake Drawer (Menu Melayang)
  if (screens.md === false) {
    return (
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        styles={{ body: { padding: 0, background: '#050505' } }}
        width={280}
      >
        <SidebarContent />
      </Drawer>
    );
  }

  // KALAU DI LAPTOP: Pake Sider biasa
  return (
    <Sider 
      width={280} 
      style={{ background: '#050505', borderRight: '1px solid rgba(255,255,255,0.05)', boxShadow: '4px 0 24px rgba(0,0,0,0.5)' }}
    >
      <SidebarContent />
    </Sider>
  );
}