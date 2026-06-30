import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SUGGESTIONS = [
  'What crop should I grow in rainy season?',
  'How to control aphids naturally?',
  'Best fertilizer for wheat crop?',
  'How to improve soil fertility?',
  'When to harvest rice?',
];

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `Namaste ${user?.username?.split(' ')[0]}! 🌾 I'm AgriBot, your AI farming assistant powered by Google Gemini. I can help you with crop advice, pest control, weather-based farming, government schemes, and more. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(scrollToBottom, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const { data } = await sendChatMessage(msg);
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: '⚠️ Sorry, I\'m having trouble connecting. Please try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>🤖 AgriBot AI Chat</h1>
        <p>Ask anything about farming — powered by Google Gemini AI</p>
      </div>

      {/* Quick Suggestions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="btn-glass btn"
            style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
            onClick={() => sendMessage(s)}
            disabled={loading}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-avatar">🤖</div>
          <div className="chat-header-info">
            <h3>AgriBot</h3>
            <p>● Online — Powered by Gemini AI</p>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              <div className={`msg-avatar ${msg.role === 'bot' ? 'bot' : 'user-avatar'}`}>
                {msg.role === 'bot' ? '🤖' : user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className={`msg-bubble ${msg.role}`} style={{ whiteSpace: 'pre-wrap' }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-message">
              <div className="msg-avatar bot">🤖</div>
              <div className="msg-bubble bot">
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <textarea
            className="chat-input"
            placeholder="Ask AgriBot about farming, crops, pests..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="chat-send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            title="Send message"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
