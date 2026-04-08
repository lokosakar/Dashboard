// src/app/components/layout/AppHeader.js
'use client';

import { Layout, Dropdown, Space, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';

const { Header } = Layout;

export default function AppHeader() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const items = [
    {
      key: '1',
      label: <span style={{ fontWeight: 'bold' }}>{user?.email}</span>,
      disabled: true,
    },
    { type: 'divider' },
    {
      key: '2',
      danger: true,
      icon: <LogoutOutlined />,
      label: 'Disconnect System',
      onClick: handleLogout,
    },
  ];

  return (
    <Header 
      style={{ 
        padding: '0 32px', 
        background: 'rgba(10, 10, 10, 0.7)', 
        backdropFilter: 'blur(12px)', // Efek kaca / glassmorphism
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}
    >
      <div style={{ color: '#aaa', fontSize: '14px' }}>
        Status: <span style={{ color: '#4ade80' }}>● All Systems Operational</span>
      </div>

      <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 12px', borderRadius: '50px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ color: '#fff', fontSize: '14px' }}>{user?.email?.split('@')[0]}</span>
          <Avatar size="small" style={{ backgroundColor: '#8b5cf6' }} icon={<UserOutlined />} />
        </div>
      </Dropdown>
    </Header>
  );
}