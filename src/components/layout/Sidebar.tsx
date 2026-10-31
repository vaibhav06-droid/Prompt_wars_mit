'use client';

import React from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck2,
  CheckSquare,
  Bot,
  Mail,
  Bell,
  BarChart3,
  Settings,
  PlusCircle,
  Sparkles,
  RotateCcw,
  Compass,
} from 'lucide-react';

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    setIsSmartInputOpen,
    setIsTourOpen,
    notifications,
    emails,
    items,
    resetToDemo,
  } = useCampus();

  const todayStr = new Date().toISOString().split('T')[0];
  const attentionTodayCount = items.filter(
    (i) => i.date === todayStr || i.submissionDeadline === todayStr || (i.isTask && i.status === 'pending')
  ).length;

  const unreadNotifsCount = notifications.filter((n) => !n.isRead && !n.isAcknowledged).length;
  const unreadEmailsCount = emails.filter((e) => !e.read).length;
  const pendingTasksCount = items.filter((i) => i.isTask && i.status !== 'completed').length;

  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: attentionTodayCount > 0 ? attentionTodayCount : undefined, badgeColor: 'bg-indigo-500 text-white' },
    { id: 'schedule', label: 'My Schedule', icon: CalendarDays },
    { id: 'events', label: 'Events & Notices', icon: CalendarCheck2 },
    { id: 'tasks', label: 'Tasks & Checklist', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined, badgeColor: 'bg-amber-500 text-white' },
    { id: 'assistant', label: 'AI Campus Assistant', icon: Bot, isAi: true },
    { id: 'inbox', label: 'Campus Inbox', icon: Mail, badge: unreadEmailsCount > 0 ? unreadEmailsCount : undefined, badgeColor: 'bg-blue-500 text-white' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined, badgeColor: 'bg-rose-500 text-white' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-campus-navy-950/90 flex flex-col justify-between shrink-0 h-screen sticky top-0 transition-colors z-20">
      {/* Top Branding & Primary Action */}
      <div className="p-4 space-y-4">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold text-lg">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                CampusPulse
              </span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold uppercase rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Your Campus, Organised by AI.
            </p>
          </div>
        </div>

        {/* Primary AI Smart Input Button */}
        <button
          id="smart-input-btn"
          onClick={() => setIsSmartInputOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all transform active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>+ AI Smart Input</span>
        </button>

        {/* Navigation list */}
        <nav className="space-y-1 pt-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : item.isAi
                        ? 'text-purple-500'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls: Tour & Demo Reset */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
        <button
          onClick={() => setIsTourOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Compass className="w-4 h-4 text-indigo-500" />
          <span>Interactive Tour</span>
        </button>

        <button
          onClick={() => {
            if (confirm('Reset workspace to fresh competition demo state with 12+ preloaded events & notices?')) {
              resetToDemo();
            }
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Data</span>
        </button>

        <div className="pt-2 px-2 text-[10px] text-slate-400 dark:text-slate-500 flex justify-between items-center">
          <span>v2.0 Competition Build</span>
          <span className="text-emerald-500 font-semibold">● Ready</span>
        </div>
      </div>
    </aside>
  );
}

