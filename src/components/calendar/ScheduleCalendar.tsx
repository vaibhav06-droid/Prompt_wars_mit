'use client';

import React, { useState } from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Tag,
  CheckCircle2,
  List,
  Grid3X3,
  Columns,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { CATEGORY_META, formatDateSafe } from '@/lib/utils';
import { calculateDeadlineInfo } from '@/lib/deadline';

export function ScheduleCalendar() {
  const { items, setSelectedItemForDetail } = useCampus();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'agenda'>('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const daysInGrid = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  return (
    <div className="space-y-4">
      {/* Calendar Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {items.length} total events, deadlines and exam schedules recorded
            </p>
          </div>
        </div>

        {/* Navigation & View Switcher */}
        <div className="flex items-center gap-2">
          {/* View Mode */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-campus-navy-800 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setCalendarView('month')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                calendarView === 'month'
                  ? 'bg-white dark:bg-campus-navy-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>
            <button
              onClick={() => setCalendarView('agenda')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                calendarView === 'agenda'
                  ? 'bg-white dark:bg-campus-navy-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Agenda</span>
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Today
          </button>

          <div className="flex items-center">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-l-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-r-xl border-t border-b border-r border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {calendarView === 'month' ? (
        /* Month Grid */
        <div className="bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 text-center text-xs font-bold text-slate-500 dark:text-slate-400 py-3 bg-slate-50/50 dark:bg-campus-navy-950/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
            {daysInGrid.map((day, i) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const dayItems = items.filter(
                (item) => item.date === dayStr || item.submissionDeadline === dayStr || item.registrationDeadline === dayStr
              );
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={i}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                    !isCurrentMonth
                      ? 'bg-slate-50/30 dark:bg-campus-navy-950/30 text-slate-300 dark:text-slate-700'
                      : isCurrentDay
                      ? 'bg-indigo-50/30 dark:bg-indigo-950/20'
                      : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isCurrentDay
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : isCurrentMonth
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayItems.length > 0 && (
                      <span className="text-[10px] font-semibold text-slate-400">
                        {dayItems.length}
                      </span>
                    )}
                  </div>

                  {/* Event Chips */}
                  <div className="space-y-1 overflow-hidden">
                    {dayItems.slice(0, 3).map((item) => {
                      const meta = CATEGORY_META[item.category];
                      const deadline = calculateDeadlineInfo(item);
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItemForDetail(item)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate cursor-pointer transition-transform hover:scale-[1.02] flex items-center gap-1 border ${meta.bgColor} ${meta.badgeText} ${meta.borderColor}`}
                        >
                          <span className={`w-1 h-1 rounded-full ${deadline.dotColor} shrink-0`} />
                          <span className="truncate">{item.title}</span>
                        </div>
                      );
                    })}
                    {dayItems.length > 3 && (
                      <p className="text-[10px] font-semibold text-indigo-500 pl-1">
                        +{dayItems.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Agenda View */
        <div className="space-y-3">
          {items
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((item) => {
              const meta = CATEGORY_META[item.category];
              const deadline = calculateDeadlineInfo(item);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemForDetail(item)}
                  className="p-4 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-400 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.badgeBg} ${meta.badgeText}`}>
                        {meta.label}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${deadline.badgeBg} ${deadline.badgeText} ${deadline.badgeBorder}`}>
                        {deadline.label} ({deadline.subLabel})
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{item.description}</p>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {formatDateSafe(item.date)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.time || '10:00 AM'} • {item.venue || 'Campus'}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

