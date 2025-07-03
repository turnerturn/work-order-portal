import { Alert, Snackbar } from '@mui/material';
import PropTypes from 'prop-types';

const ScheduleNotification = ({ open, onClose, scheduledDate }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity="info"
        variant="filled"
        sx={{ width: '100%' }}
      >
        Activity has been scheduled for {scheduledDate}. See work order details activity to refine this scheduled activity.
      </Alert>
    </Snackbar>
  );
};

ScheduleNotification.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  scheduledDate: PropTypes.string
};

export default ScheduleNotification;
