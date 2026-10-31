// LocalStorage State Management & Auto-Archive Synchronization

import { getInitialMockNotices } from './mockData';
import { getUrgencyInfo } from './urgency';

const STORAGE_KEY = 'campus_pulse_notices_v2';
const SETTINGS_KEY = 'campus_pulse_settings_v1';

export function loadNotices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialMockNotices();
      saveNotices(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = getInitialMockNotices();
      saveNotices(initial);
      return initial;
    }

    // Run Auto-Resolve Rule:
    // If an event has passed without user interaction, mark its status as "Auto-Archived"
    const now = new Date();
    const updated = parsed.map(notice => {
      const urgency = getUrgencyInfo(notice.date);
      if (urgency.isExpired && !notice.isArchived) {
        // Check if all action items were left unchecked
        const hasUserInteraction = notice.actionItems?.some(a => a.completed);
        if (!hasUserInteraction) {
          return {
            ...notice,
            isArchived: true,
            autoResolved: true
          };
        }
      }
      return notice;
    });

    return updated;
  } catch (e) {
    console.error('Failed to load notices from localStorage:', e);
    return getInitialMockNotices();
  }
}

export function saveNotices(notices) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
  } catch (e) {
    console.error('Failed to save notices to localStorage:', e);
  }
}

export function resetNoticesToDefault() {
  const fresh = getInitialMockNotices();
  saveNotices(fresh);
  return fresh;
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { darkMode: false, soundEnabled: true };
  } catch (e) {
    return { darkMode: false, soundEnabled: true };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

