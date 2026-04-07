// src/app/chat/page.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { Typography } from 'antd';
import AISelector from '../components/chat/AISelector';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import axiosInstance from '../lib/axiosInstance';
import { useAuthStore } from '../store/useAuthStore';

const { Title } = Typography;

export default function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const [aiType, setAiType] = useState('smart');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Halo! Ada yang bisa aku bantu dari catatan kamu hari ini?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll ke bawah pas ada pesan baru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text) => {
    // Tambahin pesan user ke UI
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setIsTyping(true);

    try {
      // Tembak API chat kita
      const res = await axiosInstance.post('/chat', {
        userId: user.id,
        message: text,
        aiType: aiType
      });

      // Tambahin balasan AI ke UI
      setMessages((prev) => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Maaf, terjadi kesalahan saat menghubungi server otak kedua kamu.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <Title level={2} style={{ color: '#fff', textAlign: 'center', marginBottom: '8px' }}>Ask Your Second Brain</Title>
      
      {/* Component AI Selector */}
      <AISelector value={aiType} onChange={setAiType} />

      {/* Area Chat */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px', 
        background: '#141414', 
        borderRadius: '12px',
        border: '1px solid #333'
      }}>
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} role={msg.role} text={msg.text} />
        ))}
        {isTyping && (
          <div style={{ color: '#888', fontStyle: 'italic', marginBottom: '16px' }}>AI is thinking...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Chat */}
      <ChatInput onSend={handleSendMessage} loading={isTyping} />
    </div>
  );
}