import {
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  LocationOn as LocationIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import {
  formatDate,
  formatRelativeTime,
  getScheduleDescription,
  isOverdue
} from '../utils/dateUtils';

const WorkOrderCard = ({ workOrder, onScheduleClick, onViewDetails, onScheduleWork }) => {
  const isOrderOverdue = isOverdue(workOrder.schedule.nextDue);
  const lastActivity = workOrder.activity[0]; // Most recent activity first

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: 'auto',
        mb: 3,
        boxShadow: 3,
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out'
        }
      }}
    >
      {/* Overdue Alert Banner */}
      {isOrderOverdue && (
        <Alert
          severity="error"
          icon={<WarningIcon />}
          sx={{ borderRadius: 0 }}
        >
          <Typography variant="body2" fontWeight="medium">
            This work order is overdue and requires immediate attention
          </Typography>
        </Alert>
      )}

      <CardContent sx={{ pb: 1 }}>
        {/* Header with Title and Settings */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
              {workOrder.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {workOrder.description}
            </Typography>
          </Box>
          <IconButton
            onClick={() => onScheduleClick(workOrder)}
            size="small"
            sx={{ ml: 1 }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>

        {/* Key Information Grid */}
        <Grid container spacing={2} mb={2}>
          {/* Location */}
          <Grid item xs={12} md={6}>
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
          </Grid>

          {/* Schedule & Due Date */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                bgcolor: isOrderOverdue ? 'error.50' : 'grey.50',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1
              }}
            >
              <AccessTimeIcon
                color={isOrderOverdue ? 'error' : 'success'}
                sx={{ mt: 0.25, fontSize: 20 }}
              />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {getScheduleDescription(workOrder.schedule)} Schedule
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color={isOrderOverdue ? 'error.main' : 'text.primary'}
                >
                  Due {formatDate(workOrder.schedule.nextDue)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatRelativeTime(workOrder.schedule.nextDue)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Last Activity Section */}
        {lastActivity && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Last Activity
                </Typography>
              </Box>
              <Box sx={{ ml: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <Chip
                    label={lastActivity.type.charAt(0).toUpperCase() + lastActivity.type.slice(1)}
                    color="success"
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    by {lastActivity.technician}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(lastActivity.date)}
                  </Typography>
                </Box>
                {lastActivity.notes && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    "{lastActivity.notes}"
                  </Typography>
                )}
              </Box>
            </Box>
          </>
        )}
      </CardContent>

      {/* Action Buttons */}
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant="outlined"
          onClick={() => onViewDetails(workOrder)}
          sx={{ flex: 1 }}
        >
          View Details
        </Button>
        <Button
          variant="contained"
          onClick={() => onScheduleWork(workOrder)}
          sx={{ flex: 1 }}
        >
          Schedule Work
        </Button>
      </CardActions>
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
    schedule: PropTypes.shape({
      cron: PropTypes.string.isRequired,
      frequency: PropTypes.string.isRequired,
      nextDue: PropTypes.string.isRequired,
      dayOfWeek: PropTypes.string,
      restrictions: PropTypes.arrayOf(PropTypes.string)
    }).isRequired
  }).isRequired,
  onScheduleClick: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onScheduleWork: PropTypes.func.isRequired
};

export default WorkOrderCard;
