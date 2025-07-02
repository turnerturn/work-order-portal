import {
    Close as CloseIcon,
    Search as SearchIcon
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
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types';
import { useState } from 'react';

const AdvancedFilterModal = ({
  open,
  onClose,
  onApply,
  currentFilters
}) => {
  const [filters, setFilters] = useState({
    searchText: currentFilters?.searchText || '',
    cadence: currentFilters?.cadence || 'all',
    activityDateFrom: currentFilters?.activityDateFrom || null,
    activityDateTo: currentFilters?.activityDateTo || null,
    status: currentFilters?.status || 'all'
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      searchText: '',
      cadence: 'all',
      activityDateFrom: null,
      activityDateTo: null,
      status: 'all'
    };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 }
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              Advanced Filters
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>        <DialogContent sx={{ pt: 4, pb: 3, px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Search Text */}
            <TextField
              fullWidth
              label="Search Text"
              variant="outlined"
              placeholder="Search by name, description, or location..."
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }
              }}
            />

            {/* Schedule Cadence */}
            <FormControl fullWidth variant="outlined">
              <InputLabel>Schedule Cadence</InputLabel>
              <Select
                value={filters.cadence}
                label="Schedule Cadence"
                onChange={(e) => handleFilterChange('cadence', e.target.value)}
              >
                <MenuItem value="all">All Cadences</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="annually">Annual</MenuItem>
              </Select>
            </FormControl>

            {/* Activity Date From */}
            <DatePicker
              label="Activity Date From"
              value={filters.activityDateFrom}
              onChange={(value) => handleFilterChange('activityDateFrom', value)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  placeholder: 'Select start date'
                }
              }}
            />

            {/* Activity Date To */}
            <DatePicker
              label="Activity Date To"
              value={filters.activityDateTo}
              onChange={(value) => handleFilterChange('activityDateTo', value)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  placeholder: 'Select end date'
                }
              }}
            />

            {/* Status Filter */}
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="complete">Complete</MenuItem>
                <MenuItem value="incomplete">Incomplete</MenuItem>
                <MenuItem value="canceled">Canceled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleReset}
            variant="outlined"
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Reset All
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

AdvancedFilterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  currentFilters: PropTypes.object
};

export default AdvancedFilterModal;
