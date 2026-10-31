import { CampusItem, WeeklyDigest } from '@/types';
import { format, parseISO, isWithinInterval, addDays, startOfDay, endOfDay } from 'date-fns';

export function generateWeeklySummary(items: CampusItem[], baseDate = new Date()): WeeklyDigest {
  const weekStart = startOfDay(baseDate);
  const weekEnd = endOfDay(addDays(baseDate, 7));

  const itemsThisWeek = items.filter((item) => {
    try {
      const targetDate = parseISO(item.submissionDeadline || item.registrationDeadline || item.date);
      return isWithinInterval(targetDate, { start: weekStart, end: weekEnd });
    } catch {
      return false;
    }
  });

  const eventsThisWeek = itemsThisWeek.filter((item) => item.isEvent);
  const assignmentsThisWeek = itemsThisWeek.filter((item) => item.category === 'assignment' && item.status !== 'completed');
  const examsThisWeek = itemsThisWeek.filter((item) => item.category === 'examination');
  const deadlinesThisWeek = itemsThisWeek.filter(
    (item) => item.category === 'registration_deadline' || Boolean(item.registrationDeadline)
  );

  const pendingTasks = items.filter((item) => item.isTask && item.status !== 'completed');
  const overdueTasks = pendingTasks.filter((item) => {
    try {
      const d = parseISO(item.submissionDeadline || item.date);
      return d < weekStart;
    } catch {
      return false;
    }
  });

  // Urgent alerts
  const urgentAlerts: string[] = [];
  if (overdueTasks.length > 0) {
    urgentAlerts.push(`⚠️ You have ${overdueTasks.length} overdue task(s), including "${overdueTasks[0].title}".`);
  }
  if (assignmentsThisWeek.length > 0) {
    urgentAlerts.push(`📌 Assignment "${assignmentsThisWeek[0].title}" requires submission this week.`);
  }
  if (examsThisWeek.length > 0) {
    urgentAlerts.push(`🎓 Examination scheduled: "${examsThisWeek[0].title}" on ${examsThisWeek[0].date}.`);
  }
  if (deadlinesThisWeek.length > 0) {
    urgentAlerts.push(`⏰ Registration closing: "${deadlinesThisWeek[0].title}" on ${deadlinesThisWeek[0].registrationDeadline || deadlinesThisWeek[0].date}.`);
  }

  // Recommended priorities
  const recommendedPriorities: string[] = [];
  if (overdueTasks.length > 0) {
    recommendedPriorities.push(`1. Clear overdue task "${overdueTasks[0].title}" immediately to avoid penalties.`);
  }
  if (assignmentsThisWeek.length > 0) {
    recommendedPriorities.push(
      `2. Finish code and documentation for "${assignmentsThisWeek[0].title}" (due ${assignmentsThisWeek[0].submissionDeadline || assignmentsThisWeek[0].date}).`
    );
  }
  if (deadlinesThisWeek.length > 0) {
    recommendedPriorities.push(
      `3. Complete registration for "${deadlinesThisWeek[0].title}" before portal lockout.`
    );
  }
  if (eventsThisWeek.length > 0) {
    recommendedPriorities.push(`4. Prepare requirements for "${eventsThisWeek[0].title}" (${eventsThisWeek[0].venue || 'Auditorium'}).`);
  }

  // Natural language paragraph matching competition example
  const totalEvents = eventsThisWeek.length;
  const totalAssignments = assignmentsThisWeek.length;
  const totalDeadlines = deadlinesThisWeek.length;
  
  let overviewSummary = `You have ${totalEvents} upcoming college ${totalEvents === 1 ? 'event' : 'events'}, ${totalAssignments} ${totalAssignments === 1 ? 'assignment' : 'assignments'} and ${totalDeadlines} registration ${totalDeadlines === 1 ? 'deadline' : 'deadlines'} this week.`;
  
  if (assignmentsThisWeek.length > 0) {
    overviewSummary += ` Your "${assignmentsThisWeek[0].title}" is scheduled for ${assignmentsThisWeek[0].submissionDeadline || assignmentsThisWeek[0].date}.`;
  }
  if (deadlinesThisWeek.length > 0) {
    overviewSummary += ` The "${deadlinesThisWeek[0].title}" registration closes on ${deadlinesThisWeek[0].registrationDeadline || deadlinesThisWeek[0].date}.`;
  }
  overviewSummary += ' Make sure to complete your high priority submissions and mandatory workshops first.';

  return {
    id: `digest-${Date.now()}`,
    generatedAt: format(new Date(), 'PPpp'),
    title: 'Your Campus Week',
    overviewSummary,
    eventsThisWeek,
    assignmentsThisWeek,
    examsThisWeek,
    deadlinesThisWeek,
    pendingTasksCount: pendingTasks.length,
    urgentAlerts,
    recommendedPriorities,
  };
}

