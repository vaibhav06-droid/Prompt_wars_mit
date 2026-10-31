import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  UtensilsCrossed, 
  Trophy, 
  CheckSquare, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX,
  Share2
} from 'lucide-react';
import { getUrgencyInfo } from '../utils/urgency';

export function WeeklyDigestModal({ isOpen, onClose, notices = [] }) {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  // Group notices into the 4 required sections
  const criticalDeadlines = [];
  const messUpdates = [];
  const upcomingEvents = [];
  const highPriorityActions = [];

  notices.forEach(notice => {
    const urgency = getUrgencyInfo(notice.date);

    // 1. Critical Deadlines: Red or Yellow status & not archived
    if ((urgency.status === 'red' || urgency.status === 'yellow') && !notice.isArchived) {
      criticalDeadlines.push(notice);
    }

    // 2. Mess Updates & Special Dinners
    if (notice.category === 'Mess & Dining' && !notice.isArchived) {
      messUpdates.push(notice);
    }

    // 3. Upcoming Events & Workshops
    if (notice.category === 'Campus Event / Hackathon' && !notice.isArchived) {
      upcomingEvents.push(notice);
    }

    // 4. High-Priority Action Items: Uncompleted checklist items from active urgent or important notices
    if (notice.actionItems && !notice.isArchived) {
      notice.actionItems.forEach(task => {
        if (!task.completed) {
          highPriorityActions.push({
            taskText: task.text,
            noticeTitle: notice.title,
            urgencyStatus: urgency.status
          });
        }
      });
    }
  });

  // Prepare text summary for WhatsApp sharing / clipboard
  const generatePlainTextDigest = () => {
    let text = `📢 *CAMPUS PULSE WEEKLY DIGEST* 📢\n` +
               `Generated for MIT Campus Community\n\n` +
               `🚨 *CRITICAL DEADLINES:*\n` +
               criticalDeadlines.map(n => `• ${n.title} (${n.date} - ${n.time}) @ ${n.venue}`).join('\n') +
               `\n\n🍽️ *MESS & DINING UPDATES:*\n` +
               messUpdates.map(n => `• ${n.title} (${n.date} - ${n.time})`).join('\n') +
               `\n\n🏆 *EVENTS & HACKATHONS:*\n` +
               upcomingEvents.map(n => `• ${n.title} @ ${n.venue}`).join('\n') +
               `\n\n✅ *KEY PENDING TASKS:*\n` +
               highPriorityActions.slice(0, 5).map(a => `• [ ] ${a.taskText} (${a.noticeTitle})`).join('\n') +
               `\n\n⚡ Stay ahead with Campus Pulse!`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePlainTextDigest());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const speechText = `Here is your Campus Pulse Weekly Digest. You have ${criticalDeadlines.length} critical deadlines this week. Top item: ${criticalDeadlines[0]?.title || 'None'}. In mess updates: ${messUpdates[0]?.title || 'No special announcements'}. ${highPriorityActions.length} pending action items await your attention.`;
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight">Weekly Campus Digest</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950">
                  AI Summarized
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                "What do I need to know this week?" — Synthesized from all active feeds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Read-out simulation */}
            <button
              onClick={handleToggleSpeech}
              className={`p-2 rounded-xl transition-colors ${
                isPlayingAudio 
                  ? 'bg-amber-400 text-indigo-950 animate-pulse' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={isPlayingAudio ? 'Stop reading' : 'Read aloud with AI Voice'}
            >
              {isPlayingAudio ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Section 1: 🚨 Critical Deadlines */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-extrabold text-base uppercase tracking-wide">
                Critical Deadlines ({criticalDeadlines.length})
              </h3>
            </div>

            {criticalDeadlines.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No critical deadlines pending for this week.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {criticalDeadlines.map(notice => {
                  const urg = getUrgencyInfo(notice.date);
                  return (
                    <div 
                      key={notice.id}
                      className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                          {notice.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${urg.badgeColor}`}>
                          {urg.relativeText}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        {notice.venue} • {notice.time}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: 🍽️ Mess Updates & Special Dinners */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <UtensilsCrossed className="w-5 h-5 shrink-0" />
              <h3 className="font-extrabold text-base uppercase tracking-wide">
                Mess Updates & Special Dinners ({messUpdates.length})
              </h3>
            </div>

            {messUpdates.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No special mess notices active.</p>
            ) : (
              <div className="space-y-2">
                {messUpdates.map(notice => (
                  <div 
                    key={notice.id}
                    className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60"
                  >
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {notice.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Venue: {notice.venue} ({notice.date} - {notice.time})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: 🏆 Upcoming Events & Workshops */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Trophy className="w-5 h-5 shrink-0" />
              <h3 className="font-extrabold text-base uppercase tracking-wide">
                Upcoming Events & Workshops ({upcomingEvents.length})
              </h3>
            </div>

            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No upcoming hackathons or events scheduled.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingEvents.map(notice => (
                  <div 
                    key={notice.id}
                    className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60"
                  >
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                      {notice.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      📍 {notice.venue} • {notice.date}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: ✅ High-Priority Action Items */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckSquare className="w-5 h-5 shrink-0" />
              <h3 className="font-extrabold text-base uppercase tracking-wide">
                High-Priority Action Items ({highPriorityActions.length})
              </h3>
            </div>

            {highPriorityActions.length === 0 ? (
              <p className="text-xs text-slate-500 italic">All checklist items are completed! Great job!</p>
            ) : (
              <div className="space-y-2">
                {highPriorityActions.slice(0, 6).map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <div>
                      <span className="font-semibold">{item.taskText}</span>
                      <span className="block text-[11px] text-slate-400 mt-0.5">
                        From: {item.noticeTitle}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-600 shadow-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Copy Summary for WhatsApp</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

