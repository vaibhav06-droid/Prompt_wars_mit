'use client';

import React from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { calculateDeadlineInfo } from '@/lib/deadline';
import { format } from 'date-fns';

export function QuickStats() {
  const { items, profile, setIsSmartInputOpen, setIsWeeklySummaryOpen } = useCampus();

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const upcomingEvents = items.filter((i) => i.isEvent && i.date >= todayStr).length;
  const todayTasks = items.filter(
    (i) => i.isTask && (i.date === todayStr || i.submissionDeadline === todayStr)
  ).length;
  const pendingAssignments = items.filter(
    (i) => i.category === 'assignment' && i.status !== 'completed'
  ).length;
  const completedTasks = items.filter((i) => i.isTask && i.status === 'completed').length;
  const overdueTasks = items.filter((i) => {
    if (i.status === 'completed') return false;
    const d = calculateDeadlineInfo(i);
    return d.isOverdue;
  }).length;

  const totalTasks = items.filter((i) => i.isTask).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  return (
    <div className="space-y-4">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-campus-navy-900 via-indigo-950 to-campus-navy-950 text-white border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-semibold">Live Campus Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            CampusPulse Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {profile.name} • {profile.branch} • {profile.collegeName}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => setIsSmartInputOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Smart Input</span>
          </button>

          <button
            onClick={() => setIsWeeklySummaryOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all"
          >
            <span>Weekly Digest</span>
          </button>
        </div>
      </div>

      {/* 5 Compact Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Upcoming Events</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{upcomingEvents}</p>
          <p className="text-[10px] text-slate-400">Scheduled ahead</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Due Today</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{todayTasks}</p>
          <p className="text-[10px] text-slate-400">Requires action today</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Pending Assignments</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{pendingAssignments}</p>
          <p className="text-[10px] text-indigo-500 font-medium">In progress</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Overdue Tasks</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{overdueTasks}</p>
          <p className="text-[10px] text-rose-500 font-medium">Critical warning</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{completionPercentage}%</p>
          <p className="text-[10px] text-emerald-500 font-medium">{completedTasks} of {totalTasks} finished</p>
        </div>
      </div>
    </div>
  );
}

