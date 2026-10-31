'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CampusItem,
  CategoryType,
  MockEmail,
  NotificationItem,
  PriorityLevel,
  UserProfile,
  WeeklyDigest,
} from '@/types';
import {
  loadItems,
  saveItems,
  loadProfile,
  saveProfile,
  loadEmails,
  saveEmails,
  loadNotifications,
  saveNotifications,
  resetAllStorageToDefault,
} from '@/lib/storage';
import { generateWeeklySummary } from '@/lib/ai/weeklySummary';
import confetti from 'canvas-confetti';

interface CampusContextType {
  items: CampusItem[];
  profile: UserProfile;
  notifications: NotificationItem[];
  emails: MockEmail[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  categoryFilter: CategoryType | 'all';
  setCategoryFilter: (cat: CategoryType | 'all') => void;
  priorityFilter: PriorityLevel | 'all';
  setPriorityFilter: (p: PriorityLevel | 'all') => void;
  isSmartInputOpen: boolean;
  setIsSmartInputOpen: (open: boolean) => void;
  isWeeklySummaryOpen: boolean;
  setIsWeeklySummaryOpen: (open: boolean) => void;
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
  weeklyDigest: WeeklyDigest | null;
  selectedItemForDetail: CampusItem | null;
  setSelectedItemForDetail: (item: CampusItem | null) => void;
  lastCompletedTask: { item: CampusItem; timestamp: number } | null;

  // Actions
  addItem: (item: Partial<CampusItem>) => CampusItem;
  updateItem: (id: string, updates: Partial<CampusItem>) => void;
  deleteItem: (id: string) => void;
  toggleTask: (id: string) => void;
  undoLastTaskCompletion: () => void;
  toggleSubTask: (itemId: string, subTaskId: string) => void;
  snoozeItem: (id: string, hours: number) => void;
  acknowledgeNotification: (id: string) => void;
  dismissNotification: (id: string) => void;
  snoozeNotification: (id: string, hours: number) => void;
  extractEmailToItem: (emailId: string) => CampusItem | null;
  refreshWeeklySummary: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  resetToDemo: () => void;
  triggerBrowserNotification: (title: string, options?: NotificationOptions) => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export function CampusProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CampusItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>(loadProfile());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [emails, setEmails] = useState<MockEmail[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | 'all'>('all');
  const [isSmartInputOpen, setIsSmartInputOpen] = useState<boolean>(false);
  const [isWeeklySummaryOpen, setIsWeeklySummaryOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [weeklyDigest, setWeeklyDigest] = useState<WeeklyDigest | null>(null);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<CampusItem | null>(null);
  const [lastCompletedTask, setLastCompletedTask] = useState<{ item: CampusItem; timestamp: number } | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Hydrate on mount
  useEffect(() => {
    const loadedItems = loadItems();
    const loadedProf = loadProfile();
    const loadedNotifs = loadNotifications(loadedItems);
    const loadedEms = loadEmails();

    setItems(loadedItems);
    setProfile(loadedProf);
    setNotifications(loadedNotifs);
    setEmails(loadedEms);
    setWeeklyDigest(generateWeeklySummary(loadedItems));
    setIsHydrated(true);

    // Apply dark/light class
    if (loadedProf.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Save changes to storage
  useEffect(() => {
    if (isHydrated) {
      saveItems(items);
    }
  }, [items, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      saveProfile(profile);
      if (profile.settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [profile, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      saveNotifications(notifications);
    }
  }, [notifications, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      saveEmails(emails);
    }
  }, [emails, isHydrated]);

  const triggerBrowserNotification = (title: string, options?: NotificationOptions) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(title, options);
          }
        });
      }
    }
  };

  const addItem = (partial: Partial<CampusItem>): CampusItem => {
    const newItem: CampusItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: partial.title || 'Untitled Campus Item',
      description: partial.description || '',
      date: partial.date || new Date().toISOString().split('T')[0],
      time: partial.time || '10:00 AM',
      venue: partial.venue || 'Campus Premises',
      category: partial.category || 'college_event',
      priority: partial.priority || 'medium',
      status: partial.status || 'pending',
      source: partial.source || 'manual',
      sourceSender: partial.sourceSender,
      sourceRawText: partial.sourceRawText,
      sourceSnippet: partial.sourceSnippet,
      isEvent: partial.isEvent ?? true,
      isTask: partial.isTask ?? false,
      attendance: partial.attendance || 'unspecified',
      registrationDeadline: partial.registrationDeadline,
      submissionDeadline: partial.submissionDeadline,
      instructions: partial.instructions || [],
      benefits: partial.benefits || [],
      actionRequired: partial.actionRequired,
      subtasks: partial.subtasks || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems((prev) => [newItem, ...prev]);

    // Also auto-generate a notification if high priority
    if (newItem.priority === 'high' || newItem.category === 'assignment' || newItem.category === 'workshop') {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `New ${newItem.category.replace('_', ' ')}: ${newItem.title}`,
        message: `${newItem.title} scheduled for ${newItem.date} at ${newItem.time || 'TBD'}.`,
        type: newItem.category === 'assignment' ? 'assignment' : newItem.category === 'examination' ? 'exam' : 'event',
        priority: newItem.priority,
        targetId: newItem.id,
        timestamp: new Date().toISOString(),
        isRead: false,
        isAcknowledged: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      triggerBrowserNotification(newNotif.title, { body: newNotif.message });
    }

    return newItem;
  };

  const updateItem = (id: string, updates: Partial<CampusItem>) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...updates, updatedAt: new Date().toISOString() } : it))
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (selectedItemForDetail?.id === id) {
      setSelectedItemForDetail(null);
    }
  };

  const toggleTask = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const willComplete = it.status !== 'completed';
        const updatedStatus = willComplete ? 'completed' : 'pending';
        const updatedItem = {
          ...it,
          status: updatedStatus as CampusItem['status'],
          completedAt: willComplete ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString(),
        };

        if (willComplete) {
          // Store for undo
          setLastCompletedTask({ item: it, timestamp: Date.now() });
          // Fire celebration confetti
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
            });
          } catch {
            // ignore in environments without canvas
          }
        }
        return updatedItem;
      })
    );
  };

  const undoLastTaskCompletion = () => {
    if (!lastCompletedTask) return;
    updateItem(lastCompletedTask.item.id, {
      status: lastCompletedTask.item.status,
      completedAt: undefined,
    });
    setLastCompletedTask(null);
  };

  const toggleSubTask = (itemId: string, subTaskId: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId || !it.subtasks) return it;
        const updatedSubtasks = it.subtasks.map((st) =>
          st.id === subTaskId ? { ...st, completed: !st.completed } : st
        );
        return {
          ...it,
          subtasks: updatedSubtasks,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const snoozeItem = (id: string, hours: number) => {
    const snoozeDate = new Date(Date.now() + hours * 3600000).toISOString();
    updateItem(id, { snoozedUntil: snoozeDate });
  };

  const acknowledgeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isAcknowledged: true, isRead: true } : n))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const snoozeNotification = (id: string, hours: number) => {
    const snoozeDate = new Date(Date.now() + hours * 3600000).toISOString();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, snoozedUntil: snoozeDate, isRead: true } : n))
    );
  };

  const extractEmailToItem = (emailId: string): CampusItem | null => {
    const email = emails.find((e) => e.id === emailId);
    if (!email) return null;

    const newItem = addItem({
      title: email.subject.replace(/^(Urgent:\s*|Notice:\s*|Final Schedule:\s*)/i, '').trim(),
      description: email.body,
      date: new Date().toISOString().split('T')[0],
      venue: 'Online / Campus Campus',
      category: email.category,
      priority: 'high',
      source: 'gmail',
      sourceSender: email.fromName,
      sourceRawText: email.body,
      sourceSnippet: `Email from ${email.fromName}: "${email.subject}"`,
      isEvent: email.category !== 'assignment',
      isTask: email.category === 'assignment' || email.category === 'registration_deadline',
    });

    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, read: true, extractedItemId: newItem.id } : e))
    );

    return newItem;
  };

  const refreshWeeklySummary = () => {
    const digest = generateWeeklySummary(items);
    setWeeklyDigest(digest);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
      settings: {
        ...prev.settings,
        ...(updates.settings || {}),
      },
    }));
  };

  const resetToDemo = () => {
    resetAllStorageToDefault();
    const reloadedItems = loadItems();
    setItems(reloadedItems);
    setProfile(loadProfile());
    setNotifications(loadNotifications(reloadedItems));
    setEmails(loadEmails());
    setWeeklyDigest(generateWeeklySummary(reloadedItems));
    setSelectedItemForDetail(null);
  };

  return (
    <CampusContext.Provider
      value={{
        items,
        profile,
        notifications,
        emails,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        priorityFilter,
        setPriorityFilter,
        isSmartInputOpen,
        setIsSmartInputOpen,
        isWeeklySummaryOpen,
        setIsWeeklySummaryOpen,
        isTourOpen,
        setIsTourOpen,
        weeklyDigest,
        selectedItemForDetail,
        setSelectedItemForDetail,
        lastCompletedTask,
        addItem,
        updateItem,
        deleteItem,
        toggleTask,
        undoLastTaskCompletion,
        toggleSubTask,
        snoozeItem,
        acknowledgeNotification,
        dismissNotification,
        snoozeNotification,
        extractEmailToItem,
        refreshWeeklySummary,
        updateProfile,
        resetToDemo,
        triggerBrowserNotification,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
}

