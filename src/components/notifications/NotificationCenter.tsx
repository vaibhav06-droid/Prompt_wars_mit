'use client';

import React, { useState } from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  Bell,
  CheckCircle2,
  Clock,
  Trash2,
  BellOff,
  AlertTriangle,
  Calendar,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { formatDateSafe } from '@/lib/utils';

export function NotificationCenter() {
  const {
    notifications,
    acknowledgeNotification,
    dismissNotification,
    snoozeNotification,
    triggerBrowserNotification,
    profile,
    updateProfile,
    setSelectedItemForDetail,
    items,
  } = useCampus();

  const [filterType, setFilterType] = useState<string>('all');
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'unread') return !n.isRead || !n.isAcknowledged;
    if (filterType === 'acknowledged') return n.isAcknowledged;
    return true;
  });

  const handleRequestPush = () => {
    triggerBrowserNotification('CampusPulse AI: Notifications Enabled!', {
      body: 'You will receive timely alerts for imminent assignment deadlines and workshop schedules.',
    });
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Campus Notification Centre
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage alerts for assignments, examinations, registration closures and urgent notices
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-campus-navy-800 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
            {['all', 'unread', 'acknowledged'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterType(mode)}
                className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all ${
                  filterType === mode
                    ? 'bg-white dark:bg-campus-navy-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Test Push Button */}
          <button
            onClick={handleRequestPush}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{testNotificationSent ? 'Notification Sent!' : 'Test Browser Alert'}</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.map((notif) => {
          const targetItem = notif.targetId ? items.find((i) => i.id === notif.targetId) : null;

          return (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl bg-white dark:bg-campus-navy-900 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                !notif.isAcknowledged
                  ? 'border-indigo-300 dark:border-indigo-900/60 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800/80 opacity-75'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      notif.priority === 'high'
                        ? 'bg-rose-500/10 text-rose-600'
                        : 'bg-indigo-500/10 text-indigo-600'
                    }`}
                  >
                    {notif.type}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatDateSafe(notif.timestamp, 'MMM d, h:mm a')}
                  </span>
                  {notif.isAcknowledged && (
                    <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Acknowledged</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {notif.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {notif.message}
                </p>

                {targetItem && (
                  <button
                    onClick={() => setSelectedItemForDetail(targetItem)}
                    className="text-xs text-indigo-500 hover:underline font-medium pt-1"
                  >
                    View associated item: &quot;{targetItem.title}&quot; →
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                {!notif.isAcknowledged && (
                  <button
                    onClick={() => acknowledgeNotification(notif.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Acknowledge</span>
                  </button>
                )}

                <button
                  onClick={() => snoozeNotification(notif.id, 24)}
                  title="Snooze for 24 hours"
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Clock className="w-4 h-4" />
                </button>

                <button
                  onClick={() => dismissNotification(notif.id)}
                  title="Dismiss notification"
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredNotifs.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No notifications in this view.
          </div>
        )}
      </div>
    </div>
  );
}

