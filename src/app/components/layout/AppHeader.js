'use client';

import { Layout, Dropdown, Avatar, Button, Grid } from 'antd';
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';

const { Header } = Layout;
const { useBreakpoint } = Grid;

export default function AppHeader({ setMobileMenuOpen }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  
  // Ini fungsi ajaib Ant Design buat deteksi HP/Laptop
  const screens = useBreakpoint();
  const isMobile = screens.md === false; 

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const items = [
    { key: '1', label: <span style={{ fontWeight: 'bold' }}>{user?.email}</span>, disabled: true },
    { type: 'divider' },
    { key: '2', danger: true, icon: <LogoutOutlined />, label: 'Disconnect System', onClick: handleLogout },
  ];

  return (
    <Header 
      style={{ 
        padding: isMobile ? '0 16px' : '0 32px', // Kalau HP paddingnya kecilin
        background: 'rgba(10, 10, 10, 0.7)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* TOMBOL MUNCUL KALAU DI HP */}
        {isMobile && (
          <Button 
            type="text" 
            icon={<MenuOutlined style={{ color: '#fff', fontSize: '20px' }} />} 
            onClick={() => setMobileMenuOpen(true)}
            style={{ padding: 0 }}
          />
        )}
        
        {/* TULISAN MUNCUL KALAU DI LAPTOP */}
        {!isMobile && (
          <div style={{ color: '#aaa', fontSize: '14px' }}>
            Status: <span style={{ color: '#4ade80' }}>● All Systems Operational</span>
          </div>
        )}
      </div>

      <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 12px', borderRadius: '50px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Di HP nama emailnya disembunyiin biar gak menuh-menuhin layar */}
          {!isMobile && <span style={{ color: '#fff', fontSize: '14px' }}>{user?.email?.split('@')[0]}</span>}
          <Avatar size="small" style={{ backgroundColor: '#8b5cf6' }} icon={<UserOutlined />} />
        </div>
      </Dropdown>
    </Header>
  );
}