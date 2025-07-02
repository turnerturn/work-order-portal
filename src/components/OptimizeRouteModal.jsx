import { Close as CloseIcon, MyLocation as LocationIcon } from '@mui/icons-material';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const OptimizeRouteModal = ({ open, onClose, onSubmit }) => {
  const [origin, setOrigin] = useState('');
  const [isCurrentAddress, setIsCurrentAddress] = useState(false);

  const addressOptions = [
    { label: 'Current Address', value: 'current', isSpecial: true }
  ];

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationAddress = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        setOrigin(locationAddress);
      },
      (error) => {
        alert('Unable to get your location. Please enter an address manually.');
      }
    );
  };

  const handleSubmit = () => {
    if (origin.trim()) {
      onSubmit(origin);
    }
  };

  React.useEffect(() => {
    if (!open) {
      setOrigin('');
      setIsCurrentAddress(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Optimize Route
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Autocomplete
            freeSolo
            value={isCurrentAddress ? 'Current Address' : origin}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                setOrigin(newValue);
                setIsCurrentAddress(false);
              } else if (newValue?.value === 'current') {
                setIsCurrentAddress(true);
                getCurrentLocation();
              }
            }}
            onInputChange={(event, newInputValue) => {
              setOrigin(newInputValue);
              setIsCurrentAddress(false);
            }}
            options={addressOptions}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              return option.label;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Origin Address"
                placeholder="Enter address or select current location"
                autoFocus
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontWeight: option.isSpecial ? 600 : 400,
                color: option.isSpecial ? 'primary.main' : 'text.primary'
              }}>
                {option.isSpecial && <LocationIcon fontSize="small" />}
                {option.label}
              </Box>
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!origin.trim()}>Optimize</Button>
      </DialogActions>
    </Dialog>
  );
};

OptimizeRouteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default OptimizeRouteModal;
