'use client';

import React from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Flame,
  FileCheck,
  Eye,
  BellOff,
} from 'lucide-react';
import { calculateDeadlineInfo } from '@/lib/deadline';
import { CATEGORY_META, formatDateSafe } from '@/lib/utils';
import { parseISO, isToday, isPast } from 'date-fns';

export function AttentionToday() {
  const {
    items,
    toggleTask,
    snoozeItem,
    setSelectedItemForDetail,
    profile,
  } = useCampus();

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter items needing attention today:
  // 1. Overdue tasks/assignments (RED)
  // 2. Tasks/assignments due today
  // 3. Events occurring today or tomorrow morning
  // 4. Registration closing today or within 24 hours
  // 5. High priority urgent notices
  const attentionItems = items
    .filter((item) => {
      if (item.status === 'completed' || item.status === 'archived') return false;
      if (item.snoozedUntil && new Date(item.snoozedUntil) > new Date()) return false;

      const deadline = calculateDeadlineInfo(
        item,
        profile.settings.yellowWarningDays,
        profile.settings.redWarningHours
      );

      const isDueToday = item.date === todayStr || item.submissionDeadline === todayStr || item.registrationDeadline === todayStr;
      const isUrgent = deadline.color === 'RED' || item.priority === 'high';

      return isDueToday || isUrgent || deadline.isOverdue;
    })
    .sort((a, b) => {
      // Prioritize RED (overdue/imminent) first, then high priority
      const deadlineA = calculateDeadlineInfo(a);
      const deadlineB = calculateDeadlineInfo(b);

      if (deadlineA.isOverdue && !deadlineB.isOverdue) return -1;
      if (!deadlineA.isOverdue && deadlineB.isOverdue) return 1;

      if (deadlineA.color === 'RED' && deadlineB.color !== 'RED') return -1;
      if (deadlineA.color !== 'RED' && deadlineB.color === 'RED') return 1;

      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  if (attentionItems.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              All Clear for Today!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No urgent overdue assignments or imminent deadlines requiring your immediate attention.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                NEEDS ATTENTION TODAY
              </h2>
              <span className="px-2 py-0.5 text-xs font-extrabold rounded-full bg-rose-500 text-white animate-bounce">
                {attentionItems.length} Urgent
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Intelligently prioritized tasks due today, imminent deadlines & urgent campus notices.
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {attentionItems.map((item) => {
          const meta = CATEGORY_META[item.category];
          const deadline = calculateDeadlineInfo(
            item,
            profile.settings.yellowWarningDays,
            profile.settings.redWarningHours
          );

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl bg-white dark:bg-campus-navy-900/90 border transition-all hover:shadow-lg flex flex-col justify-between group ${
                deadline.color === 'RED'
                  ? 'border-rose-300/80 dark:border-rose-900/70 hover:border-rose-500'
                  : 'border-amber-300/80 dark:border-amber-900/70 hover:border-amber-500'
              }`}
            >
              <div className="space-y-2.5">
                {/* Badges row */}
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.badgeBg} ${meta.badgeText}`}>
                    {meta.label}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 border ${deadline.badgeBg} ${deadline.badgeText} ${deadline.badgeBorder}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${deadline.dotColor}`} />
                    <span>{deadline.label} • {deadline.subLabel}</span>
                  </span>
                </div>

                {/* Title & Desc */}
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Subtask or venue preview */}
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">
                    {item.time || '11:59 PM'} • {item.venue || 'Campus Portal'}
                  </span>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  {item.isTask && (
                    <button
                      onClick={() => toggleTask(item.id)}
                      title="Mark as completed"
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  )}

                  <button
                    onClick={() => snoozeItem(item.id, 24)}
                    title="Snooze for 24 hours"
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <BellOff className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setSelectedItemForDetail(item)}
                  className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

