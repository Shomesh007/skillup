
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../src/services/azureOpenAI';

interface Props {
  onBack: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatView: React.FC<Props> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I\'m s4skillup Assistant. I can help you with resume tips, interview prep, salary negotiation, and career guidance. What can I help with?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      } as const));

      const aiResponse = await getChatResponse(userMsg, conversationHistory);
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response from AI. Please try again.';
      setError(errorMessage);
      console.error('Chat error:', err);
      // Show error message to user in chat
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: `I apologize, but I encountered an issue: ${errorMessage}. Please try again or contact support.` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-32 pt-6 lg:px-10 lg:pb-28">
        {messages.map((m, i) => (
          <div key={i} className={`mx-auto flex w-full max-w-4xl ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl font-mono text-sm leading-relaxed lg:max-w-[68%] lg:p-5 ${
              m.role === 'user' 
                ? 'bg-primary/20 border border-primary/30 text-white rounded-br-none' 
                : 'glass-panel text-gray-300 rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mx-auto flex w-full max-w-4xl justify-start">
            <div className="glass-panel p-4 rounded-2xl rounded-bl-none">
              <span className="animate-pulse text-neon-cyan font-mono text-xs tracking-widest">THINKING...</span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-20 left-4 right-4 z-10 lg:bottom-8 lg:left-10 lg:right-10">
        <div className="relative group mx-auto max-w-4xl">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Input query to AI..."
            disabled={loading}
            className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-4 pr-16 outline-none focus:border-neon-cyan/50 backdrop-blur-xl text-white font-mono text-sm disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 aspect-square rounded-lg bg-neon-cyan flex items-center justify-center text-black hover:bg-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
