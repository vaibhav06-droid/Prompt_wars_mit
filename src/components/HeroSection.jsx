import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  CheckCircle2, 
  ListTodo, 
  Layers, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { getUrgencyInfo } from '../utils/urgency';

export function HeroSection({ 
  notices = [], 
  onOpenDigest, 
  selectedCategory, 
  onSelectCategory 
}) {
  // Aggregate stats
  let totalTasks = 0;
  let completedTasks = 0;
  let activeUrgentCount = 0;
  const categoryCounts = {
    'All': notices.length,
    'Academic': 0,
    'Exam': 0,
    'Mess & Dining': 0,
    'Campus Event / Hackathon': 0,
    'Administrative': 0
  };

  notices.forEach(notice => {
    // Action tasks
    if (notice.actionItems && Array.isArray(notice.actionItems)) {
      totalTasks += notice.actionItems.length;
      completedTasks += notice.actionItems.filter(item => item.completed).length;
    }

    // Urgency check
    const urgency = getUrgencyInfo(notice.date);
    if (urgency.status === 'red' && !notice.isArchived) {
      activeUrgentCount++;
    }

    // Categories
    if (categoryCounts[notice.category] !== undefined) {
      categoryCounts[notice.category]++;
    }
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingTasks = Math.max(0, totalTasks - completedTasks);

  // SVG Progress Ring calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  let motivation = { text: 'Action Required', icon: AlertCircle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/50' };
  if (completionRate >= 80) {
    motivation = { text: 'Campus Legend', icon: Flame, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/50' };
  } else if (completionRate >= 50) {
    motivation = { text: 'Crushing It', icon: TrendingUp, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/50' };
  }

  const MotivationIcon = motivation.icon;

  return (
    <section className="pt-6 pb-2">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
        
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row with Greeting & Weekly Digest Callout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Student Performance & Activity Center
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${motivation.bg} ${motivation.color}`}>
                <MotivationIcon className="w-3.5 h-3.5" />
                <span>{motivation.text}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Campus Command Center
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Real-time synchronization across your WhatsApp groups, college notices, and academic milestones.
            </p>
          </div>

          {/* Prominent "What do I need to know this week?" Button */}
          <div className="shrink-0">
            <button
              onClick={onOpenDigest}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] group"
            >
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow group-hover:rotate-12 transition-transform" />
              <span>What do I need to know this week?</span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-white/20 text-indigo-50">
                AI Digest
              </span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          
          {/* Card 1: Overall Completion Rate with Circular Ring */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="7"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
                  {completionRate}%
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                  Done
                </span>
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Completion Rate
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {completedTasks} of {totalTasks} Tasks
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                {completedTasks > 0 ? `${completedTasks} checkmarks synced` : 'Get started below!'}
              </p>
            </div>
          </div>

          {/* Card 2: Active Urgent Deadlines (<24h) */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 shrink-0">
              <Clock className="w-7 h-7" />
              {activeUrgentCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                </span>
              )}
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Urgent Deadlines
              </div>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
                {activeUrgentCount}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Due within 24 hours
              </p>
            </div>
          </div>

          {/* Card 3: Pending vs Completed This Week */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 shrink-0">
              <ListTodo className="w-7 h-7" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Weekly Tasks
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {pendingTasks}
                </span>
                <span className="text-xs text-slate-400">pending</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 ml-auto">
                  {completedTasks} done
                </span>
              </div>
              {/* Mini progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Total Tracked Notices */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Layers className="w-7 h-7" />
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Campus Notices
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {notices.length}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Auto-parsed & structured
              </p>
            </div>
          </div>

        </div>

        {/* Category distribution breakdown pills */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/70 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-2 flex items-center gap-1">
            <span>Filter by Category:</span>
          </span>

          {Object.entries(categoryCounts).map(([cat, count]) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}

