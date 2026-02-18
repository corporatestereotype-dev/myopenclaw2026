
import React, { useState, useRef, useEffect } from 'react';
import { Send, Anchor, Scroll, BookOpen } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

const CaptainsLog: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'claw', 
      content: "Ahoy there, matey! I be Captain Claw. Looking for the Amulet, are ye? Or perhaps just some tactical wisdom for the battle ahead?",
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const advice = await geminiService.getCaptainAdvice(input);
    const clawMsg: ChatMessage = { role: 'claw', content: advice, timestamp: new Date() };
    
    setMessages(prev => [...prev, clawMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b]/60 backdrop-blur-xl border-l border-amber-900/50 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-amber-900/30 bg-amber-950/20 flex items-center space-x-3">
        <BookOpen className="text-amber-500" />
        <h2 className="font-cinzel text-xl text-amber-100 font-bold tracking-widest">CAPTAIN'S LOG</h2>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-hide"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-lg text-sm relative ${
                msg.role === 'user' 
                  ? 'bg-indigo-950 text-indigo-100 border border-indigo-700/50' 
                  : 'bg-amber-950/80 text-amber-100 border border-amber-700/50 italic'
              }`}
            >
              {msg.role === 'claw' && (
                <div className="flex items-center space-x-1 mb-1 opacity-50 text-[10px] font-bold uppercase tracking-tighter">
                  <Anchor size={10} />
                  <span>Captain Claw</span>
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-amber-500 italic text-sm animate-pulse">
            <Scroll size={16} className="animate-spin" />
            <span>The Captain is penning his response...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-950/50 border-t border-amber-900/30">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask the Captain for advice..."
            className="w-full bg-slate-900 border border-amber-800/40 rounded-full px-4 py-2 text-amber-100 focus:outline-none focus:border-amber-500 transition-all text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-1 p-1.5 bg-amber-600 rounded-full text-white hover:bg-amber-500 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptainsLog;
