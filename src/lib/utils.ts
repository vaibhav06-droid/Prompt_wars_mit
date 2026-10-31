import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CategoryType, PriorityLevel } from '@/types';
import { format, parseISO, isValid } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateSafe(dateStr?: string, formatPattern = 'MMM d, yyyy'): string {
  if (!dateStr) return 'Unspecified';
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return dateStr;
    return format(d, formatPattern);
  } catch {
    return dateStr;
  }
}

export const CATEGORY_META: Record<
  CategoryType,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    badgeBg: string;
    badgeText: string;
    icon: string;
  }
> = {
  college_event: {
    label: 'College Event',
    color: '#6366F1',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
    icon: 'Calendar',
  },
  workshop: {
    label: 'Workshop',
    color: '#06B6D4',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/50',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
    icon: 'Cpu',
  },
  seminar: {
    label: 'Seminar',
    color: '#8B5CF6',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/50',
    badgeText: 'text-purple-600 dark:text-purple-400',
    icon: 'Presentation',
  },
  assignment: {
    label: 'Assignment',
    color: '#F59E0B',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/50',
    badgeText: 'text-amber-600 dark:text-amber-400',
    icon: 'FileCheck',
  },
  examination: {
    label: 'Examination',
    color: '#EF4444',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    badgeBg: 'bg-red-50 dark:bg-red-950/50',
    badgeText: 'text-red-600 dark:text-red-400',
    icon: 'GraduationCap',
  },
  registration_deadline: {
    label: 'Registration',
    color: '#EC4899',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    badgeBg: 'bg-pink-50 dark:bg-pink-950/50',
    badgeText: 'text-pink-600 dark:text-pink-400',
    icon: 'Clock',
  },
  cultural_festival: {
    label: 'Cultural Fest',
    color: '#F97316',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    badgeBg: 'bg-orange-50 dark:bg-orange-950/50',
    badgeText: 'text-orange-600 dark:text-orange-400',
    icon: 'Music',
  },
  sports_event: {
    label: 'Sports',
    color: '#10B981',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    icon: 'Trophy',
  },
  announcement: {
    label: 'Announcement',
    color: '#3B82F6',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/50',
    badgeText: 'text-blue-600 dark:text-blue-400',
    icon: 'Bell',
  },
  personal_task: {
    label: 'Personal Task',
    color: '#14B8A6',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/50',
    badgeText: 'text-teal-600 dark:text-teal-400',
    icon: 'CheckSquare',
  },
  other: {
    label: 'Reminder',
    color: '#64748B',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30',
    badgeBg: 'bg-slate-50 dark:bg-slate-950/50',
    badgeText: 'text-slate-600 dark:text-slate-400',
    icon: 'Bookmark',
  },
};

export const PRIORITY_META: Record<
  PriorityLevel,
  { label: string; badgeBg: string; badgeText: string; dotColor: string }
> = {
  high: {
    label: 'High Priority',
    badgeBg: 'bg-rose-500/10 dark:bg-rose-950/40',
    badgeText: 'text-rose-600 dark:text-rose-400',
    dotColor: 'bg-rose-500',
  },
  medium: {
    label: 'Medium',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-950/40',
    badgeText: 'text-amber-600 dark:text-amber-400',
    dotColor: 'bg-amber-500',
  },
  low: {
    label: 'Low',
    badgeBg: 'bg-slate-500/10 dark:bg-slate-800/40',
    badgeText: 'text-slate-600 dark:text-slate-400',
    dotColor: 'bg-slate-400',
  },
};

