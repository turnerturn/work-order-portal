import {
    CalendarToday as CalendarIcon,
    Close as CloseIcon,
    MyLocation as LocationIcon,
    Route as RouteIcon
} from '@mui/icons-material';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    TextField,
    Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { directionsService } from '../services/directionsService';
import WorkOrderCard from './WorkOrderCard';

const ItineraryModal = ({ open, onClose, workOrders = [], onCreateItinerary }) => {
  const [originAddress, setOriginAddress] = useState('');
  const [isCurrentAddress, setIsCurrentAddress] = useState(false);
  const [itineraryDate, setItineraryDate] = useState('');
  const [selectedWorkOrders, setSelectedWorkOrders] = useState(new Set());
  const [optimizedWorkOrders, setOptimizedWorkOrders] = useState([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState('');

  // Address input options with "current address" as first option
  const addressOptions = [
    { label: 'Current Address', value: 'current', isSpecial: true },
    ...workOrders.map(wo => ({
      label: wo.address,
      value: wo.address,
      isSpecial: false
    }))
  ];

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setOriginAddress('');
      setIsCurrentAddress(false);
      setItineraryDate('');
      setSelectedWorkOrders(new Set());
      setOptimizedWorkOrders([]);
      setError('');
    } else {
      // Set default date to today
      const today = new Date();
      setItineraryDate(today.toISOString().split('T')[0]);

      // Initialize with all work orders
      setOptimizedWorkOrders(workOrders);
    }
  }, [open, workOrders]);

  const getCurrentLocation = () => {
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
      maximumAge: 300000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationAddress = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        setOriginAddress(locationAddress);
        setIsLoadingLocation(false);
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

  const getCurrentLocationForOptimization = (resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationAddress = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        setOriginAddress(locationAddress);
        resolve(locationAddress);
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
        reject(new Error(errorMessage));
      },
      options
    );
  };

  const handleOptimizeRoute = async () => {
    if (!originAddress.trim() && !isCurrentAddress) {
      setError('Please enter a starting location');
      return;
    }

    setIsOptimizing(true);
    setError('');

    try {
      // Get current location if needed
      let startingAddress = originAddress;
      if (isCurrentAddress && !originAddress.includes(',')) {
        // Need to get current location
        await new Promise((resolve, reject) => {
          getCurrentLocationForOptimization(resolve, reject);
        });
        startingAddress = originAddress; // This will be set by getCurrentLocationForOptimization
      }

      // Get addresses for work orders
      const destinations = workOrders.map(wo => wo.address).filter(addr => addr);

      if (destinations.length === 0) {
        throw new Error('No work orders with valid addresses found');
      }

      // Call the directions service to optimize the route
      const optimizedRoute = await directionsService.optimizeRoute(startingAddress, destinations);

      if (optimizedRoute.status === 'OK' && optimizedRoute.routes[0]) {
        const optimizedOrder = optimizedRoute.routes[0].waypoint_order;

        // Reorder the work orders based on the optimized route
        const reorderedWorkOrders = optimizedOrder.map(index => workOrders[index]).filter(Boolean);

        // Add any work orders that weren't in the optimization
        const remainingWorkOrders = workOrders.filter(wo =>
          !reorderedWorkOrders.some(rwo => rwo.uuid === wo.uuid)
        );

        setOptimizedWorkOrders([...reorderedWorkOrders, ...remainingWorkOrders]);
      } else {
        throw new Error('Failed to optimize route');
      }
    } catch (err) {
      console.error('Route optimization error:', err);
      setError(err.message || 'Failed to optimize route. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleWorkOrderSelect = (workOrderId, isSelected) => {
    const newSelected = new Set(selectedWorkOrders);
    if (isSelected) {
      newSelected.add(workOrderId);
    } else {
      newSelected.delete(workOrderId);
    }
    setSelectedWorkOrders(newSelected);
  };

  const handleCreateItinerary = () => {
    if (selectedWorkOrders.size === 0) {
      setError('Please select at least one work order for the itinerary');
      return;
    }

    const selectedWOs = optimizedWorkOrders.filter(wo => selectedWorkOrders.has(wo.uuid));

    if (onCreateItinerary) {
      onCreateItinerary(selectedWOs, originAddress, itineraryDate);
    }

    // Close the modal after successful creation
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          p: 1,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RouteIcon color="primary" />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Create Itinerary
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        {/* Input Section */}
        <Card elevation={1} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Itinerary Details
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', md: 'row' } }}>
              {/* Origin Address */}
              <Box sx={{ flex: 1 }}>
                <Autocomplete
                  freeSolo
                  value={isCurrentAddress ? 'Current Address' : originAddress}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      setOriginAddress(newValue);
                      setIsCurrentAddress(false);
                    } else if (newValue?.value === 'current') {
                      setIsCurrentAddress(true);
                      getCurrentLocation();
                    } else if (newValue?.value) {
                      setOriginAddress(newValue.value);
                      setIsCurrentAddress(false);
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setOriginAddress(newInputValue);
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
                      label="Starting Location"
                      placeholder="Enter address or select current location"
                      disabled={isOptimizing || isLoadingLocation}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
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

              {/* Itinerary Date */}
              <Box sx={{ minWidth: 200 }}>
                <TextField
                  fullWidth
                  label="Itinerary Date"
                  type="date"
                  value={itineraryDate}
                  onChange={(e) => setItineraryDate(e.target.value)}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                    input: {
                      startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={handleOptimizeRoute}
              disabled={(!originAddress.trim() && !isCurrentAddress) || isOptimizing || workOrders.length === 0}
              startIcon={isOptimizing ? <CircularProgress size={16} /> : <RouteIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3
              }}
            >
              {isOptimizing ? 'Optimizing Route...' : 'Optimize Route'}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Work Orders List */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Select Work Orders ({selectedWorkOrders.size} selected)
        </Typography>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {optimizedWorkOrders.length > 0 ? (
            <List sx={{ p: 0 }}>
              {optimizedWorkOrders.map((workOrder, index) => (
                <ListItem key={workOrder.uuid} sx={{ p: 0, mb: 2 }}>
                  <Box sx={{ width: '100%', position: 'relative' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedWorkOrders.has(workOrder.uuid)}
                          onChange={(e) => handleWorkOrderSelect(workOrder.uuid, e.target.checked)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            backgroundColor: 'white',
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'grey.50'
                            }
                          }}
                        />
                      }
                      label=""
                      sx={{ m: 0, width: '100%' }}
                    />

                    <Box
                      sx={{
                        opacity: selectedWorkOrders.has(workOrder.uuid) ? 1 : 0.7,
                        border: selectedWorkOrders.has(workOrder.uuid) ? '2px solid' : '1px solid transparent',
                        borderColor: selectedWorkOrders.has(workOrder.uuid) ? 'primary.main' : 'transparent',
                        borderRadius: 2,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {index === 0 && (
                        <Typography variant="caption" color="primary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                          Route Order #{index + 1} (Optimized)
                        </Typography>
                      )}
                      {index > 0 && (
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          Route Order #{index + 1}
                        </Typography>
                      )}

                      <WorkOrderCard
                        workOrder={workOrder}
                        onScheduleClick={() => {}}
                        onViewDetails={() => {}}
                        onScheduleWork={() => {}}
                        compact
                      />
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              No work orders available. Please add some work orders first.
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCreateItinerary}
          disabled={selectedWorkOrders.size === 0}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 3
          }}
        >
          Create Itinerary ({selectedWorkOrders.size} items)
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ItineraryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  workOrders: PropTypes.array,
  onCreateItinerary: PropTypes.func
};

export default ItineraryModal;
