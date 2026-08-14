import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { CitizenProfile, GovernmentScheme } from '../types';
import { askSchemeAI } from '../services/api';

interface AISchemeAdvisorProps {
  profile: CitizenProfile;
  language: string;
  onOpenSchemeDetails?: (scheme: GovernmentScheme) => void;
  prefillQuery?: string | null;
  onClearPrefillQuery?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AISchemeAdvisor: React.FC<AISchemeAdvisorProps> = ({
  profile,
  language,
  onOpenSchemeDetails,
  prefillQuery,
  onClearPrefillQuery,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Namaste ${profile.fullName}! I am your AI Welfare & Entitlement Assistant. I have analyzed your profile (${profile.occupation}, ${profile.district}, ${profile.state}, Annual Income ₹${profile.annualHouseholdIncome.toLocaleString('en-IN')}).\n\nHow can I assist you with government scheme applications, missed benefits, or document guidelines today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    `Which schemes can give me immediate cash transfer this month?`,
    `How do I fix my Bank NPCI DBT linking if payments fail?`,
    `Can I claim both PM-KISAN and Kisan Credit Card simultaneously?`,
    `What scholarships exist for my children studying in school?`,
    `How do I apply for ₹5 Lakh Free Ayushman Bharat PM-JAY health card?`
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (prefillQuery) {
      handleSend(prefillQuery);
      onClearPrefillQuery?.();
    }
  }, [prefillQuery]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await askSchemeAI(textToSend, profile, language);
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              AI Welfare Advisor &amp; Entitlement Helpdesk
            </h2>
            <p className="text-xs text-slate-400">
              Conversational intelligence for scheme eligibility, application steps, dispute resolution &amp; grievance redressal in {language}.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([{
              id: 'welcome-msg-reset',
              sender: 'ai',
              text: `Chat reset. Ask any question about central and state government schemes.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
          }}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isAi
                      ? 'bg-slate-800 text-slate-200 border border-slate-700/80 shadow-md'
                      : 'bg-emerald-600 text-white font-medium shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {msg.text}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-700/50 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {isAi && (
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="hover:text-purple-300 flex items-center gap-1"
                        title="Read text aloud"
                      >
                        {isSpeaking ? <VolumeX className="w-3 h-3 text-purple-400" /> : <Volume2 className="w-3 h-3" />}
                        <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 text-xs text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
                <span>Thinking &amp; analyzing welfare guidelines for {profile.fullName}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Questions Bar */}
        <div className="px-5 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Suggested:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded-full whitespace-nowrap text-[11px] border border-slate-700 transition shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Ask any question about schemes, documents, or grievance helplines in ${language}...`}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />

          <button
            id="btn-send-advisor-msg"
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-lg shadow-purple-600/30 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
