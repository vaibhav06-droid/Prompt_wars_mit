'use client';

import React, { useState } from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  Mail,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Upload,
  ArrowRight,
  ShieldCheck,
  FileText,
  User,
  Clock,
} from 'lucide-react';
import { CATEGORY_META } from '@/lib/utils';
import { parseWhatsAppExportText, ParsedChatMessage } from '@/lib/ai/chatParser';
import { MOCK_WHATSAPP_MESSAGES } from '@/data/seed';
import confetti from 'canvas-confetti';

export function CampusInbox() {
  const { emails, extractEmailToItem, items, addItem, setSelectedItemForDetail } = useCampus();
  const [inboxTab, setInboxTab] = useState<'gmail' | 'whatsapp'>('gmail');
  const [selectedEmailId, setSelectedEmailId] = useState<string>(emails[0]?.id || '');
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [customParsedMessages, setCustomParsedMessages] = useState<ParsedChatMessage[]>([]);
  const [rawChatPaste, setRawChatPaste] = useState('');

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];

  const handleConnectGmail = () => {
    setIsGmailConnected(true);
    alert('Connected to Google Workspace Academic Account (Read-Only Demo OAuth Token Verified).');
  };

  const handleExtractEmail = (emailId: string) => {
    const newItem = extractEmailToItem(emailId);
    if (newItem) {
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch {
        // safe fallback
      }
      setSelectedItemForDetail(newItem);
    }
  };

  const handleParseChatText = () => {
    if (!rawChatPaste.trim()) return;
    const parsed = parseWhatsAppExportText(rawChatPaste);
    setCustomParsedMessages(parsed);
  };

  const handleExtractFromChatMessage = (msg: { sender: string; content: string }) => {
    const newItem = addItem({
      title: msg.content.slice(0, 45).split('\n')[0],
      description: msg.content,
      date: new Date().toISOString().split('T')[0],
      category: 'announcement',
      priority: 'high',
      source: 'whatsapp',
      sourceSender: msg.sender,
      sourceRawText: msg.content,
      sourceSnippet: `WhatsApp Message from ${msg.sender}`,
      isEvent: true,
      isTask: true,
    });
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch {}
    setSelectedItemForDetail(newItem);
  };

  return (
    <div className="space-y-4">
      {/* Top Integration Mode Switcher */}
      <div className="p-4 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-campus-navy-800 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <button
            onClick={() => setInboxTab('gmail')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              inboxTab === 'gmail'
                ? 'bg-white dark:bg-campus-navy-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Gmail College Inbox</span>
            <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-blue-500/10 text-blue-500 font-bold">
              {emails.filter((e) => !e.read).length} Unread
            </span>
          </button>

          <button
            onClick={() => setInboxTab('whatsapp')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              inboxTab === 'whatsapp'
                ? 'bg-white dark:bg-campus-navy-950 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Import Hub</span>
          </button>
        </div>

        {inboxTab === 'gmail' ? (
          <button
            onClick={handleConnectGmail}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isGmailConnected
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-campus-navy-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{isGmailConnected ? 'Google Workspace Connected' : 'Connect Google Workspace (OAuth)'}</span>
          </button>
        ) : (
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Client-side private processing • No unauthorized message access</span>
          </div>
        )}
      </div>

      {inboxTab === 'gmail' ? (
        /* Gmail Split View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-14rem)]">
          {/* Email List Column */}
          <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {emails.map((email) => {
              const meta = CATEGORY_META[email.category];
              const isSelected = selectedEmail?.id === email.id;

              return (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmailId(email.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {email.fromName}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">{email.date}</span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">
                    {email.subject}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {email.snippet}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.badgeBg} ${meta.badgeText}`}>
                      {meta.label}
                    </span>
                    {email.extractedItemId ? (
                      <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Organized</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-indigo-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Ready</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Email Preview & Extract Action Column */}
          <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between overflow-y-auto">
            {selectedEmail ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {selectedEmail.subject}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      From: <strong className="text-slate-700 dark:text-slate-200">{selectedEmail.fromName}</strong> ({selectedEmail.fromEmail})
                    </p>
                  </div>

                  {/* Extract to CampusPulse Button */}
                  <button
                    onClick={() => handleExtractEmail(selectedEmail.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md transition-all shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Extract to CampusPulse</span>
                  </button>
                </div>

                <div className="whitespace-pre-line text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-slate-50/50 dark:bg-campus-navy-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {selectedEmail.body}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select an email to preview</p>
            )}

            <div className="text-[11px] text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>CampusPulse Gmail Academic Connector</span>
              <span className="text-emerald-500 font-semibold">Ready for extraction</span>
            </div>
          </div>
        </div>
      ) : (
        /* WhatsApp Chat Hub */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Chat Paste or Upload */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Import Exported WhatsApp Chat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste chat export logs or upload .txt file to automatically extract all announcements
              </p>
            </div>

            <textarea
              value={rawChatPaste}
              onChange={(e) => setRawChatPaste(e.target.value)}
              placeholder="Paste exported chat here, for example:&#10;[30/10/26, 8:45 PM] Prof. Mukherjee: AI workshop tomorrow 10 AM at Auditorium..."
              rows={8}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-campus-navy-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setRawChatPaste(`[30/10/26, 8:45:10 PM] Prof. Mukherjee: Dear Class, The AI workshop is confirmed for tomorrow 10:00 AM at Main Auditorium. Attendance will be recorded.
[30/10/26, 9:15:22 PM] Aarav Sharma: Sir will certificates be given to all attendees?
[30/10/26, 9:18:04 PM] Prof. Mukherjee: Yes, certificates from Google Developers Group will be issued to participants who complete the hands-on lab.
[31/10/26, 7:30:15 AM] Class Rep Pooja: Reminder: Last date to register for the SIH internal round is Nov 3 at 5 PM!`);
                }}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                Load Sample Chat
              </button>

              <button
                onClick={handleParseChatText}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                Parse Messages
              </button>
            </div>
          </div>

          {/* Right: Detected Announcements Feed */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Detected Announcements & Deadlines
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  AI scans message content for date, venue, compulsory attendance, and event tags
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {(customParsedMessages.length > 0 ? customParsedMessages : MOCK_WHATSAPP_MESSAGES).map((msg, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-campus-navy-950/70 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{msg.sender}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      onClick={() => handleExtractFromChatMessage(msg)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-600 text-xs font-semibold transition-all"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Convert to Event/Task</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

