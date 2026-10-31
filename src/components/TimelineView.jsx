import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  GraduationCap,
  UtensilsCrossed,
  Rocket,
  Building2
} from 'lucide-react';
import { getUrgencyInfo, formatEventDateTime } from '../utils/urgency';

const CATEGORY_ICONS = {
  'Exam': FileCheck,
  'Academic': GraduationCap,
  'Mess & Dining': UtensilsCrossed,
  'Campus Event / Hackathon': Rocket,
  'Administrative': Building2
};

export function TimelineView({ notices = [], onToggleTask, onSelectNotice }) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Group notices into timeline slots
  const groups = {
    today: { title: 'Today’s Deadlines & Events', items: [] },
    tomorrow: { title: 'Tomorrow', items: [] },
    thisWeek: { title: 'Upcoming (Next 2-5 Days)', items: [] },
    later: { title: 'Later / Next Week', items: [] },
    archived: { title: 'Past & Auto-Archived', items: [] }
  };

  notices.forEach(notice => {
    const urgency = getUrgencyInfo(notice.date);
    if (urgency.isExpired || notice.isArchived) {
      groups.archived.items.push(notice);
      return;
    }

    if (notice.date === todayStr) {
      groups.today.items.push(notice);
    } else if (notice.date === tomorrowStr) {
      groups.tomorrow.items.push(notice);
    } else if (urgency.diffHours <= 120) {
      groups.thisWeek.items.push(notice);
    } else {
      groups.later.items.push(notice);
    }
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {Object.entries(groups).map(([key, group]) => {
        if (group.items.length === 0) return null;

        return (
          <div key={key} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {group.title} ({group.items.length})
              </h3>
            </div>

            <div className="relative pl-6 border-l-2 border-indigo-100 dark:border-slate-800 space-y-4">
              {group.items.map(notice => {
                const urgency = getUrgencyInfo(notice.date);
                const CategoryIcon = CATEGORY_ICONS[notice.category] || Rocket;
                const completedCount = notice.actionItems?.filter(t => t.completed).length || 0;
                const totalCount = notice.actionItems?.length || 0;

                return (
                  <div
                    key={notice.id}
                    className="relative bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                  >
                    {/* Timeline Node dot */}
                    <div className="absolute -left-[31px] top-5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-400 flex items-center justify-center">
                      <span className={`w-1.5 h-1.5 rounded-full ${urgency.dotColor}`} />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${urgency.badgeColor}`}>
                            {urgency.label}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            <CategoryIcon className="w-3 h-3 text-indigo-500" />
                            <span>{notice.category}</span>
                          </span>
                        </div>

                        <h4 
                          onClick={() => onSelectNotice(notice)}
                          className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors"
                        >
                          {notice.title}
                        </h4>

                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            {notice.time || 'All Day'}
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                            {notice.venue}
                          </span>
                        </div>
                      </div>

                      {/* Right quick actions */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                            {completedCount}/{totalCount} Checklist Done
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {urgency.relativeText}
                          </span>
                        </div>
                        <button
                          onClick={() => onSelectNotice(notice)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>

                    {/* Quick inline checklist view */}
                    {notice.actionItems && notice.actionItems.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                        {notice.actionItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => onToggleTask(notice.id, item.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition-colors ${
                              item.completed
                                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 line-through'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${item.completed ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            <span className="truncate max-w-xs">{item.text}</span>
                          </button>
                        ))}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

