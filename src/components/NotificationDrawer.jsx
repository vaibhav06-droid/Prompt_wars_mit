import React from 'react';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ArrowRight,
  CheckCheck
} from 'lucide-react';
import { getUrgencyInfo } from '../utils/urgency';

export function NotificationDrawer({ 
  isOpen, 
  onClose, 
  notices = [], 
  onAcknowledgeNotice, 
  onAcknowledgeAll,
  onSelectNotice 
}) {
  if (!isOpen) return null;

  // Filter for urgent or unacknowledged items
  const activeAlerts = notices.filter(n => {
    const urg = getUrgencyInfo(n.date);
    return !n.isArchived && (urg.status === 'red' || (!n.isAcknowledged && urg.status === 'yellow'));
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Campus Pulse Alerts</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  {activeAlerts.length} Active
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Action required on urgent deadlines
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeAlerts.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                You’re completely caught up!
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                No active urgent notices or unacknowledged deadlines at the moment.
              </p>
            </div>
          ) : (
            activeAlerts.map(notice => {
              const urg = getUrgencyInfo(notice.date);
              return (
                <div
                  key={notice.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 group hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${urg.badgeColor}`}>
                      {urg.label} • {urg.relativeText}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {notice.category}
                    </span>
                  </div>

                  <h4 
                    onClick={() => {
                      onSelectNotice(notice);
                      onClose();
                    }}
                    className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors"
                  >
                    {notice.title}
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      {notice.time}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      {notice.venue}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        onSelectNotice(notice);
                        onClose();
                      }}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>Jump to Notice</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onAcknowledgeNotice(notice.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950 transition-colors"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span>Dismiss Alert</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {activeAlerts.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
            <button
              onClick={onAcknowledgeAll}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-sm transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Acknowledge All Active Alerts</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

