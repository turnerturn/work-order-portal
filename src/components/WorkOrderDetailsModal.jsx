import {
  Add as AddIcon,
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
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { formatDate } from '../utils/dateUtils';
import ActivityDetailsModal from './ActivityDetailsModal';
import ContactEditItem from './ContactEditItem';

const WorkOrderDetailsModal = ({ open, onClose, workOrder, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [expandedContacts, setExpandedContacts] = useState(new Set());
  const [formData, setFormData] = useState({
    name: workOrder?.name || '',
    description: workOrder?.description || '',
    address: workOrder?.address || '',
    frequency: workOrder?.schedule?.frequency || '',
    restrictions: [],
    contacts: workOrder?.contacts || []
  });

  // Available restriction options
  const restrictionOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
    { value: 'morning_hours', label: 'Morning Hours' },
    { value: 'afternoon_hours', label: 'Afternoon Hours' },
    { value: 'business_hours', label: 'Business Hours' }
  ];

  useEffect(() => {
    if (workOrder) {
      // Convert restrictions object to array for multi-select
      const activeRestrictions = [];
      if (workOrder.schedule?.restrictions) {
        Object.entries(workOrder.schedule.restrictions).forEach(([key, value]) => {
          if (value && key !== 'weekends' && key !== 'weekdays') {
            activeRestrictions.push(key);
          }
        });
      }

      setFormData({
        name: workOrder.name || '',
        description: workOrder.description || '',
        address: workOrder.address || '',
        frequency: workOrder.schedule?.frequency || '',
        restrictions: activeRestrictions,
        contacts: workOrder.contacts ? [...workOrder.contacts] : []
      });
    }
    setIsEditing(false);
    setExpandedContacts(new Set());
  }, [workOrder, open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (onSave) {
      // Convert restrictions array back to object format
      const restrictionsObject = {
        weekends: false,
        weekdays: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        morning_hours: false,
        afternoon_hours: false,
        business_hours: false
      };

      // Set active restrictions
      formData.restrictions.forEach(restriction => {
        restrictionsObject[restriction] = true;
      });

      // Auto-calculate weekends and weekdays
      const weekdayRestrictions = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      const weekendRestrictions = ['saturday', 'sunday'];

      restrictionsObject.weekdays = weekdayRestrictions.some(day => restrictionsObject[day]);
      restrictionsObject.weekends = weekendRestrictions.some(day => restrictionsObject[day]);

      onSave({
        ...workOrder,
        name: formData.name,
        description: formData.description,
        address: formData.address,
        contacts: formData.contacts,
        schedule: {
          ...workOrder.schedule,
          frequency: formData.frequency,
          restrictions: restrictionsObject
        }
      });
    }
    setIsEditing(false);
    setExpandedContacts(new Set());
  };

  const handleActivityEdit = (activity) => {
    setSelectedActivity(activity);
    setActivityModalOpen(true);
  };

  const handleActivitySave = (updatedActivity) => {
    // Update the activity in the work order
    const updatedWorkOrder = {
      ...workOrder,
      activity: workOrder.activity.map(act =>
        act.id === updatedActivity.id ? updatedActivity : act
      )
    };
    if (onSave) onSave(updatedWorkOrder);
  };

  const handleActivityDelete = (activityToDelete) => {
    // Remove the activity from the work order
    const updatedWorkOrder = {
      ...workOrder,
      activity: workOrder.activity.filter(act => act.id !== activityToDelete.id)
    };
    if (onSave) onSave(updatedWorkOrder);
  };

  const handleCancel = () => {
    if (workOrder) {
      // Convert restrictions object to array for multi-select
      const activeRestrictions = [];
      if (workOrder.schedule?.restrictions) {
        Object.entries(workOrder.schedule.restrictions).forEach(([key, value]) => {
          if (value && key !== 'weekends' && key !== 'weekdays') {
            activeRestrictions.push(key);
          }
        });
      }

      setFormData({
        name: workOrder.name || '',
        description: workOrder.description || '',
        address: workOrder.address || '',
        frequency: workOrder.schedule?.frequency || '',
        restrictions: activeRestrictions,
        contacts: workOrder.contacts ? [...workOrder.contacts] : []
      });
    }
    setIsEditing(false);
    setExpandedContacts(new Set());
  };

  const handleRemoveContact = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleAddContact = () => {
    const newContact = {
      name: '',
      email: '',
      phones: [{ type: 'mobile', phone: '', 'sms-enabled': true, primary: true }],
      notes: '',
      preference: 'voice',
      primary: formData.contacts.length === 0
    };

    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, newContact]
    }));
  };

  const handleContactChange = (index, field, value) => {
    setFormData(prev => {
      const newContacts = [...prev.contacts];
      newContacts[index] = { ...newContacts[index], [field]: value };
      return { ...prev, contacts: newContacts };
    });
  };

  const handlePhoneChange = (contactIndex, phoneIndex, field, value) => {
    setFormData(prev => {
      const newContacts = [...prev.contacts];
      const newPhones = [...newContacts[contactIndex].phones];
      newPhones[phoneIndex] = { ...newPhones[phoneIndex], [field]: value };
      newContacts[contactIndex] = { ...newContacts[contactIndex], phones: newPhones };
      return { ...prev, contacts: newContacts };
    });
  };

  const handleAddPhone = (contactIndex) => {
    setFormData(prev => {
      const newContacts = [...prev.contacts];
      const newPhone = { type: 'mobile', phone: '', 'sms-enabled': false, primary: false };
      newContacts[contactIndex] = {
        ...newContacts[contactIndex],
        phones: [...newContacts[contactIndex].phones, newPhone]
      };
      return { ...prev, contacts: newContacts };
    });
  };

  const handleRemovePhone = (contactIndex, phoneIndex) => {
    setFormData(prev => {
      const newContacts = [...prev.contacts];
      const newPhones = newContacts[contactIndex].phones.filter((_, i) => i !== phoneIndex);
      newContacts[contactIndex] = { ...newContacts[contactIndex], phones: newPhones };
      return { ...prev, contacts: newContacts };
    });
  };

  const handleSetPrimaryContact = (contactIndex) => {
    setFormData(prev => {
      const newContacts = prev.contacts.map((contact, i) => ({
        ...contact,
        primary: i === contactIndex
      }));
      return { ...prev, contacts: newContacts };
    });
  };

  const toggleContactExpanded = (contactIndex) => {
    setExpandedContacts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contactIndex)) {
        newSet.delete(contactIndex);
      } else {
        newSet.add(contactIndex);
      }
      return newSet;
    });
  };


  if (!workOrder) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1
          }
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Basic Information */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Basic Information
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Work Order Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={!isEditing}
              />

              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
              />
            </Box>
          </Box>

          {/* Contacts */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Contacts ({formData.contacts.length})
              </Typography>
              {isEditing && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddContact}
                  size="small"
                  variant="outlined"
                  sx={{ textTransform: 'none' }}
                >
                  Add Contact
                </Button>
              )}
            </Box>

            {formData.contacts.length > 0 ? (
              <Box sx={{ bgcolor: 'grey.50', borderRadius: 1 }}>
                {formData.contacts.map((contact, index) => (
                  <Box key={contact.email || contact.name || `contact-${contact.phones?.[0]?.phone || index}`}>
                    <ContactEditItem
                      contact={contact}
                      contactIndex={index}
                      isEditing={isEditing}
                      isExpanded={expandedContacts.has(index)}
                      onToggleExpanded={() => toggleContactExpanded(index)}
                      onContactChange={handleContactChange}
                      onPhoneChange={handlePhoneChange}
                      onAddPhone={handleAddPhone}
                      onRemovePhone={handleRemovePhone}
                      onSetPrimary={handleSetPrimaryContact}
                      onRemove={handleRemoveContact}
                    />
                    {index < formData.contacts.length - 1 && (
                      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary">
                  No contacts added yet
                </Typography>
              </Paper>
            )}
          </Box>

          {/* Scheduling Information */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Scheduling
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                  Restrictions
                </Typography>
                <Autocomplete
                  multiple
                  value={formData.restrictions}
                  onChange={(event, newValue) => handleInputChange('restrictions', newValue)}
                  options={restrictionOptions.map(option => option.value)}
                  getOptionLabel={(option) => restrictionOptions.find(r => r.value === option)?.label || option}
                  disabled={!isEditing}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={formData.restrictions.length === 0 ? "Select restrictions..." : ""}
                      variant="outlined"
                    />
                  )}
                  sx={{
                    '& .MuiAutocomplete-tag': {
                      margin: '2px'
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Select days and time windows when work can be scheduled
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Activity - Full Width */}
          <Box sx={{ width: '100%' }}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="activity-content"
                id="activity-header"
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
                    Activity ({workOrder.activity?.length || 0} activities)
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0, width: '100%' }}>
                {workOrder.activity && workOrder.activity.length > 0 ? (
                  <Box sx={{ width: '100%' }}>
                    {workOrder.activity.map((activity, index) => (
                      <Box
                        key={activity.id || index}
                        onClick={() => handleActivityEdit(activity)}
                        sx={{
                          width: '100%',
                          p: 3,
                          borderBottom: index < workOrder.activity.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: 'action.hover',
                            transform: 'translateX(4px)'
                          }
                        }}
                      >
                        {/* Activity Row Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {formatDate(activity.date)}
                          </Typography>
                          <Chip
                            label={(() => {
                              if (activity.status === 'complete') return 'Complete';
                              if (activity.status === 'canceled') return 'Canceled';
                              return 'Incomplete';
                            })()}
                            size="small"
                            color={(() => {
                              if (activity.status === 'complete') return 'success';
                              if (activity.status === 'canceled') return 'error';
                              return 'warning';
                            })()}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        {/* Activity Description */}
                        <Typography
                          variant="body1"
                          sx={{
                            mb: 1,
                            color: 'text.primary',
                            fontWeight: 500
                          }}
                        >
                          {activity.description || activity.type?.charAt(0).toUpperCase() + activity.type?.slice(1) || 'Activity'}
                        </Typography>

                        {/* Activity Meta Info */}
                        <Typography variant="body2" color="text.secondary">
                          {activity.technician ? `Technician: ${activity.technician}` : 'No technician assigned'}
                          {activity.reminders && activity.reminders.length > 0 && (
                            <> • {activity.reminders.length} reminder{activity.reminders.length !== 1 ? 's' : ''}</>
                          )}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Alert severity="info" sx={{ borderRadius: 2, m: 3 }}>
                    No activity available for this work order.
                  </Alert>
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
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

      {/* Activity Details Modal */}
      <ActivityDetailsModal
        open={activityModalOpen}
        onClose={() => {
          setActivityModalOpen(false);
          setSelectedActivity(null);
        }}
        activity={selectedActivity}
        onSave={handleActivitySave}
        onDelete={handleActivityDelete}
      />
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
