import {
    Close as CloseIcon,
    MyLocation as LocationIcon,
    Route as RouteIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const RouteOptimizationModal = ({
  open,
  onClose,
  onOptimize,
  workOrdersToOptimize,
  isOptimizing
}) => {
  const [originAddress, setOriginAddress] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setOriginAddress('1432 E 50th St, Tulsa, OK 74105'); // Default address
      setError('');
      setIsValidating(false);
      setIsLoadingLocation(false);
    }
  }, [open]);

  const validateAddress = async (address) => {
    if (!address.trim()) {
      setError('Please enter a starting location');
      return false;
    }

    setIsValidating(true);
    setError('');

    try {
      // Enhanced validation - check for reasonable address format
      const trimmedAddress = address.trim();

      // Check if it's coordinates
      const coordPattern = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
      if (coordPattern.test(trimmedAddress)) {
        setIsValidating(false);
        return true;
      }

      // Check for basic address components
      const addressPattern = /^.{5,}$/; // At least 5 characters
      if (!addressPattern.test(trimmedAddress)) {
        throw new Error('Please enter a valid address (at least 5 characters)');
      }

      // In a real app, you could validate using Google Places API here
      // For now, we'll accept any reasonable-looking address

      setIsValidating(false);
      return true;
    } catch (err) {
      setError(err.message || 'Invalid address. Please check and try again.');
      setIsValidating(false);
      return false;
    }
  };  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setIsLoadingLocation(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use coordinates directly - Google API accepts lat,lng format
          const locationAddress = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
          setOriginAddress(locationAddress);
          setIsLoadingLocation(false);

          // Optional: You could reverse geocode to get a human-readable address
          // but coordinates work fine for the Directions API
        } catch (err) {
          setError('Unable to process your location. Please enter manually.');
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        let errorMessage = 'Unable to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        setError(errorMessage);
        setIsLoadingLocation(false);
      },
      options
    );
  };

  const handleOptimize = async () => {
    const isValid = await validateAddress(originAddress);
    if (isValid) {
      onOptimize(originAddress.trim());
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !isValidating && !isOptimizing) {
      handleOptimize();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RouteIcon color="primary" />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Optimize Route
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={isOptimizing}
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your starting location to optimize the route for {workOrdersToOptimize} work orders. The system will calculate the most efficient travel path.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Starting Location"
            placeholder="Enter address, city, or coordinates"
            value={originAddress}
            onChange={(e) => setOriginAddress(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isOptimizing || isLoadingLocation}
            error={!!error}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          <Button
            variant="outlined"
            size="small"
            startIcon={isLoadingLocation ? <CircularProgress size={16} /> : <LocationIcon />}
            onClick={getCurrentLocation}
            disabled={isOptimizing || isLoadingLocation}
            sx={{
              mt: 2,
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            {isLoadingLocation ? 'Getting location...' : 'Use Current Location'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {isOptimizing && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">
                Calculating optimal route...
              </Typography>
            </Box>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          disabled={isOptimizing}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleOptimize}
          disabled={!originAddress.trim() || isValidating || isOptimizing || isLoadingLocation}
          startIcon={isValidating || isOptimizing ? <CircularProgress size={16} /> : <RouteIcon />}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 3
          }}
        >
          {(() => {
            if (isValidating) return 'Validating...';
            if (isOptimizing) return 'Optimizing...';
            return 'Optimize Route';
          })()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

RouteOptimizationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOptimize: PropTypes.func.isRequired,
  workOrdersToOptimize: PropTypes.number.isRequired,
  isOptimizing: PropTypes.bool.isRequired
};

export default RouteOptimizationModal;
