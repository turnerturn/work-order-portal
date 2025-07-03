import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
  try {
    if (!dateString || dateString.trim() === '') {
      return 'Pending';
    }
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
};

export const formatDateTime = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy h:mm a');
  } catch {
    return 'Invalid date';
  }
};

export const formatRelativeTime = (dateString) => {
  try {
    if (!dateString || dateString.trim() === '') {
      return 'No due date set';
    }
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

export const isOverdue = (dueDateString) => {
  try {
    if (!dueDateString) return false; // Handle empty or undefined input
    const dueDate = parseISO(dueDateString);
    return dueDate < new Date();
  } catch {
    return false;
  }
};

export const isScheduled = (nextDueDateString) => {
  try {
    if (!nextDueDateString) return false; // Handle empty or undefined input
    const nextDueDate = parseISO(nextDueDateString);
    return nextDueDate > new Date();
  } catch {
    return false;
  }
};

export const isPending = (nextDueDateString) => {
  return !nextDueDateString || nextDueDateString.trim() === '';
};

export const getScheduleDescription = (schedule) => {
  const frequencyMap = {
    'daily': 'Daily',
    'weekly': 'Weekly',
    'monthly': 'Monthly',
    'quarterly': 'Quarterly',
    'annually': 'Annual'
  };

  return frequencyMap[schedule.frequency] || 'Custom';
};

export const getStatusColor = (status) => {
  const statusColors = {
    'completed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'overdue': 'bg-red-100 text-red-800',
    'scheduled': 'bg-blue-100 text-blue-800'
  };

  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (isOverdue, daysUntilDue) => {
  if (isOverdue) return 'text-red-600';
  if (daysUntilDue <= 7) return 'text-orange-600';
  if (daysUntilDue <= 30) return 'text-yellow-600';
  return 'text-green-600';
};

// New utility functions for dashboard stats
export const isThisWeek = (dateString) => {
  try {
    if (!dateString) return false;
    const date = parseISO(dateString);
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return date >= startOfWeek && date <= endOfWeek;
  } catch {
    return false;
  }
};

export const isNewWorkOrder = (createdDateString) => {
  try {
    if (!createdDateString) return false;
    const createdDate = parseISO(createdDateString);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return createdDate >= sevenDaysAgo;
  } catch {
    return false;
  }
};

export const isUpcoming = (dueDateString) => {
  try {
    if (!dueDateString) return false;
    const dueDate = parseISO(dueDateString);
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    return dueDate > now && dueDate <= endOfMonth;
  } catch {
    return false;
  }
};

// Calculate suggested next schedule date based on cadence and last activity
export const getSuggestedNextScheduleDate = (workOrder) => {
  try {
    if (!workOrder.activity || workOrder.activity.length === 0 || !workOrder.schedule.frequency) {
      return 'No activity history';
    }

    // Find the most recent completed activity before now
    const now = new Date();
    const completedActivities = workOrder.activity
      .filter(activity => activity.status === 'completed')
      .map(activity => ({
        ...activity,
        date: parseISO(activity.date)
      }))
      .filter(activity => activity.date <= now)
      .sort((a, b) => b.date - a.date);

    if (completedActivities.length === 0) {
      return 'No completed activities';
    }

    const lastActivity = completedActivities[0];
    const lastActivityDate = lastActivity.date;
    let suggestedDate = new Date(lastActivityDate);

    // Add time based on frequency
    switch (workOrder.schedule.frequency) {
      case 'daily':
        suggestedDate.setDate(suggestedDate.getDate() + 1);
        break;
      case 'weekly':
        suggestedDate.setDate(suggestedDate.getDate() + 7);
        break;
      case 'monthly':
        suggestedDate.setMonth(suggestedDate.getMonth() + 1);
        break;
      case 'quarterly':
        suggestedDate.setMonth(suggestedDate.getMonth() + 3);
        break;
      case 'annually':
        suggestedDate.setFullYear(suggestedDate.getFullYear() + 1);
        break;
      default:
        return 'Unknown frequency';
    }

    // If suggested date is in the past, keep adding intervals until we get a future date
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loops
    const currentTime = now.getTime(); // Get timestamp for comparison

    while (suggestedDate.getTime() <= currentTime && attempts < maxAttempts) {
      attempts++;
      switch (workOrder.schedule.frequency) {
        case 'daily':
          suggestedDate.setDate(suggestedDate.getDate() + 1);
          break;
        case 'weekly':
          suggestedDate.setDate(suggestedDate.getDate() + 7);
          break;
        case 'monthly':
          suggestedDate.setMonth(suggestedDate.getMonth() + 1);
          break;
        case 'quarterly':
          suggestedDate.setMonth(suggestedDate.getMonth() + 3);
          break;
        case 'annually':
          suggestedDate.setFullYear(suggestedDate.getFullYear() + 1);
          break;
        default:
          return 'Unknown frequency';
      }
    }

    return formatDate(suggestedDate.toISOString());
  } catch {
    return 'Unable to calculate';
  }
};

// Check if a work order is overdue based on its frequency and activity history
export const isWorkOrderOverdue = (workOrder) => {
  // No activity means overdue
  if (!workOrder.activity || workOrder.activity.length === 0) {
    return true;
  }

  // No completed activities means overdue
  const completedActivities = workOrder.activity.filter(activity => activity.status === 'completed');
  if (completedActivities.length === 0) {
    return true;
  }

  // Get the most recent completed activity
  const lastCompleted = completedActivities
    .map(activity => parseISO(activity.date))
    .sort((a, b) => b - a)[0];

  const now = new Date();
  let intervalDays = 0;

  // Determine interval based on frequency
  switch (workOrder.schedule?.frequency) {
    case 'daily': intervalDays = 1; break;
    case 'weekly': intervalDays = 7; break;
    case 'bi-weekly': intervalDays = 14; break;
    case 'monthly': intervalDays = 30; break;
    case 'quarterly': intervalDays = 90; break;
    case 'annually': intervalDays = 365; break;
    default: intervalDays = 7; // Default to weekly
  }

  const daysSinceLastCompleted = (now - lastCompleted) / (1000 * 60 * 60 * 24);
  return daysSinceLastCompleted > intervalDays;
};

// Check if a work order has upcoming activities scheduled in the next 2 weeks
export const isUpcomingInTwoWeeks = (workOrder) => {
  try {
    if (!workOrder.activity || workOrder.activity.length === 0) {
      return false;
    }

    const now = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

    // Check if there are any incomplete activities scheduled in the next 2 weeks
    return workOrder.activity.some(activity => {
      if (activity.status === 'completed') return false;

      try {
        const activityDate = parseISO(activity.date);
        return activityDate >= now && activityDate <= twoWeeksFromNow;
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
};
