// Urgency calculation and date formatting utilities for Campus Pulse

export function getUrgencyInfo(dateString) {
  if (!dateString) {
    return {
      status: 'green',
      label: 'On Track',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700',
      dotColor: 'bg-emerald-500',
      diffHours: 999,
      isExpired: false,
      relativeText: 'No deadline set'
    };
  }

  const targetDate = new Date(dateString);
  if (isNaN(targetDate.getTime())) {
    return {
      status: 'green',
      label: 'On Track',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700',
      dotColor: 'bg-emerald-500',
      diffHours: 999,
      isExpired: false,
      relativeText: dateString
    };
  }

  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) {
    const absHours = Math.abs(diffHours);
    const expiredText = absHours < 24 
      ? `Expired ${Math.round(absHours)}h ago` 
      : `Expired ${Math.floor(absHours / 24)}d ago`;

    return {
      status: 'expired',
      label: 'Auto-Archived',
      badgeColor: 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
      dotColor: 'bg-slate-400',
      diffHours,
      isExpired: true,
      relativeText: expiredText
    };
  }

  if (diffHours <= 24) {
    const hoursLeft = Math.max(1, Math.round(diffHours));
    return {
      status: 'red',
      label: 'Urgent / Due Today',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-700 shadow-sm shadow-rose-200/50',
      dotColor: 'bg-rose-500 animate-ping',
      diffHours,
      isExpired: false,
      relativeText: hoursLeft === 1 ? 'Due in ~1 hour!' : `Due in ${hoursLeft} hours`
    };
  }

  if (diffHours <= 72) {
    const daysLeft = Math.ceil(diffHours / 24);
    return {
      status: 'yellow',
      label: 'Attention Needed',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700',
      dotColor: 'bg-amber-500',
      diffHours,
      isExpired: false,
      relativeText: `Due in ${daysLeft} days (${Math.round(diffHours)}h)`
    };
  }

  const daysLeft = Math.floor(diffHours / 24);
  return {
    status: 'green',
    label: 'On Track',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700',
    dotColor: 'bg-emerald-500',
    diffHours,
    isExpired: false,
    relativeText: `Due in ${daysLeft} days`
  };
}

export function formatEventDateTime(dateString, timeString) {
  if (!dateString) return 'Date TBD';
  
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return `${dateString} ${timeString || ''}`.trim();
    
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    const formattedDate = d.toLocaleDateString('en-US', options);

    if (timeString) {
      return `${formattedDate} • ${timeString}`;
    }

    // If dateString contains a specific time
    if (dateString.includes('T') && !dateString.endsWith('T00:00:00')) {
      const timeFormatted = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      return `${formattedDate} • ${timeFormatted}`;
    }

    return formattedDate;
  } catch (e) {
    return dateString;
  }
}

