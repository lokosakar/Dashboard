'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '.././store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Card, Input, Button, Typography, message, Avatar } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ChatPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const messagesEndRef = useRef(null);

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Halo Boss! Gw udah konek ke database lu. Mau nanya soal stok barang, atau ada ide yang mau didiskusiin hari ini?' }
  ]);

  useEffect(() => {
    if (!user) router.push('/');
  }, [user]);

  // Biar auto-scroll ke bawah kalau ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    // Masukin pesan user ke layar
    const newMessages = [...messages, { role: 'user', text: prompt }];
    setMessages(newMessages);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userId: user.id })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setMessages([...newMessages, { role: 'ai', text: data.text }]);
      } else {
        message.error(data.message || 'Gagal konek ke AI nih bos.');
      }
    } catch (error) {
      message.error('Waduh, servernya ngambek. Coba lagi bentar.');
    }
    
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Title level={2} style={{ color: '#fff', marginBottom: '24px' }}>
        <RobotOutlined style={{ marginRight: '10px', color: '#8b5cf6' }} /> 
        AI Assistant
      </Title>

      {/* KOTAK CHAT */}
      <Card 
        bordered={false} 
        style={{ background: '#1a1a1a', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        
        {/* AREA PESAN (SCROLLABLE) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '12px' }}>
              <Avatar 
                size={40} 
                icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} 
                style={{ backgroundColor: msg.role === 'user' ? '#333' : '#8b5cf6' }}
              />
              <div style={{ 
                maxWidth: '75%', 
                padding: '12px 16px', 
                borderRadius: '12px', 
                background: msg.role === 'user' ? '#222' : 'rgba(139, 92, 246, 0.1)',
                border: msg.role === 'user' ? '1px solid #333' : '1px solid rgba(139, 92, 246, 0.3)',
                color: '#e5e7eb',
                lineHeight: '1.6'
              }}>
                {/* Render teks biasa (nanti lu bisa pasang react-markdown di sini kalau mau tebel/miringnya jalan) */}
                <span style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* AREA INPUT (BAWAH) */}
        <div style={{ padding: '16px 24px', background: '#0a0a0a', borderTop: '1px solid #333' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Input.TextArea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tanya stok barang, minta bikinin konten jualan, atau nanya ide..." 
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{ background: '#111', color: '#fff', borderColor: '#333', fontSize: '15px' }}
              onPressEnter={(e) => {
                if (!e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
            />
            <Button 
              type="primary" 
              onClick={handleSend} 
              loading={loading}
              icon={<SendOutlined />}
              style={{ background: '#8b5cf6', borderColor: '#8b5cf6', height: 'auto', px: 24 }}
            />
          </div>
          <Text style={{ color: '#555', fontSize: '12px', display: 'block', marginTop: '8px', textAlign: 'center' }}>
            Shift + Enter untuk baris baru. AI bisa mengakses data Inventory lu.
          </Text>
        </div>

      </Card>
    </div>
  );
}