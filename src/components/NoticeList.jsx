import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Grid, 
  List, 
  Calendar, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  X,
  FileQuestion,
  RotateCcw
} from 'lucide-react';
import { NoticeCard } from './NoticeCard';
import { TimelineView } from './TimelineView';
import { getUrgencyInfo } from '../utils/urgency';

export function NoticeList({ 
  notices = [], 
  onToggleTask, 
  onAddTask, 
  onTogglePin, 
  onToggleArchive, 
  onDeleteNotice, 
  onEditNotice,
  onAcknowledge,
  selectedCategory,
  onSelectCategory,
  onResetFilters
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('all'); // 'all' | 'urgent' | 'attention' | 'ontrack' | 'completed' | 'expired'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'compact' | 'timeline'

  // Filtered & sorted notices
  const filteredNotices = useMemo(() => {
    return notices.filter(notice => {
      // 1. Category filter
      if (selectedCategory && selectedCategory !== 'All' && notice.category !== selectedCategory) {
        return false;
      }

      // 2. Urgency filter
      const urgency = getUrgencyInfo(notice.date);
      const isAllTasksCompleted = notice.actionItems?.length > 0 && notice.actionItems.every(t => t.completed);

      if (urgencyFilter === 'urgent') {
        if (urgency.status !== 'red' || notice.isArchived) return false;
      } else if (urgencyFilter === 'attention') {
        if (urgency.status !== 'yellow' || notice.isArchived) return false;
      } else if (urgencyFilter === 'ontrack') {
        if (urgency.status !== 'green' || notice.isArchived) return false;
      } else if (urgencyFilter === 'completed') {
        if (!isAllTasksCompleted) return false;
      } else if (urgencyFilter === 'expired') {
        if (!urgency.isExpired && !notice.isArchived) return false;
      }

      // 3. Keyword Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = notice.title?.toLowerCase().includes(q);
        const inVenue = notice.venue?.toLowerCase().includes(q);
        const inCategory = notice.category?.toLowerCase().includes(q);
        const inRaw = notice.rawSource?.toLowerCase().includes(q);
        const inTasks = notice.actionItems?.some(t => t.text?.toLowerCase().includes(q));
        if (!inTitle && !inVenue && !inCategory && !inRaw && !inTasks) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Pinned always on top
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Active urgent before others
      const urgA = getUrgencyInfo(a.date);
      const urgB = getUrgencyInfo(b.date);
      if (urgA.status === 'red' && urgB.status !== 'red') return -1;
      if (urgA.status !== 'red' && urgB.status === 'red') return 1;

      // Soonest deadline first
      const dateA = new Date(a.date || '2099-01-01').getTime();
      const dateB = new Date(b.date || '2099-01-01').getTime();
      return dateA - dateB;
    });
  }, [notices, selectedCategory, urgencyFilter, searchQuery]);

  return (
    <div className="space-y-6 my-6">
      
      {/* Controls Bar: Search, Urgency Pills, View Mode Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, venue, task, or keyword..."
            className="w-full pl-10 pr-9 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Urgency Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setUrgencyFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              urgencyFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Status
          </button>
          <button
            onClick={() => setUrgencyFilter('urgent')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              urgencyFilter === 'urgent'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Urgent (&lt;24h)</span>
          </button>
          <button
            onClick={() => setUrgencyFilter('attention')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              urgencyFilter === 'attention'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>24-72h</span>
          </button>
          <button
            onClick={() => setUrgencyFilter('ontrack')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              urgencyFilter === 'ontrack'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>&gt;3 Days</span>
          </button>
          <button
            onClick={() => setUrgencyFilter('expired')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              urgencyFilter === 'expired'
                ? 'bg-slate-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Auto-Archived
          </button>
        </div>

        {/* View Mode Toggle: Grid, Compact List, Timeline */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0 self-end md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-xl transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Card Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`p-1.5 rounded-xl transition-colors ${
              viewMode === 'compact'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Compact List View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`p-1.5 rounded-xl transition-colors ${
              viewMode === 'timeline'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Calendar / Timeline View"
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Content Area based on View Mode */}
      {filteredNotices.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto">
            <FileQuestion className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No matching campus notices found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, selecting "All" categories, or resetting the urgency filter.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setUrgencyFilter('all');
              if (onResetFilters) onResetFilters();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Search & Filters</span>
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        /* Timeline Agenda View */
        <TimelineView 
          notices={filteredNotices} 
          onToggleTask={onToggleTask}
          onSelectNotice={onEditNotice} 
        />
      ) : viewMode === 'compact' ? (
        /* Compact List View */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredNotices.map(notice => {
            const urgency = getUrgencyInfo(notice.date);
            const completedCount = notice.actionItems?.filter(t => t.completed).length || 0;
            const totalCount = notice.actionItems?.length || 0;

            return (
              <div 
                key={notice.id} 
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <span className={`w-3 h-3 rounded-full shrink-0 mt-1 sm:mt-0 ${urgency.dotColor}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {notice.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {notice.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${urgency.badgeColor}`}>
                        {urgency.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                      <span>{notice.venue}</span>
                      <span>•</span>
                      <span>{notice.date} ({notice.time})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <span className="text-xs font-semibold text-slate-500">
                    {completedCount}/{totalCount} tasks
                  </span>
                  <button
                    onClick={() => onEditNotice(notice)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300"
                  >
                    View Card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map(notice => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onToggleTask={onToggleTask}
              onAddTask={onAddTask}
              onTogglePin={onTogglePin}
              onToggleArchive={onToggleArchive}
              onDeleteNotice={onDeleteNotice}
              onEditNotice={onEditNotice}
              onAcknowledge={onAcknowledge}
            />
          ))}
        </div>
      )}

    </div>
  );
}

