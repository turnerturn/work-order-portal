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
    'annually': 'Annually'
  };

  return frequencyMap[schedule.frequency] || 'Custom schedule';
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
