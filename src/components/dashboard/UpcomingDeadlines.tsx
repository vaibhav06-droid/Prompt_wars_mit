'use client';

import React from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  Clock,
  Calendar,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  Sliders,
} from 'lucide-react';
import { calculateDeadlineInfo } from '@/lib/deadline';
import { CATEGORY_META, formatDateSafe } from '@/lib/utils';

export function UpcomingDeadlines() {
  const { items, setSelectedItemForDetail, profile, setActiveTab } = useCampus();

  const deadlinesList = items
    .filter((i) => i.submissionDeadline || i.registrationDeadline || i.date)
    .sort((a, b) => {
      const dateA = a.submissionDeadline || a.registrationDeadline || a.date;
      const dateB = b.submissionDeadline || b.registrationDeadline || b.date;
      return dateA.localeCompare(dateB);
    })
    .slice(0, 5);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Smart Colour-Coded Deadlines</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time urgency indicators: Green (Safe), Yellow (Approaching), Red (Imminent/Overdue)
          </p>
        </div>

        <button
          onClick={() => setActiveTab('schedule')}
          className="text-xs text-indigo-500 hover:underline font-medium"
        >
          View all →
        </button>
      </div>

      <div className="space-y-3">
        {deadlinesList.map((item) => {
          const meta = CATEGORY_META[item.category];
          const deadline = calculateDeadlineInfo(
            item,
            profile.settings.yellowWarningDays,
            profile.settings.redWarningHours
          );

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItemForDetail(item)}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-campus-navy-950/70 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-2 h-2 rounded-full ${deadline.dotColor} shrink-0`} />
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                    {item.title}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${deadline.badgeBg} ${deadline.badgeText} ${deadline.badgeBorder}`}
                >
                  {deadline.label} • {deadline.subLabel}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      deadline.color === 'RED'
                        ? 'bg-rose-500'
                        : deadline.color === 'YELLOW'
                        ? 'bg-amber-500'
                        : deadline.color === 'GREEN'
                        ? 'bg-emerald-500'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${deadline.progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Target: {formatDateSafe(item.submissionDeadline || item.registrationDeadline || item.date)}</span>
                  <span>{item.category.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

