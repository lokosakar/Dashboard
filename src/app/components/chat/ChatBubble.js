'use client';

export default function ChatBubble({ role, text }) {
  const isUser = role === 'user';

  return (
    <div className={`chat-bubble-container ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
      <div className={`chat-bubble ${isUser ? 'bg-user' : 'bg-ai'}`}>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
      </div>
    </div>
  );
}