import {
    Close as CloseIcon,
    FiberNew as NewIcon,
    Warning as OverdueIcon,
    Search as SearchIcon,
    DateRange as ThisWeekIcon,
    Schedule as UpcomingIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
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
  currentFilters,
  // Dashboard filter props
  activeFilter,
  onFilterChange,
  newCount,
  upcomingCount,
  thisWeekCount,
  overdueCount
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
    onFilterChange(null); // Clear dashboard filter
    onClose();
  };

  const statFilters = [
    {
      key: 'new',
      label: 'New',
      count: newCount,
      icon: NewIcon,
      color: 'info'
    },
    {
      key: 'upcoming',
      label: 'This Month',
      count: upcomingCount,
      icon: UpcomingIcon,
      color: 'success'
    },
    {
      key: 'thisWeek',
      label: 'This Week',
      count: thisWeekCount,
      icon: ThisWeekIcon,
      color: 'warning'
    },
    {
      key: 'overdue',
      label: 'Overdue',
      count: overdueCount,
      icon: OverdueIcon,
      color: 'error'
    }
  ];

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
        </DialogTitle>

        <DialogContent sx={{ pt: 4, pb: 3, px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Dashboard Filter Chips */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                Quick Filters
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {statFilters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <Chip
                      key={filter.key}
                      icon={<Icon sx={{ fontSize: 16 }} />}
                      label={`${filter.label} (${filter.count})`}
                      variant={activeFilter === filter.key ? 'filled' : 'outlined'}
                      color={filter.color}
                      clickable
                      onClick={() => onFilterChange(activeFilter === filter.key ? null : filter.key)}
                      sx={{
                        '& .MuiChip-icon': {
                          fontSize: 16
                        }
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
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
  currentFilters: PropTypes.object,
  // Dashboard filter props
  activeFilter: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired,
  newCount: PropTypes.number.isRequired,
  upcomingCount: PropTypes.number.isRequired,
  thisWeekCount: PropTypes.number.isRequired,
  overdueCount: PropTypes.number.isRequired
};

export default AdvancedFilterModal;
