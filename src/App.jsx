import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PersistentNotificationBanner } from './components/PersistentNotificationBanner';
import { HeroSection } from './components/HeroSection';
import { ParserInput } from './components/ParserInput';
import { NoticeList } from './components/NoticeList';
import { WhatsAppSyncModal } from './components/WhatsAppSyncModal';
import { CollegeMailSyncModal } from './components/CollegeMailSyncModal';
import { WeeklyDigestModal } from './components/WeeklyDigestModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { EditNoticeModal } from './components/EditNoticeModal';
import { loadNotices, saveNotices, resetNoticesToDefault, loadSettings, saveSettings } from './utils/storage';
import { getUrgencyInfo } from './utils/urgency';
import { CheckCircle2, Heart } from 'lucide-react';

export function App() {
  const [notices, setNotices] = useState(() => loadNotices());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [darkMode, setDarkMode] = useState(() => loadSettings().darkMode || false);

  // Modals state
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isDigestOpen, setIsDigestOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to localStorage
  useEffect(() => {
    saveNotices(notices);
  }, [notices]);

  // Dark mode effect
  useEffect(() => {
    saveSettings({ darkMode, soundEnabled: true });
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Compute urgent unacknowledged notices for persistent banner
  const urgentUnacknowledgedNotices = notices.filter(n => {
    const urg = getUrgencyInfo(n.date);
    return urg.status === 'red' && !n.isArchived && !n.isAcknowledged;
  });

  // Action handlers
  const handleAddNotice = (newNotice) => {
    setNotices(prev => [newNotice, ...prev]);
    showToast(`Added "${newNotice.title}" to dashboard!`);
  };

  const handleToggleTask = (noticeId, taskId) => {
    setNotices(prev => prev.map(notice => {
      if (notice.id !== noticeId) return notice;
      const updatedTasks = notice.actionItems.map(task => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      return { ...notice, actionItems: updatedTasks };
    }));
  };

  const handleAddTask = (noticeId, taskText) => {
    setNotices(prev => prev.map(notice => {
      if (notice.id !== noticeId) return notice;
      const newTask = {
        id: 'task_' + Date.now(),
        text: taskText,
        completed: false
      };
      return {
        ...notice,
        actionItems: [...(notice.actionItems || []), newTask]
      };
    }));
    showToast('Checklist item added!');
  };

  const handleTogglePin = (noticeId) => {
    setNotices(prev => prev.map(n => {
      if (n.id === noticeId) {
        const nextState = !n.isPinned;
        showToast(nextState ? 'Notice pinned to top' : 'Notice unpinned');
        return { ...n, isPinned: nextState };
      }
      return n;
    }));
  };

  const handleToggleArchive = (noticeId) => {
    setNotices(prev => prev.map(n => {
      if (n.id === noticeId) {
        const nextState = !n.isArchived;
        showToast(nextState ? 'Notice archived' : 'Notice restored');
        return { ...n, isArchived: nextState };
      }
      return n;
    }));
  };

  const handleDeleteNotice = (noticeId) => {
    setNotices(prev => prev.filter(n => n.id !== noticeId));
    showToast('Notice removed');
  };

  const handleSaveEditedNotice = (updatedNotice) => {
    setNotices(prev => prev.map(n => n.id === updatedNotice.id ? updatedNotice : n));
    showToast('Notice updated successfully!');
  };

  const handleAcknowledgeNotice = (noticeId) => {
    setNotices(prev => prev.map(n => {
      if (n.id === noticeId) return { ...n, isAcknowledged: true };
      return n;
    }));
    showToast('Alert acknowledged');
  };

  const handleAcknowledgeAll = () => {
    setNotices(prev => prev.map(n => ({ ...n, isAcknowledged: true })));
    showToast('All alerts acknowledged!');
  };

  const handleResetData = () => {
    if (window.confirm('Reset Campus Pulse to initial demo state with fresh notices?')) {
      const fresh = resetNoticesToDefault();
      setNotices(fresh);
      setSelectedCategory('All');
      showToast('Dashboard reset to initial mock demo dataset');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. Top Navbar */}
      <Navbar
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenMail={() => setIsMailOpen(true)}
        onOpenDigest={() => setIsDigestOpen(true)}
        onToggleNotifications={() => setIsNotificationsOpen(true)}
        unreadAlertCount={urgentUnacknowledgedNotices.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onResetData={handleResetData}
      />

      {/* 2. Persistent Notification Banner (Urgent active notices) */}
      <PersistentNotificationBanner
        urgentNotices={urgentUnacknowledgedNotices}
        onAcknowledgeNotice={handleAcknowledgeNotice}
        onDismissAll={handleAcknowledgeAll}
        onSelectNotice={(notice) => setEditingNotice(notice)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
        
        {/* 3. Hero Section: Student Performance & Activity Center */}
        <HeroSection
          notices={notices}
          onOpenDigest={() => setIsDigestOpen(true)}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* 4. Smart Raw Notice Ingestion Bar */}
        <ParserInput
          onAddNotice={handleAddNotice}
        />

        {/* 5. Notice Cards & List Views */}
        <NoticeList
          notices={notices}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onTogglePin={handleTogglePin}
          onToggleArchive={handleToggleArchive}
          onDeleteNotice={handleDeleteNotice}
          onEditNotice={(n) => setEditingNotice(n)}
          onAcknowledge={handleAcknowledgeNotice}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onResetFilters={() => setSelectedCategory('All')}
        />

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white">Campus Pulse</span>
            <span>• MIT Student Command Center</span>
            <span>• MIT License</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Built for Prompt Wars 2026 with React & Tailwind CSS</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <WhatsAppSyncModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        onImportNotice={handleAddNotice}
      />

      <CollegeMailSyncModal
        isOpen={isMailOpen}
        onClose={() => setIsMailOpen(false)}
        onImportNotice={handleAddNotice}
      />

      <WeeklyDigestModal
        isOpen={isDigestOpen}
        onClose={() => setIsDigestOpen(false)}
        notices={notices}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notices={notices}
        onAcknowledgeNotice={handleAcknowledgeNotice}
        onAcknowledgeAll={handleAcknowledgeAll}
        onSelectNotice={(notice) => setEditingNotice(notice)}
      />

      <EditNoticeModal
        isOpen={!!editingNotice}
        onClose={() => setEditingNotice(null)}
        notice={editingNotice}
        onSave={handleSaveEditedNotice}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl font-semibold text-xs sm:text-sm animate-slide-down border border-slate-700 dark:border-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
export default App;

