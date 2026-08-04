import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { sendChatMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES } from '../i18n';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const { t, i18n } = useTranslation(['chatbot', 'dashboard', 'common', 'weather', 'crop']);
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'bot',
      text: `${t('dashboard:welcome')} ${user?.username?.split(' ')[0] || t('common:farmer')}! 🌾 ${t('chatbot:subtitle')}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [providerInfo, setProviderInfo] = useState(t('chatbot:onlineStatus'));
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const activeLangConfig = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Update welcome message if language changes and messages list only has welcome message
  useEffect(() => {
    setProviderInfo(t('chatbot:onlineStatus'));
  }, [i18n.language, t]);

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // Speech-to-Text Recognition Setup
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser. Please try Google Chrome or Edge.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = activeLangConfig.speechCode;

      recognition.onstart = () => {
        setIsListening(true);
        toast.success(t('chatbot:listeningPrompt'));
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('[VOICE INPUT] Speech recognized:', transcript);
        setInput(transcript);
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
      };

      recognition.onerror = (event) => {
        console.warn('[VOICE INPUT] Speech recognition error:', event.error);
        setIsListening(false);
        toast.error(`Voice input error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('[VOICE INPUT] Speech recognition setup failed:', err);
      setIsListening(false);
    }
  };

  // Text-to-Speech Read Aloud
  const speakText = (text, msgId) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-Speech is not supported in this browser.');
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Remove markdown symbols for speech reading
    const cleanText = text.replace(/[*#_~`•]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = activeLangConfig.speechCode;

    utterance.onstart = () => setSpeakingMsgId(msgId);
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    window.speechSynthesis.speak(utterance);
  };

  const executeSend = async (textToSend) => {
    const msg = textToSend.trim();
    if (!msg || loading) return;

    console.log(`[AI CHAT] Sending in language (${i18n.language}): "${msg}"`);
    setLoading(true);

    try {
      // Format history (excluding welcome message and errors)
      const history = messages
        .filter(m => m.id !== 'welcome-1' && !m.isError)
        .map(m => ({ role: m.role === 'bot' ? 'model' : 'user', text: m.text }));

      const response = await sendChatMessage(msg, i18n.language, history);
      const data = response.data;

      console.log('[AI CHAT] Server response success:', data);

      if (data.provider) {
        setProviderInfo(`● Online — ${data.provider}`);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: data.reply || 'No response text returned.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('[AI CHAT] Request error:', err);

      let errorMessage = `⚠️ ${t('common:error')}`;
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = `⚠️ ${err.response.data.error}`;
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage = '⚠️ AgriBot is taking longer than usual to respond. Please try again.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'bot',
          text: errorMessage,
          isError: true,
          failedPrompt: msg,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleSendMessage = (overrideText) => {
    const textToSend = overrideText || input;
    if (!textToSend || !textToSend.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: textToSend.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    if (!overrideText) {
      setInput('');
    }

    executeSend(textToSend);
  };

  const handleRetry = (failedPrompt, messageId) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    executeSend(failedPrompt);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestionList = [
    t('chatbot:suggestions') === 'Quick Questions' ? 'What crop should I grow in rainy season?' : t('crop:suitableSeason'),
    t('crop:fertilizerRec'),
    t('weather:farmingAdvice'),
  ];

  return (
    <div>
      <div className="page-header">
        <h1>{t('chatbot:title')}</h1>
        <p>{t('chatbot:subtitle')}</p>
      </div>

      {/* Quick Suggestions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {suggestionList.map((s, idx) => (
          <button
            key={idx}
            className="btn-glass btn"
            style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
            onClick={() => handleSendMessage(s)}
            disabled={loading}
          >
            💡 {s}
          </button>
        ))}
      </div>

      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-avatar">🤖</div>
          <div className="chat-header-info">
            <h3>AgriBot AI ({activeLangConfig.nativeName})</h3>
            <p>{providerInfo}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.role}`}>
              <div className={`msg-avatar ${msg.role === 'bot' ? 'bot' : 'user-avatar'}`}>
                {msg.role === 'bot' ? '🤖' : (user?.username?.charAt(0).toUpperCase() || 'U')}
              </div>
              <div
                className={`msg-bubble ${msg.role} ${msg.isError ? 'msg-error' : ''}`}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                <div>{msg.text}</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  {msg.role === 'bot' && !msg.isError ? (
                     <button
                      className="chat-voice-btn"
                      onClick={() => speakText(msg.text, msg.id)}
                      title={t('chatbot:speakTooltip')}
                    >
                      {speakingMsgId === msg.id ? `🔊 ${t('chatbot:speaking')}` : `🔊 ${t('common:speak')}`}
                    </button>
                  ) : <span />}
                  
                  {msg.timestamp && (
                    <div className="msg-time" style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                      {msg.timestamp}
                    </div>
                  )}
                </div>

                {msg.isError && msg.failedPrompt && (
                  <button
                    className="chat-retry-btn"
                    onClick={() => handleRetry(msg.failedPrompt, msg.id)}
                    disabled={loading}
                  >
                    {t('common:retry')}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message bot">
              <div className="msg-avatar bot">🤖</div>
              <div className="msg-bubble bot">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="typing-indicator" aria-label="AgriBot is typing">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Generating AI response...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <button
            className={`chat-mic-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            title={t('chatbot:micTooltip')}
            disabled={loading}
          >
            {isListening ? '🛑' : '🎤'}
          </button>

          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder={t('chatbot:inputPlaceholder')}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
          />

          <button
            className="chat-send-btn"
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            title={t('chatbot:send')}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
