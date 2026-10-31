import React from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Mail, 
  Bell, 
  Moon, 
  Sun, 
  RotateCcw, 
  Activity,
  Layers
} from 'lucide-react';

export function Navbar({ 
  onOpenWhatsApp, 
  onOpenMail, 
  onOpenDigest, 
  onToggleNotifications,
  unreadAlertCount = 0,
  darkMode, 
  setDarkMode,
  onResetData
}) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 shadow-md shadow-indigo-500/20 text-white font-bold">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-slate-100 dark:to-indigo-300 bg-clip-text text-transparent">
                Campus Pulse
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                MIT 2026
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 font-medium">
              Transforming messy notices into intelligent action
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sync WhatsApp button */}
          <button
            onClick={onOpenWhatsApp}
            className="group relative inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Simulate incoming WhatsApp group notices"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:rotate-6 transition-transform" />
            <span className="hidden xs:inline">Sync WhatsApp</span>
            <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-600 text-white">
              4
            </span>
          </button>

          {/* Sync College Mail button */}
          <button
            onClick={onOpenMail}
            className="group relative inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Simulate official faculty circulars & email inbox"
          >
            <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:-rotate-6 transition-transform" />
            <span className="hidden xs:inline">Sync College Mail</span>
            <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
              3
            </span>
          </button>

          {/* Weekly Digest trigger (AI summary) */}
          <button
            onClick={onOpenDigest}
            className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-sm shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>Weekly Digest</span>
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 sm:mx-1" />

          {/* Persistent Notifications Bell */}
          <button
            onClick={onToggleNotifications}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View urgent alerts & reminders"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] font-bold text-white items-center justify-center">
                  {unreadAlertCount}
                </span>
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetData}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Reset to initial mock demo dataset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}

