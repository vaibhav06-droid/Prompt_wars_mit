'use client';

import React from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Tag,
  CheckCircle2,
  Trash2,
  FileText,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  User,
  ShieldAlert,
} from 'lucide-react';
import { calculateDeadlineInfo } from '@/lib/deadline';
import { CATEGORY_META, PRIORITY_META, formatDateSafe } from '@/lib/utils';

export function EventDetailModal() {
  const {
    selectedItemForDetail,
    setSelectedItemForDetail,
    toggleTask,
    deleteItem,
    profile,
  } = useCampus();

  if (!selectedItemForDetail) return null;

  const item = selectedItemForDetail;
  const meta = CATEGORY_META[item.category];
  const deadline = calculateDeadlineInfo(
    item,
    profile.settings.yellowWarningDays,
    profile.settings.redWarningHours
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between bg-slate-50/50 dark:bg-campus-navy-950/50">
          <div className="space-y-1.5 flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${meta.badgeBg} ${meta.badgeText}`}>
                {meta.label}
              </span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${deadline.badgeBg} ${deadline.badgeText} ${deadline.badgeBorder}`}>
                {deadline.label} ({deadline.subLabel})
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_META[item.priority].badgeBg} ${PRIORITY_META[item.priority].badgeText}`}>
                {PRIORITY_META[item.priority].label}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
              {item.title}
            </h2>
          </div>

          <button
            onClick={() => setSelectedItemForDetail(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Key Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-campus-navy-950/60 border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
              <span><strong>Date:</strong> {formatDateSafe(item.date)}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
              <span><strong>Time:</strong> {item.time || 'All Day'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 sm:col-span-2">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
              <span><strong>Venue:</strong> {item.venue || 'Campus Premises'}</span>
            </div>
            {item.attendance && (
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <Tag className="w-4 h-4 text-purple-500 shrink-0" />
                <span><strong>Attendance:</strong> {item.attendance.toUpperCase()}</span>
              </div>
            )}
            {item.registrationDeadline && (
              <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
                <Clock className="w-4 h-4 shrink-0" />
                <span><strong>Reg Deadline:</strong> {formatDateSafe(item.registrationDeadline)}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Description & Summary
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Instructions and Benefits */}
          {(item.instructions || item.benefits) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {item.instructions && item.instructions.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-campus-navy-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <h5 className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    Instructions & Requirements
                  </h5>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {item.instructions.map((inst, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span>•</span>
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.benefits && item.benefits.length > 0 && (
                <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-1.5">
                  <h5 className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Perks & Benefits
                  </h5>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {item.benefits.map((ben, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span>★</span>
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* SOURCE TRACKING (Requirement #14) */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Verified Source Tracking</span>
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                Source: {item.source}
              </span>
            </div>

            {item.sourceSender && (
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Sender: <strong>{item.sourceSender}</strong>
              </p>
            )}

            {item.sourceRawText && (
              <div className="mt-2 p-3 rounded-xl bg-white dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                &quot;{item.sourceRawText}&quot;
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-campus-navy-950/50">
          <button
            onClick={() => {
              if (confirm('Delete this campus item?')) {
                deleteItem(item.id);
                setSelectedItemForDetail(null);
              }
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-rose-500 hover:text-rose-600"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-3">
            {item.isTask && (
              <button
                onClick={() => {
                  toggleTask(item.id);
                  setSelectedItemForDetail(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{item.status === 'completed' ? 'Mark Incomplete' : 'Mark Completed'}</span>
              </button>
            )}

            <button
              onClick={() => setSelectedItemForDetail(null)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

