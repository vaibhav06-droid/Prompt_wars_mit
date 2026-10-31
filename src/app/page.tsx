'use client';

import React from 'react';
import { useCampus } from '@/context/CampusContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { AttentionToday } from '@/components/dashboard/AttentionToday';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { ScheduleCalendar } from '@/components/calendar/ScheduleCalendar';
import { EventsList } from '@/components/events/EventsList';
import { TasksChecklist } from '@/components/tasks/TasksChecklist';
import { AssistantView } from '@/components/ai/AssistantDrawer';
import { CampusInbox } from '@/components/inbox/CampusInbox';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { SettingsView } from '@/components/settings/SettingsView';
import { SmartInputModal } from '@/components/ai/SmartInputModal';
import { WeeklySummaryModal } from '@/components/dashboard/WeeklySummaryCard';
import { EventDetailModal } from '@/components/events/EventDetailModal';
import { QuickTourModal } from '@/components/layout/QuickTourModal';

export default function CampusPulseApp() {
  const { activeTab } = useCampus();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-campus-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <QuickStats />
              <AttentionToday />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                  <UpcomingDeadlines />
                </div>
              </div>
              <DashboardCharts />
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="animate-in fade-in duration-150">
              <ScheduleCalendar />
            </div>
          )}

          {activeTab === 'events' && (
            <div className="animate-in fade-in duration-150">
              <EventsList />
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="animate-in fade-in duration-150">
              <TasksChecklist />
            </div>
          )}

          {activeTab === 'assistant' && (
            <div className="animate-in fade-in duration-150">
              <AssistantView />
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="animate-in fade-in duration-150">
              <CampusInbox />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-in fade-in duration-150">
              <NotificationCenter />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="animate-in fade-in duration-150">
              <AnalyticsDashboard />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-150">
              <SettingsView />
            </div>
          )}
        </main>
      </div>

      {/* Global AI Modals */}
      <SmartInputModal />
      <WeeklySummaryModal />
      <EventDetailModal />
      <QuickTourModal />
    </div>
  );
}

