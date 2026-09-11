import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, Brain, AlertCircle } from 'lucide-react';
import { askOpportunityAIApi } from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';

function renderFormattedInline(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="px-1.5 py-0.5 rounded bg-slate-950 text-indigo-300 font-mono text-[11px] border border-slate-800">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function FormattedMessage({ text }) {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <div className="space-y-1 text-xs leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        if (trimmed.startsWith('#')) {
          const headerText = trimmed.replace(/^#+\s*/, '');
          return (
            <h4 key={i} className="font-bold text-xs text-indigo-300 mt-2 mb-1 border-b border-indigo-500/20 pb-0.5">
              {renderFormattedInline(headerText)}
            </h4>
          );
        }

        if (trimmed.startsWith('•') || trimmed.startsWith('*') || trimmed.startsWith('-')) {
          const bulletText = trimmed.replace(/^[•*-]\s*/, '');
          return (
            <div key={i} className="flex items-start gap-1.5 pl-1 my-0.5">
              <span className="text-indigo-400 font-bold text-sm leading-none">•</span>
              <span className="flex-1 text-slate-200">{renderFormattedInline(bulletText)}</span>
            </div>
          );
        }

        if (/^\d+\.\s/.test(trimmed)) {
          const itemText = trimmed.replace(/^\d+\.\s*/, '');
          const num = trimmed.match(/^\d+/)?.[0];
          return (
            <div key={i} className="flex items-start gap-1.5 pl-1 my-0.5">
              <span className="text-indigo-400 font-bold">{num}.</span>
              <span className="flex-1 text-slate-200">{renderFormattedInline(itemText)}</span>
            </div>
          );
        }

        return (
          <p key={i} className="text-slate-300">
            {renderFormattedInline(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function OpportunityAIAssistantDrawer({ isOpen, onClose, selectedOpportunityId = null, opportunityTitle = '' }) {
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: opportunityTitle 
        ? `Hello! I'm OpportunityOS AI. How can I help you improve your fit for **${opportunityTitle}**?`
        : `Hello! I'm OpportunityOS AI. Ask me anything about your opportunity recommendations, skill gaps, or preparation plans.`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleSend = async (customPrompt = null) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || loading) return;

    // Add user message
    const userMsg = { sender: 'user', text: promptToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await askOpportunityAIApi(selectedOpportunityId, promptToSend);
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      console.error('AI Request Error:', err);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Apologies, I encountered an issue connecting to the engine. Please try asking again!'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'What is Docker?',
    'Why am I a good match?',
    'What skills am I missing?',
    'Should I apply now?',
    'How can I improve my match?'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#090D1A] border-l border-slate-800 shadow-2xl flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    OpportunityOS AI
                  </h3>
                  <span className="text-[11px] text-slate-400">Contextual Student Career Assistant</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 text-xs leading-relaxed ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <FormattedMessage text={msg.text} />
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5 font-bold text-[10px]">
                      {getInitials(user?.name)}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 text-xs justify-start">
                  <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 animate-pulse">
                    Analyzing profile & opportunity metrics...
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts & Input Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 space-y-3">
              {/* Quick Prompts */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp)}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-950 hover:text-indigo-300 border border-slate-700 text-[11px] text-slate-300 transition-colors"
                  >
                    {qp}
                  </button>
                ))}
              </div>

              {/* Text Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask OpportunityOS AI..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
