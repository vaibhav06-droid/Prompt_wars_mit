'use client';

import React, { useState } from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  FileText,
  Tag,
} from 'lucide-react';
import { CATEGORY_META, PRIORITY_META, formatDateSafe } from '@/lib/utils';
import { calculateDeadlineInfo } from '@/lib/deadline';
import { CategoryType, PriorityLevel } from '@/types';

export function EventsList() {
  const {
    items,
    setSelectedItemForDetail,
    setIsSmartInputOpen,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
  } = useCampus();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredItems = items.filter((item) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.venue && item.venue.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

    // Priority
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;

    // Status
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;

    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, workshops, venues..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-campus-navy-950/80 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryType | 'all')}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-campus-navy-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="workshop">Workshops</option>
            <option value="college_event">College Events</option>
            <option value="seminar">Seminars</option>
            <option value="assignment">Assignments</option>
            <option value="examination">Examinations</option>
            <option value="registration_deadline">Registration Deadlines</option>
            <option value="cultural_festival">Cultural Festivals</option>
            <option value="sports_event">Sports</option>
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as PriorityLevel | 'all')}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-campus-navy-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Quick Add */}
          <button
            onClick={() => setIsSmartInputOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Grid or List of Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const meta = CATEGORY_META[item.category];
          const deadline = calculateDeadlineInfo(item);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItemForDetail(item)}
              className="p-5 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-400 hover:shadow-lg dark:hover:border-indigo-500/60 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.badgeBg} ${meta.badgeText}`}>
                    {meta.label}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${deadline.badgeBg} ${deadline.badgeText} ${deadline.badgeBorder}`}>
                    {deadline.label}
                  </span>
                </div>

                {/* Title & Desc */}
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Details snippet */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{formatDateSafe(item.date)} at {item.time || '10:00 AM'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{item.venue || 'Campus Premises'}</span>
                  </div>
                </div>

                {/* Attendance & Benefits */}
                {(item.attendance || (item.benefits && item.benefits.length > 0)) && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {item.attendance && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.attendance.toUpperCase()}
                      </span>
                    )}
                    {item.benefits && item.benefits.length > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                        ★ {item.benefits[0]}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Source Bar */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                <span className="capitalize">Source: {item.source}</span>
                <span className="text-indigo-500 font-medium group-hover:underline flex items-center gap-1">
                  <span>View Details</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            No events found matching your filter criteria
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setPriorityFilter('all');
            }}
            className="text-xs text-indigo-500 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

