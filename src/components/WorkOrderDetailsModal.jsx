import {
    Close as CloseIcon,
    ExpandMore as ExpandMoreIcon,
    History as HistoryIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { formatDate, getStatusColor, isPending } from '../utils/dateUtils';

const WorkOrderDetailsModal = ({ open, onClose, workOrder, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: workOrder?.name || '',
    description: workOrder?.description || '',
    address: workOrder?.address || '',
    frequency: workOrder?.schedule?.frequency || '',
    dayOfWeek: workOrder?.schedule?.dayOfWeek || '',
    nextDue: workOrder?.schedule?.nextDue || ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...workOrder,
        name: formData.name,
        description: formData.description,
        address: formData.address,
        schedule: {
          ...workOrder.schedule,
          frequency: formData.frequency,
          dayOfWeek: formData.dayOfWeek,
          nextDue: formData.nextDue
        }
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: workOrder?.name || '',
      description: workOrder?.description || '',
      address: workOrder?.address || '',
      frequency: workOrder?.schedule?.frequency || '',
      dayOfWeek: workOrder?.schedule?.dayOfWeek || '',
      nextDue: workOrder?.schedule?.nextDue || ''
    });
    setIsEditing(false);
  };

  if (!workOrder) return null;

  const nextDueDate = workOrder.schedule?.nextDue;
  const statusColor = getStatusColor(nextDueDate);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Work Order Details
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Basic Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Work Order Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Schedule Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Schedule
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={!isEditing}>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={formData.frequency}
                    label="Frequency"
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                  >
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={!isEditing}>
                  <InputLabel>Day of Week</InputLabel>
                  <Select
                    value={formData.dayOfWeek}
                    label="Day of Week"
                    onChange={(e) => handleInputChange('dayOfWeek', e.target.value)}
                  >
                    <MenuItem value="monday">Monday</MenuItem>
                    <MenuItem value="tuesday">Tuesday</MenuItem>
                    <MenuItem value="wednesday">Wednesday</MenuItem>
                    <MenuItem value="thursday">Thursday</MenuItem>
                    <MenuItem value="friday">Friday</MenuItem>
                    <MenuItem value="saturday">Saturday</MenuItem>
                    <MenuItem value="sunday">Sunday</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Next Due Date"
                  type="datetime-local"
                  value={formData.nextDue ? new Date(formData.nextDue).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleInputChange('nextDue', e.target.value ? new Date(e.target.value).toISOString() : '')}
                  disabled={!isEditing}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Status:
                  </Typography>
                  <Chip
                    label={isPending(nextDueDate) ? 'Pending' : formatDate(nextDueDate)}
                    color={statusColor}
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Activity History */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="history-content"
                id="history-header"
                sx={{
                  backgroundColor: 'grey.50',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'grey.100'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HistoryIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    History ({workOrder.activity?.length || 0} activities)
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {workOrder.activity && workOrder.activity.length > 0 ? (
                  <List>
                    {workOrder.activity.map((activity, index) => (
                      <ListItem key={activity.id || index} divider={index < workOrder.activity.length - 1}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {activity.type?.charAt(0).toUpperCase() + activity.type?.slice(1) || 'Activity'}
                              </Typography>
                              <Chip
                                label={activity.status || 'Unknown'}
                                size="small"
                                color={activity.status === 'completed' ? 'success' : 'default'}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(activity.date)} • {activity.technician || 'Unknown technician'}
                              </Typography>
                              {activity.notes && (
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  {activity.notes}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    No activity history available for this work order.
                  </Alert>
                )}
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        {isEditing ? (
          <>
            <Button
              onClick={handleCancel}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              startIcon={<SaveIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3
              }}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={onClose}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3
              }}
            >
              Edit
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

WorkOrderDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  workOrder: PropTypes.object,
  onSave: PropTypes.func
};

export default WorkOrderDetailsModal;
