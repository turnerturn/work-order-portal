import { Close as CloseIcon } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const ScheduleModal = ({ open, onClose, onSubmit }) => {
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    if (date) onSubmit(date);
  };

  React.useEffect(() => {
    if (!open) setDate('');
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Schedule Work
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Schedule Date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            slotProps={{ inputLabel: { shrink: true } }}
            autoFocus
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!date}>Schedule</Button>
      </DialogActions>
    </Dialog>
  );
};

ScheduleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ScheduleModal;
