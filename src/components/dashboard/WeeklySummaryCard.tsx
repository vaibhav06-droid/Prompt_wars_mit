'use client';

import React, { useState } from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  Sparkles,
  Calendar,
  FileCheck,
  GraduationCap,
  Clock,
  RotateCw,
  X,
  AlertCircle,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { formatDateSafe } from '@/lib/utils';

export function WeeklySummaryModal() {
  const { isWeeklySummaryOpen, setIsWeeklySummaryOpen, weeklyDigest, refreshWeeklySummary } = useCampus();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isWeeklySummaryOpen || !weeklyDigest) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      refreshWeeklySummary();
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Gradient Accent */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white relative">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-amber-400 text-slate-900 tracking-wider">
                  Mandatory Competition Feature
                </span>
                <span className="text-xs text-indigo-200">Generated {weeklyDigest.generatedAt}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <span>{weeklyDigest.title}</span>
                <Sparkles className="w-5 h-5 text-amber-300" />
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                title="Regenerate digest with current saved data"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsWeeklySummaryOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Executive Digest Paragraph */}
          <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-sm sm:text-base leading-relaxed text-indigo-50 font-normal">
              &quot;{weeklyDigest.overviewSummary}&quot;
            </p>
          </div>
        </div>

        {/* Digest Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Urgent Alerts Section */}
          {weeklyDigest.urgentAlerts.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Urgent Announcements & Imminent Alerts</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-900 dark:text-rose-200">
                {weeklyDigest.urgentAlerts.map((alert, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4 Categorized Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upcoming Events */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-campus-navy-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>Events This Week ({weeklyDigest.eventsThisWeek.length})</span>
                </span>
              </div>
              <div className="space-y-2">
                {weeklyDigest.eventsThisWeek.length > 0 ? (
                  weeklyDigest.eventsThisWeek.map((ev) => (
                    <div key={ev.id} className="text-xs p-2.5 rounded-xl bg-white dark:bg-campus-navy-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{ev.title}</p>
                      <p className="text-[11px] text-slate-500">{formatDateSafe(ev.date)} • {ev.time || 'TBD'} • {ev.venue}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-2">No events scheduled this week.</p>
                )}
              </div>
            </div>

            {/* Assignments */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-campus-navy-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-amber-500" />
                  <span>Assignments Due ({weeklyDigest.assignmentsThisWeek.length})</span>
                </span>
              </div>
              <div className="space-y-2">
                {weeklyDigest.assignmentsThisWeek.length > 0 ? (
                  weeklyDigest.assignmentsThisWeek.map((as) => (
                    <div key={as.id} className="text-xs p-2.5 rounded-xl bg-white dark:bg-campus-navy-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{as.title}</p>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400">Due: {formatDateSafe(as.submissionDeadline || as.date)} ({as.time || '23:59'})</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-2">All assignments up to date!</p>
                )}
              </div>
            </div>

            {/* Exams */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-campus-navy-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-rose-500" />
                  <span>Exams & Quizzes ({weeklyDigest.examsThisWeek.length})</span>
                </span>
              </div>
              <div className="space-y-2">
                {weeklyDigest.examsThisWeek.length > 0 ? (
                  weeklyDigest.examsThisWeek.map((ex) => (
                    <div key={ex.id} className="text-xs p-2.5 rounded-xl bg-white dark:bg-campus-navy-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{ex.title}</p>
                      <p className="text-[11px] text-rose-600 dark:text-rose-400">{formatDateSafe(ex.date)} at {ex.time || 'Morning Session'} • {ex.venue}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-2">No examinations this week.</p>
                )}
              </div>
            </div>

            {/* Registration Closures */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-campus-navy-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-pink-500" />
                  <span>Registration Deadlines ({weeklyDigest.deadlinesThisWeek.length})</span>
                </span>
              </div>
              <div className="space-y-2">
                {weeklyDigest.deadlinesThisWeek.length > 0 ? (
                  weeklyDigest.deadlinesThisWeek.map((dl) => (
                    <div key={dl.id} className="text-xs p-2.5 rounded-xl bg-white dark:bg-campus-navy-900 border border-slate-200/60 dark:border-slate-800 space-y-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{dl.title}</p>
                      <p className="text-[11px] text-pink-600 dark:text-pink-400">Portal Closes: {formatDateSafe(dl.registrationDeadline || dl.date)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-2">No closing registrations.</p>
                )}
              </div>
            </div>
          </div>

          {/* Recommended Priorities */}
          {weeklyDigest.recommendedPriorities.length > 0 && (
            <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>AI Recommended Priority Action Plan</span>
              </h4>
              <div className="space-y-2">
                {weeklyDigest.recommendedPriorities.map((rec, i) => (
                  <div key={i} className="text-xs text-slate-800 dark:text-slate-200 font-medium flex items-start gap-2">
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-campus-navy-950/50">
          <span className="text-xs text-slate-400">
            Real campus data digest • Refresh anytime
          </span>
          <button
            onClick={() => setIsWeeklySummaryOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Close Digest
          </button>
        </div>
      </div>
    </div>
  );
}

