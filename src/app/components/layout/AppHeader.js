'use client';

import { Button } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function AppHeader() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="app-header">
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
        {/* Bisa diisi breadcrumb atau judul halaman nanti */}
      </div>
      <div className="user-profile">
        <UserOutlined style={{ fontSize: '20px' }} />
        <span>{user?.email || 'Guest'}</span>
        <Button 
          type="text" 
          danger 
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}