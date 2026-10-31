'use client';

import React, { useState } from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  Search,
  Bell,
  Sparkles,
  Sun,
  Moon,
  Compass,
  CheckCircle2,
  Clock,
  Calendar,
  X,
  ExternalLink,
} from 'lucide-react';
import { formatDateSafe, CATEGORY_META } from '@/lib/utils';
import { calculateDeadlineInfo } from '@/lib/deadline';

export function Header() {
  const {
    items,
    notifications,
    profile,
    updateProfile,
    setIsSmartInputOpen,
    setIsWeeklySummaryOpen,
    setIsTourOpen,
    activeTab,
    setActiveTab,
    acknowledgeNotification,
    setSelectedItemForDetail,
  } = useCampus();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead && !n.isAcknowledged);

  // Search matches
  const searchResults = searchTerm.trim().length > 1
    ? items.filter((it) => {
        const q = searchTerm.toLowerCase();
        return (
          it.title.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q) ||
          it.category.toLowerCase().includes(q) ||
          (it.venue && it.venue.toLowerCase().includes(q)) ||
          (it.sourceSnippet && it.sourceSnippet.toLowerCase().includes(q))
        );
      }).slice(0, 6)
    : [];

  const toggleTheme = () => {
    const nextTheme = profile.settings.theme === 'dark' ? 'light' : 'dark';
    updateProfile({ settings: { ...profile.settings, theme: nextTheme } });
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-campus-navy-900/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between transition-colors">
      {/* Left: Search Trigger & Mobile Brand */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 w-full max-w-md text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-campus-navy-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-500/80 transition-all shadow-sm group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          <span className="flex-1 text-left">Search events, notices, assignments...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs text-slate-400 bg-slate-200 dark:bg-slate-700 rounded font-mono">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* MANDATORY Weekly Summary Button */}
        <button
          id="weekly-summary-btn"
          onClick={() => setIsWeeklySummaryOpen(true)}
          className="relative inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md hover:shadow-indigo-500/25 hover:brightness-105 transition-all"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow text-amber-300" />
          <span className="hidden md:inline font-medium">What do I need to know this week?</span>
          <span className="md:hidden">Weekly AI</span>
        </button>

        {/* Guided Competition Tour */}
        <button
          onClick={() => setIsTourOpen(true)}
          title="Start Guided Demonstration Walkthrough"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Tour</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {profile.settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-campus-navy-900 animate-pulse" />
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-campus-navy-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-500">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setIsNotifDropdownOpen(false);
                    setActiveTab('notifications');
                  }}
                  className="text-xs text-indigo-500 hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700/40 max-h-72 overflow-y-auto mt-2 space-y-1">
                {notifications.slice(0, 4).map((notif) => (
                  <div key={notif.id} className="py-2.5 px-1 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{notif.title}</p>
                      {!notif.isAcknowledged && (
                        <button
                          onClick={() => acknowledgeNotification(notif.id)}
                          title="Acknowledge notification"
                          className="text-slate-400 hover:text-emerald-500"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{profile.name}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">NIT CSE • 3rd Year</p>
          </div>
        </div>
      </div>

      {/* Global Search Dialog Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-white dark:bg-campus-navy-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-700/60 gap-3">
              <Search className="w-5 h-5 text-indigo-500" />
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search across all notices, assignments, workshops, emails..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchTerm('');
                }}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2">Results ({searchResults.length})</p>
                  {searchResults.map((item) => {
                    const meta = CATEGORY_META[item.category];
                    const deadline = calculateDeadlineInfo(item);
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedItemForDetail(item);
                          setIsSearchOpen(false);
                        }}
                        className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.badgeBg} ${meta.badgeText}`}>
                            {meta.label}
                          </span>
                          <span className={`text-[11px] font-medium ${deadline.badgeText}`}>
                            {deadline.label} ({formatDateSafe(item.submissionDeadline || item.date)})
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              ) : searchTerm.trim().length > 1 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No matching campus items found for &quot;{searchTerm}&quot;
                </div>
              ) : (
                <div className="py-6 px-3 text-xs text-slate-400 space-y-2">
                  <p className="font-semibold text-slate-500 dark:text-slate-300">Quick Searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {['AI Workshop', 'Distributed Systems', 'Compiler Design', 'Hackathon', 'Cricket'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchTerm(tag)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

