import { Close as CloseIcon, Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const ActivityDetailsModal = ({ open, onClose, activity, onSave, onDelete }) => {
  const [notes, setNotes] = useState(activity?.notes || '');

  React.useEffect(() => {
    setNotes(activity?.notes || '');
  }, [activity]);

  const handleSave = () => {
    if (onSave) {
      onSave({ ...activity, notes });
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Activity Details
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            {activity.type?.charAt(0).toUpperCase() + activity.type?.slice(1) || 'Activity'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {activity.date} • {activity.technician || 'Unknown technician'}
          </Typography>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={4}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={handleDelete}
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ mr: 'auto' }}
        >
          Delete
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
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
