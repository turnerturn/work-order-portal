import {
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  FiberNew as NewIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { isWorkOrderOverdue } from '../utils/dateUtils';
import ScheduleModal from './ScheduleModal';

const WorkOrderCard = ({ workOrder, onViewDetails, onSchedule, compact = false }) => {
  const [scheduleModalOpen, setScheduleModalOpen] = React.useState(false);

  const handleSchedule = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setScheduleModalOpen(true);
  };

  const handleScheduleSubmit = (date) => {
    setScheduleModalOpen(false);
    if (onSchedule) onSchedule(date);
  };

  // Helper function to determine work order status
  const getWorkOrderStatus = (workOrder) => {
    // Check if it's a new work order (created within last 7 days)
    const createdDate = new Date(workOrder['created-date']);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    if (createdDate >= sevenDaysAgo) {
      return { type: 'new', label: 'New', color: 'info', icon: NewIcon };
    }

    // Check if it's overdue using the utility function
    if (isWorkOrderOverdue(workOrder)) {
      return { type: 'overdue', label: 'Overdue', color: 'error', icon: WarningIcon };
    }

    // Check if it has upcoming activity this week
    if (workOrder.activity?.some(activity => {
      const activityDate = new Date(activity.date);
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      return activityDate >= startOfWeek && activityDate <= endOfWeek && activity.status !== 'completed';
    })) {
      return { type: 'thisWeek', label: 'This Week', color: 'warning', icon: ScheduleIcon };
    }

    // Default to upcoming
    return { type: 'upcoming', label: 'Upcoming', color: 'success', icon: ScheduleIcon };
  };

  // Helper function to get active restrictions
  const getActiveRestrictions = (restrictions) => {
    if (!restrictions) return [];

    const activeRestrictions = [];

    // Add time-based restrictions
    if (restrictions.morning_hours) activeRestrictions.push('Morning Hours');
    if (restrictions.afternoon_hours) activeRestrictions.push('Afternoon Hours');
    if (restrictions.business_hours) activeRestrictions.push('Business Hours');

    // Add day-based restrictions
    const days = [];
    if (restrictions.monday) days.push('Mon');
    if (restrictions.tuesday) days.push('Tue');
    if (restrictions.wednesday) days.push('Wed');
    if (restrictions.thursday) days.push('Thu');
    if (restrictions.friday) days.push('Fri');
    if (restrictions.saturday) days.push('Sat');
    if (restrictions.sunday) days.push('Sun');

    if (days.length > 0) {
      activeRestrictions.push(`Days: ${days.join(', ')}`);
    }

    return activeRestrictions;
  };

  const status = getWorkOrderStatus(workOrder);

  return (
    <Card
      sx={{
        width: '100%',
        mb: 3,
        boxShadow: 3,
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out'
        }
      }}
    >
      {/* Status Alert Banner */}
      <Alert
        severity={status.color}
        icon={<status.icon />}
        sx={{
          borderRadius: 0,
          cursor: 'pointer'
        }}
        onClick={() => onViewDetails(workOrder)}
      >
        <Typography variant="body2" fontWeight="medium">
          {status.label}
        </Typography>
      </Alert>

      <CardContent
        sx={{
          pb: 1,
          cursor: 'pointer'
        }}
        onClick={() => onViewDetails(workOrder)}
      >
        {/* Header with Title and Description */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
              {workOrder.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {workOrder.description}
            </Typography>
          </Box>
        </Box>

        {/* Location Row */}
        <Box mb={2}>
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1
            }}
          >
            <LocationIcon color="primary" sx={{ mt: 0.25, fontSize: 20 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                Location
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {workOrder.address}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Schedule & Restrictions Row */}
        <Box mb={2}>
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1
            }}
          >
            <AccessTimeIcon color="primary" sx={{ mt: 0.25, fontSize: 20 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                Schedule & Restrictions
              </Typography>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                {workOrder.schedule?.frequency || 'Not set'}
              </Typography>
              {workOrder.schedule?.restrictions && getActiveRestrictions(workOrder.schedule.restrictions).length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {getActiveRestrictions(workOrder.schedule.restrictions).slice(0, 2).map((restriction) => (
                    <Chip
                      key={restriction}
                      label={restriction}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.65rem', height: 18 }}
                    />
                  ))}
                  {getActiveRestrictions(workOrder.schedule.restrictions).length > 2 && (
                    <Chip
                      key="more-restrictions"
                      label={`+${getActiveRestrictions(workOrder.schedule.restrictions).length - 2} more`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.65rem', height: 18 }}
                    />
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Contacts */}
        {workOrder.contacts && workOrder.contacts.length > 0 && (
          <Box mb={2}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold', mb: 1, display: 'block' }}>
              Contacts ({workOrder.contacts.length})
            </Typography>
            <List dense sx={{ py: 0 }}>
              {workOrder.contacts.slice(0, 2).map((contact) => (
                <ListItem key={contact.name || contact.email || Math.random()} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <PersonIcon sx={{ fontSize: 16, color: contact.primary ? 'primary.main' : 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="span" variant="body2" sx={{ fontWeight: contact.primary ? 600 : 400 }}>
                          {contact.name}
                        </Typography>
                        {contact.primary && (
                          <Chip label="Primary" size="small" color="primary" sx={{ ml: 1, height: 16, fontSize: '0.7rem' }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {contact.phones?.[0]?.phone || contact.email}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
              {workOrder.contacts.length > 2 && (
                <ListItem sx={{ px: 0, py: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        +{workOrder.contacts.length - 2} more contact{workOrder.contacts.length - 2 !== 1 ? 's' : ''}
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Box>
        )}
      </CardContent>
      {/* Footer */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button size="small" variant="outlined" sx={{ ml: 'auto' }} onClick={handleSchedule}>
          Schedule
        </Button>
      </Box>
      <ScheduleModal open={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} onSubmit={handleScheduleSubmit} />
    </Card>
  );
};

WorkOrderCard.propTypes = {
  workOrder: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    'created-date': PropTypes.string.isRequired,
    activity: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      technician: PropTypes.string.isRequired,
      notes: PropTypes.string,
      status: PropTypes.string.isRequired
    })).isRequired,
    contacts: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string,
      phones: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string,
        phone: PropTypes.string,
        'sms-enabled': PropTypes.bool,
        primary: PropTypes.bool
      })),
      notes: PropTypes.string,
      preference: PropTypes.string,
      primary: PropTypes.bool
    })),
    schedule: PropTypes.shape({
      frequency: PropTypes.string.isRequired,
      restrictions: PropTypes.shape({
        weekends: PropTypes.bool,
        weekdays: PropTypes.bool,
        monday: PropTypes.bool,
        tuesday: PropTypes.bool,
        wednesday: PropTypes.bool,
        thursday: PropTypes.bool,
        friday: PropTypes.bool,
        saturday: PropTypes.bool,
        sunday: PropTypes.bool,
        morning_hours: PropTypes.bool,
        afternoon_hours: PropTypes.bool,
        business_hours: PropTypes.bool
      })
    }).isRequired
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onSchedule: PropTypes.func,
  compact: PropTypes.bool
};

export default WorkOrderCard;
