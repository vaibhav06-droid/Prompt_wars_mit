import React from 'react';
import { AlertTriangle, CheckCircle, ArrowRight, X } from 'lucide-react';

export function PersistentNotificationBanner({ 
  urgentNotices = [], 
  onAcknowledgeNotice, 
  onDismissAll,
  onSelectNotice 
}) {
  if (!urgentNotices || urgentNotices.length === 0) return null;

  const topNotice = urgentNotices[0];

  return (
    <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 text-white shadow-md animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center justify-center p-1.5 rounded-lg bg-white/20 backdrop-blur-sm shrink-0">
              <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
            </span>
            <div className="truncate">
              <span className="font-bold tracking-wide uppercase text-xs bg-white/25 px-2 py-0.5 rounded-full mr-2">
                Action Required ({urgentNotices.length})
              </span>
              <span className="font-semibold">{topNotice.title}</span>
              <span className="hidden md:inline text-rose-100 ml-2">
                — {topNotice.venue} ({topNotice.time || 'Today'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectNotice(topNotice)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
            >
              <span>Jump to Item</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onAcknowledgeNotice(topNotice.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white text-rose-700 hover:bg-rose-50 shadow-sm transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Acknowledge</span>
            </button>
            {urgentNotices.length > 1 && (
              <button
                onClick={onDismissAll}
                className="p-1 rounded-lg hover:bg-white/20 text-rose-100 hover:text-white transition-colors"
                title="Acknowledge all urgent alerts"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

