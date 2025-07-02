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
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return dueDate > now && dueDate <= thirtyDaysFromNow;
  } catch {
    return false;
  }
};
