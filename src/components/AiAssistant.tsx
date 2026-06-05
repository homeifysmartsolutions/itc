import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, MessageSquare, ShieldAlert, BookOpen, 
  RefreshCw, CheckCircle2, ChevronRight, ArrowRight 
} from 'lucide-react';
import { ChatMessage } from '../types';

export default function AiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Namaste! I am the **Tatkal Expert AI Assistant**. 🚄\n\nI am fully connected to Indian Railways operations rules. I can help you with:\n\n- **Autofill script generation & bookmarklets** to bypass typing delays\n- **Tatkal timing configurations** (booking windows, AC vs Sleeper quotas)\n- **Refund rules troubleshooting** for cancellations\n- **Waitlist probability calculations** and routing hacks\n\nHow can I help accelerate your ticket booking speed today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle send message
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Send chat history and current message to back-end Express API proxy
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Failed to query Gemini assistant endpoint");
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, assistantMsg]);

    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: `❌ **Failed to contact AI Engine**\n\n${error?.message || 'Server connection timed out.'}\n\n*Hint: Please ensure your GEMINI_API_KEY is configured inside the Secrets panel.*`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Safe client-side markdown interpreter for formatting bullet points, bolding, and code brackets
  const renderFormattedText = (raw: string, isUser: boolean) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      let content = line;
      
      // Check for bullet lists
      const listMatch = content.match(/^[\s]*[-*+]\s+(.*)$/);
      const isListItem = !!listMatch;
      if (isListItem) {
        content = listMatch[1];
      }

      // Format bold text (**word**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIdx = 0;
      let match;
      
      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIdx) {
          parts.push(content.substring(lastIdx, match.index));
        }
        parts.push(
          <strong key={match.index} className={`font-black ${isUser ? 'text-white' : 'text-slate-950'}`}>
            {match[1]}
          </strong>
        );
        lastIdx = boldRegex.lastIndex;
      }
      if (lastIdx < content.length) {
        parts.push(content.substring(lastIdx));
      }

      const elements = parts.length > 0 ? parts : content;

      if (isListItem) {
        return (
          <li key={idx} className={`list-disc ml-5 text-xs leading-relaxed mb-1 ${isUser ? 'text-white' : 'text-slate-700'}`}>
            {elements}
          </li>
        );
      } else if (content.startsWith('###')) {
        return (
          <h4 key={idx} className={`text-sm font-black mt-4 mb-2 font-mono uppercase tracking-wide ${isUser ? 'text-white' : 'text-indigo-700'}`}>
            {content.replace(/^###\s*/, '')}
          </h4>
        );
      } else if (content.startsWith('##') || content.startsWith('#')) {
        return (
          <h3 key={idx} className={`text-base font-extrabold mt-5 mb-2.5 font-sans border-b pb-1 flex items-center gap-1 ${isUser ? 'text-white border-indigo-400' : 'text-slate-900 border-slate-205'}`}>
            <span>🚀</span>
            {content.replace(/^#+\s*/, '')}
          </h3>
        );
      } else if (content.trim() === '') {
        return <div key={idx} className="h-2"></div>;
      } else {
        return (
          <p key={idx} className={`text-xs leading-relaxed mb-2 font-sans ${isUser ? 'text-white' : 'text-slate-700'}`}>
            {elements}
          </p>
        );
      }
    });
  };

  const QUICK_PROMPTS = [
    {
      title: "When is Tatkal open?",
      desc: "AC vs Sleeper window timing rules.",
      prompt: "Explain the exact booking schedules and dates rules for IRCTC Tatkal (AC classes vs Sleeper classes) and when I should prepare my console."
    },
    {
      title: "Autofill Bypass?",
      desc: "How do bookmarklets bypass manual delay?",
      prompt: "Walk me through how the Tatkal Master list bookmarklet script works to autofill forms and bypass the 30-second manual entry bottleneck on Passenger pages."
    },
    {
      title: "Tatkal Refund Policy?",
      desc: "Am I entitled to refund on cancellings?",
      prompt: "What are the official refund refund rules for cancelling a confirmed Tatkal ticket or a Waitlist Tatkal ticket?"
    },
    {
      title: "Maximize Waitlist CNF?",
      desc: "GNWL vs PQWL confirmation index.",
      prompt: "What are GNWL, RLWL, and PQWL, and which waitlist quota has the highest probability of confirmation during Indian Railways charters?"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="ai-chat-tab">
      
      {/* Quick Prompts rail */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white border border-slate-205 p-5 rounded shadow-sm text-slate-800">
          <h3 className="text-xs font-mono text-indigo-705 font-bold uppercase mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-650" />
            <span>Tatkal Strategy Guide</span>
          </h3>
          <p className="text-xs text-slate-550 font-semibold mb-4">Click these pre-compiled railway query blocks to load strategies immediately into the AI expert.</p>
          
          <div className="space-y-3 font-sans">
            {QUICK_PROMPTS.map((qp, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(qp.prompt)}
                disabled={isLoading}
                className="w-full text-left p-3.5 bg-slate-50/80 border border-slate-200 hover:border-indigo-500 rounded transition group duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-650 transition">{qp.title}</h4>
                  <p className="text-[10px] text-slate-650 font-semibold leading-snug">{qp.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-indigo-650 font-mono mt-3 self-end opacity-0 group-hover:opacity-100 transition font-bold">
                  <span>Query bot</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main chat dialogue screen */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded flex flex-col h-[600px] overflow-hidden relative shadow-sm text-slate-800">
        
        {/* Chat top info header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-150 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 border border-indigo-150 text-indigo-600 rounded">
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-950">Tatkal Systems Coach</h3>
            <p className="text-[10px] text-slate-550 font-bold font-mono">POWERED BY GEMINI • REALTIME SCHEDULING ADVISE</p>
          </div>
        </div>

        {/* Conversation flow logs */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20">
          {messages.map((m, idx) => (
            <div 
              key={idx}
              className={`flex gap-3 max-w-xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Profile icon dot */}
              <div className={`p-2 rounded flex-shrink-0 h-9 w-9 flex items-center justify-center font-mono font-bold text-xs ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-100 text-slate-705 border border-slate-200'
              }`}>
                {m.role === 'user' ? 'ME' : 'AI'}
              </div>

              {/* Message log body */}
              <div className={`p-4 rounded shadow-sm ${
                m.role === 'user' 
                  ? 'bg-indigo-600 border border-indigo-550 text-white rounded-tr-none' 
                  : 'bg-slate-100/90 border border-slate-205 text-slate-800 rounded-tl-none font-semibold'
              }`}>
                <div className="prose max-w-none">
                  {renderFormattedText(m.text, m.role === 'user')}
                </div>
                <div className={`text-[9px] font-mono text-right mt-1.5 ${m.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {m.timestamp}
                </div>
              </div>

            </div>
          ))}

          {/* Loader typing animation */}
          {isLoading && (
            <div className="flex gap-3 max-w-xs animate-pulse">
              <div className="p-2 rounded h-9 w-9 bg-slate-100 text-slate-600 border border-slate-250 flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div className="p-4 rounded bg-slate-100 border border-slate-200 text-slate-600 rounded-tl-none flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-650 animate-spin" />
                <span className="text-xs font-mono font-bold animate-pulse">Analyzing rules...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Send message text box */}
        <div className="p-4 bg-slate-50 border-t border-slate-150">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }} 
            className="flex gap-3"
          >
            <input 
              type="text" 
              placeholder="Ask anything about train routes, bypass schedules, or refund timelines..." 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-white border border-slate-250 text-slate-800 py-3 px-4 rounded text-xs outline-none focus:border-indigo-500 font-semibold"
            />
            
            <button 
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm text-xs uppercase"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
