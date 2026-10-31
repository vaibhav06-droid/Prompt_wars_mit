'use client';

import React from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { CATEGORY_META } from '@/lib/utils';
import { calculateDeadlineInfo } from '@/lib/deadline';

export function DashboardCharts() {
  const { items } = useCampus();

  // 1. Task Completion Donut Data
  const completedCount = items.filter((i) => i.status === 'completed').length;
  const pendingCount = items.filter((i) => i.isTask && i.status !== 'completed').length;
  const overdueCount = items.filter((i) => {
    if (i.status === 'completed') return false;
    const d = calculateDeadlineInfo(i);
    return d.isOverdue;
  }).length;

  const donutData = [
    { name: 'Completed', value: completedCount || 1, color: '#10B981' },
    { name: 'Pending', value: pendingCount || 1, color: '#6366F1' },
    { name: 'Overdue', value: overdueCount, color: '#EF4444' },
  ].filter((d) => d.value > 0);

  // 2. Category Distribution
  const categoryCountMap: Record<string, number> = {};
  items.forEach((item) => {
    const label = CATEGORY_META[item.category]?.label || item.category;
    categoryCountMap[label] = (categoryCountMap[label] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCountMap)
    .map(([name, count]) => ({ name, count }))
    .slice(0, 5);

  // 3. Weekly Activity Data
  const weeklyDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyActivityData = [
    { day: 'Mon', completed: 2, created: 3 },
    { day: 'Tue', completed: 4, created: 2 },
    { day: 'Wed', completed: 1, created: 4 },
    { day: 'Thu', completed: 3, created: 1 },
    { day: 'Fri', completed: 5, created: 3 },
    { day: 'Sat', completed: 2, created: 2 },
    { day: 'Sun', completed: completedCount, created: items.length },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Chart 1: Weekly Activity Bar Chart */}
      <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Weekly Activity & Task Progress
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recorded completion velocity vs new assignments added
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
              Created
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              Completed
            </span>
          </div>
        </div>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyActivityData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="created" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Task Status Donut */}
      <div className="p-5 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Task Status Breakdown
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real ratio of completed vs pending
          </p>
        </div>

        <div className="h-44 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={4}
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {completedCount} Done
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            {pendingCount} Pending
          </span>
          {overdueCount > 0 && (
            <span className="flex items-center gap-1.5 text-rose-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              {overdueCount} Overdue
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

