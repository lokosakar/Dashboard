'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from 'antd';
// Gw tambahin import InboxOutlined & ShoppingCartOutlined di sini
import { DashboardOutlined, BookOutlined, RobotOutlined, InboxOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import gsap from 'gsap';

export default function AppSidebar() {
  const sidebarRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    gsap.fromTo(
      sidebarRef.current,
      { x: -250, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/notes', icon: <BookOutlined />, label: 'My Notes' },
    { key: '/chat', icon: <RobotOutlined />, label: 'AI Assistant' },
    
    // --- INI MENU FINANCE YANG LU TUNGGU-TUNGGU ---
    { key: '/finance/products', icon: <InboxOutlined />, label: '📦 Inventory' },
    { key: '/finance/orders', icon: <ShoppingCartOutlined />, label: '🛒 Sales & Orders' },
  ];

  return (
    <aside 
      ref={sidebarRef} 
      style={{ width: 250, background: '#1a1a1a', height: '100vh', borderRight: '1px solid #333' }}
    >
      <div style={{ padding: '24px', textAlign: 'center', borderBottom: '1px solid #333' }}>
        <h2 style={{ color: '#722ed1', margin: 0 }}>🧠 Brain.AI</h2>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        onClick={({ key }) => router.push(key)}
        items={menuItems}
        style={{ background: 'transparent', marginTop: '16px', borderRight: 'none' }}
      />
    </aside>
  );
}