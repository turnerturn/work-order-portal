import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const ActivityDetailsModal = ({ open, onClose, activity, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    date: null,
    notes: '',
    status: 'incomplete',
    reminders: []
  });
  const [newReminder, setNewReminder] = useState('');

  React.useEffect(() => {
    if (activity) {
      setFormData({
        date: activity.date ? new Date(activity.date) : new Date(),
        notes: activity.notes || activity.type || '',
        status: activity.status || 'incomplete',
        reminders: activity.reminders || []
      });
    }
  }, [activity]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddReminder = () => {
    if (newReminder.trim()) {
      setFormData(prev => ({
        ...prev,
        reminders: [...prev.reminders, newReminder.trim()]
      }));
      setNewReminder('');
    }
  };

  const handleDeleteReminder = (index) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...activity,
        date: formData.date?.toISOString().split('T')[0],
        notes: formData.notes,
        status: formData.status,
        reminders: formData.reminders
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this activity?')) {
      onDelete(activity);
      onClose();
    }
  };

  if (!activity) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 }
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Edit Activity
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {/* Date Field */}
            <DatePicker
              label="Activity Date"
              value={formData.date}
              onChange={(value) => handleFieldChange('date', value)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined'
                }
              }}
            />

            {/* Notes Field */}
            <TextField
              fullWidth
              label="Notes"
              variant="outlined"
              value={formData.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              multiline
              rows={2}
            />

            {/* Status Field */}
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleFieldChange('status', e.target.value)}
              >
                <MenuItem value="complete">Complete</MenuItem>
                <MenuItem value="incomplete">Incomplete</MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
              </Select>
            </FormControl>

            {/* Reminders Section */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Reminders
              </Typography>

              {/* Add New Reminder */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a new reminder..."
                  value={newReminder}
                  onChange={(e) => setNewReminder(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddReminder()}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddReminder}
                  sx={{ textTransform: 'none', minWidth: 'auto', px: 2 }}
                >
                  Add
                </Button>
              </Box>

              {/* Reminders List */}
              {formData.reminders.length > 0 ? (
                <List dense sx={{ bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  {formData.reminders.map((reminder, index) => (
                    <ListItem
                      key={`reminder-${reminder}-${index}`}
                      sx={{ py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {reminder}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteReminder(index)}
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No reminders added yet
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleDelete}
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ mr: 'auto', textTransform: 'none' }}
          >
            Delete Activity
          </Button>
          <Button onClick={onClose} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ textTransform: 'none' }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

ActivityDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  activity: PropTypes.object,
  onSave: PropTypes.func,
  onDelete: PropTypes.func
};

export default ActivityDetailsModal;
