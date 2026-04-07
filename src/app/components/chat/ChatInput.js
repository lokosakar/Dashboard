'use client';

import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useState } from 'react';

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() === '') return;
    onSend(text);
    setText('');
  };

  return (
    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask your Second Brain..."
        autoSize={{ minRows: 1, maxRows: 4 }}
        onPressEnter={(e) => {
          // Biar pas pencet enter langsung ngirim, shift+enter buat line baru
          if (!e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        style={{ flex: 1, borderRadius: '8px' }}
      />
      <Button 
        type="primary" 
        icon={<SendOutlined />} 
        onClick={handleSend} 
        loading={loading}
        style={{ height: 'auto', background: '#722ed1', borderColor: '#722ed1', borderRadius: '8px' }}
      >
        Send
      </Button>
    </div>
  );
}