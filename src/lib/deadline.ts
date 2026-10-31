import { CampusItem, DeadlineColor } from '@/types';
import { differenceInHours, differenceInDays, parseISO, format, isValid, isPast } from 'date-fns';

export interface DeadlineInfo {
  color: DeadlineColor;
  label: string;
  subLabel: string;
  hoursRemaining: number;
  daysRemaining: number;
  isOverdue: boolean;
  progressPercent: number; // 0 to 100
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
}

export function calculateDeadlineInfo(
  item: CampusItem,
  yellowWarningDays: number = 3,
  redWarningHours: number = 24
): DeadlineInfo {
  // If item is completed or archived
  if (item.status === 'completed' || item.status === 'archived') {
    return {
      color: 'GREY',
      label: item.status === 'completed' ? 'Completed' : 'Archived',
      subLabel: item.completedAt ? `Finished ${format(parseISO(item.completedAt), 'MMM d, h:mm a')}` : 'All done',
      hoursRemaining: 0,
      daysRemaining: 0,
      isOverdue: false,
      progressPercent: 100,
      badgeBg: 'bg-slate-100 dark:bg-slate-800/80',
      badgeText: 'text-slate-600 dark:text-slate-400',
      badgeBorder: 'border-slate-300 dark:border-slate-700',
      dotColor: 'bg-slate-400',
    };
  }

  // Determine effective target date
  const targetDateStr = item.submissionDeadline || item.registrationDeadline || item.date;
  let targetDateTime: Date;

  try {
    if (item.time && /^\d{1,2}:\d{2}/.test(item.time)) {
      targetDateTime = new Date(`${targetDateStr}T${item.time.padStart(5, '0')}:00`);
      if (!isValid(targetDateTime)) {
        targetDateTime = parseISO(targetDateStr);
      }
    } else {
      // Default to end of day 23:59:59
      targetDateTime = new Date(`${targetDateStr}T23:59:59`);
      if (!isValid(targetDateTime)) {
        targetDateTime = parseISO(targetDateStr);
      }
    }
  } catch {
    targetDateTime = new Date(targetDateStr);
  }

  const now = new Date();
  const diffHours = differenceInHours(targetDateTime, now);
  const diffDays = differenceInDays(targetDateTime, now);
  const overdue = diffHours < 0 || isPast(targetDateTime);

  // RED: Overdue or less than redWarningHours
  if (overdue) {
    const overdueDays = Math.abs(diffDays);
    const overdueHours = Math.abs(diffHours);
    const subLabel = overdueDays > 0 ? `Overdue by ${overdueDays}d` : `Overdue by ${overdueHours}h`;

    return {
      color: 'RED',
      label: 'Overdue',
      subLabel,
      hoursRemaining: diffHours,
      daysRemaining: diffDays,
      isOverdue: true,
      progressPercent: 100,
      badgeBg: 'bg-rose-500/10 dark:bg-rose-950/40',
      badgeText: 'text-rose-600 dark:text-rose-400',
      badgeBorder: 'border-rose-300 dark:border-rose-800/60',
      dotColor: 'bg-rose-500 animate-pulse',
    };
  }

  if (diffHours <= redWarningHours) {
    const subLabel = diffHours === 0 ? 'Due within an hour!' : `Due in ${diffHours}h`;
    return {
      color: 'RED',
      label: 'Imminent',
      subLabel,
      hoursRemaining: diffHours,
      daysRemaining: diffDays,
      isOverdue: false,
      progressPercent: Math.max(10, Math.min(95, 100 - Math.round((diffHours / redWarningHours) * 50))),
      badgeBg: 'bg-rose-500/10 dark:bg-rose-950/40',
      badgeText: 'text-rose-600 dark:text-rose-400',
      badgeBorder: 'border-rose-300 dark:border-rose-800/60',
      dotColor: 'bg-rose-500',
    };
  }

  // YELLOW: Approaching (within yellowWarningDays)
  const yellowHoursThreshold = yellowWarningDays * 24;
  if (diffHours <= yellowHoursThreshold) {
    return {
      color: 'YELLOW',
      label: 'Approaching',
      subLabel: diffDays === 1 ? 'Due tomorrow' : `Due in ${diffDays} days`,
      hoursRemaining: diffHours,
      daysRemaining: diffDays,
      isOverdue: false,
      progressPercent: Math.max(10, Math.min(80, 100 - Math.round((diffHours / yellowHoursThreshold) * 70))),
      badgeBg: 'bg-amber-500/10 dark:bg-amber-950/40',
      badgeText: 'text-amber-600 dark:text-amber-400',
      badgeBorder: 'border-amber-300 dark:border-amber-800/60',
      dotColor: 'bg-amber-500',
    };
  }

  // GREEN: Plenty of time
  return {
    color: 'GREEN',
    label: 'On Track',
    subLabel: `Due in ${diffDays} days`,
    hoursRemaining: diffHours,
    daysRemaining: diffDays,
    isOverdue: false,
    progressPercent: Math.max(5, Math.min(50, 100 - Math.round((diffDays / 14) * 80))),
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    badgeBorder: 'border-emerald-300 dark:border-emerald-800/60',
    dotColor: 'bg-emerald-500',
  };
}

