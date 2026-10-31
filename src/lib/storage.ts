import { CampusItem, MockEmail, NotificationItem, UserProfile, WeeklyDigest } from '@/types';
import { INITIAL_CAMPUS_ITEMS, INITIAL_USER_PROFILE, MOCK_EMAILS } from '@/data/seed';

const STORAGE_KEYS = {
  ITEMS: 'campuspulse_items_v2',
  PROFILE: 'campuspulse_profile_v2',
  NOTIFICATIONS: 'campuspulse_notifications_v2',
  EMAILS: 'campuspulse_emails_v2',
  LAST_DIGEST: 'campuspulse_last_digest_v2',
  TOUR_COMPLETED: 'campuspulse_tour_completed_v2',
};

export function loadItems(): CampusItem[] {
  if (typeof window === 'undefined') return INITIAL_CAMPUS_ITEMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) {
      saveItems(INITIAL_CAMPUS_ITEMS);
      return INITIAL_CAMPUS_ITEMS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CAMPUS_ITEMS;
  }
}

export function saveItems(items: CampusItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save items to localStorage', err);
  }
}

export function loadProfile(): UserProfile {
  if (typeof window === 'undefined') return INITIAL_USER_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      saveProfile(INITIAL_USER_PROFILE);
      return INITIAL_USER_PROFILE;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USER_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile to localStorage', err);
  }
}

export function loadEmails(): MockEmail[] {
  if (typeof window === 'undefined') return MOCK_EMAILS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMAILS);
    if (!raw) {
      saveEmails(MOCK_EMAILS);
      return MOCK_EMAILS;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_EMAILS;
  }
}

export function saveEmails(emails: MockEmail[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(emails));
  } catch (err) {
    console.error('Failed to save emails to localStorage', err);
  }
}

export function loadNotifications(items: CampusItem[]): NotificationItem[] {
  if (typeof window === 'undefined') return generateInitialNotifications(items);
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      const generated = generateInitialNotifications(items);
      saveNotifications(generated);
      return generated;
    }
    return JSON.parse(raw);
  } catch {
    return generateInitialNotifications(items);
  }
}

export function saveNotifications(notifications: NotificationItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (err) {
    console.error('Failed to save notifications to localStorage', err);
  }
}

export function generateInitialNotifications(items: CampusItem[]): NotificationItem[] {
  const notifs: NotificationItem[] = [];

  // Urgent assignment notification
  const urgentAssignment = items.find((i) => i.category === 'assignment' && i.status !== 'completed');
  if (urgentAssignment) {
    notifs.push({
      id: 'notif-1',
      title: 'Assignment Due Tonight!',
      message: `"${urgentAssignment.title}" is due today at ${urgentAssignment.time || '11:59 PM'}. Ensure report is submitted on LMS.`,
      type: 'assignment',
      priority: 'high',
      targetId: urgentAssignment.id,
      timestamp: new Date().toISOString(),
      isRead: false,
      isAcknowledged: false,
    });
  }

  // Workshop notification
  const workshop = items.find((i) => i.category === 'workshop');
  if (workshop) {
    notifs.push({
      id: 'notif-2',
      title: 'Compulsory AI Workshop Tomorrow',
      message: `"${workshop.title}" begins at ${workshop.time} in ${workshop.venue}. Attendance is mandatory.`,
      type: 'event',
      priority: 'high',
      targetId: workshop.id,
      timestamp: new Date().toISOString(),
      isRead: false,
      isAcknowledged: false,
    });
  }

  // Hackathon registration
  const reg = items.find((i) => i.category === 'registration_deadline');
  if (reg) {
    notifs.push({
      id: 'notif-3',
      title: 'Registration Closing Soon',
      message: `Last date to register for "${reg.title}" is approaching. Form closes on ${reg.registrationDeadline || reg.date}.`,
      type: 'deadline',
      priority: 'medium',
      targetId: reg.id,
      timestamp: new Date().toISOString(),
      isRead: true,
      isAcknowledged: false,
    });
  }

  return notifs;
}

export function resetAllStorageToDefault(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_CAMPUS_ITEMS));
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_USER_PROFILE));
  localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(MOCK_EMAILS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(generateInitialNotifications(INITIAL_CAMPUS_ITEMS)));
  localStorage.removeItem(STORAGE_KEYS.LAST_DIGEST);
}

