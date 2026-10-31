'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  RotateCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  referencedItemIds?: string[];
  timestamp: string;
}

export function AssistantView() {
  const { items, setSelectedItemForDetail, profile } = useCampus();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${profile.name}! 👋 I am your CampusPulse AI assistant. I have complete access to your saved events, notices, assignments, and deadlines. How can I help you today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_QUERIES = [
    'What should I do today?',
    'Which assignment has the nearest deadline?',
    'What are my upcoming college events?',
    'What do I need to complete this week?',
    'What deadlines am I about to miss?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          items,
          apiKey: profile.settings.geminiApiKey,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          sender: 'assistant',
          text: data.reply,
          referencedItemIds: data.referencedItemIds,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('Failed to fetch AI reply');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          sender: 'assistant',
          text: 'I encountered an issue connecting to the AI service. Please check your internet connection or use offline quick actions.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col rounded-3xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-campus-navy-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Bot className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                CampusPulse Conversational AI
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-500">
                Grounded in Saved Campus Data
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ask anything about your deadlines, venues, schedules or academic priorities
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome',
                sender: 'assistant',
                text: `Hello ${profile.name}! 👋 How can I assist you with your campus schedule?`,
                timestamp: 'Just now',
              },
            ]);
          }}
          title="Reset Chat"
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-indigo-600 text-white font-bold text-xs'
                    : 'bg-purple-600 text-white shadow-sm'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-sm rounded-tr-none'
                    : 'bg-slate-100 dark:bg-campus-navy-800 text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 rounded-tl-none space-y-3'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Clickable referenced items */}
                {msg.referencedItemIds && msg.referencedItemIds.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">
                      Referenced Campus Items:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.referencedItemIds.map((itemId) => {
                        const referencedItem = items.find((it) => it.id === itemId);
                        if (!referencedItem) return null;
                        return (
                          <button
                            key={itemId}
                            onClick={() => setSelectedItemForDetail(referencedItem)}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-indigo-500 flex items-center gap-1 transition-all"
                          >
                            <span>{referencedItem.title}</span>
                            <ChevronRight className="w-3 h-3 text-indigo-500" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-campus-navy-800 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1">Checking campus records...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-6 py-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Try asking:</span>
        {SUGGESTED_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-campus-navy-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 text-xs font-medium shrink-0 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-campus-navy-950/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about assignments, deadlines, workshops or announcements..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white shadow-md transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

