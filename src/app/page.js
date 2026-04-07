'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function AuthPage() {
  const { user, login } = useAuthStore();
  const router = useRouter();
  
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Kalau dia udah punya sesi login, tendang langsung ke dalam Dashboard!
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!mounted) return null;

  // Fungsi buat nembak API Login / Register yang udah lu bikin kemaren
  const onFinish = async (values) => {
    setLoading(true);
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await res.json();

      if (res.ok) {
        message.success(data.message || 'Welcome Boss!');
        login(data.user); // Simpan status login di Zustand
        router.push('/dashboard'); // Pindah ke halaman yang ada Sidebarnya
      } else {
        message.error(data.message || 'Gagal bro!');
      }
    } catch (err) {
      message.error('Server error bro!');
    }
    setLoading(false);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f' }}>
      <Card style={{ width: 400, background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: '#722ed1', margin: 0 }}>🧠 Brain.AI</Title>
          <Text style={{ color: '#aaa' }}>{isRegister ? 'Bikin akun baru dulu bos' : 'Login dulu bosku'}</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, message: 'Isi email lu!' }]}>
            <Input size="large" prefix={<MailOutlined />} placeholder="Email Address" style={{ background: '#222', color: '#fff', borderColor: '#444' }} />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Isi password lu!' }]}>
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Password" style={{ background: '#222', color: '#fff', borderColor: '#444' }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" block loading={loading} style={{ background: '#722ed1', borderColor: '#722ed1', fontWeight: 'bold' }}>
            {isRegister ? 'Daftar Sekarang' : 'Masuk System'}
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text style={{ color: '#aaa' }}>
            {isRegister ? 'Udah punya akun? ' : 'Belum punya akun? '}
            <a onClick={() => setIsRegister(!isRegister)} style={{ color: '#722ed1', fontWeight: 'bold', cursor: 'pointer' }}>
              {isRegister ? 'Login di sini' : 'Daftar di sini'}
            </a>
          </Text>
        </div>

      </Card>
    </div>
  );
}