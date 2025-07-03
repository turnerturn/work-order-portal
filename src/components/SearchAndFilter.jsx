import {
  Clear as ClearIcon,
  Close as CloseIcon,
  DateRange as DateRangeIcon,
  FilterList as FilterIcon,
  Route as RouteIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import AdvancedFilterModal from './AdvancedFilterModal';
import RouteOptimizationModal from './RouteOptimizationModal';

const SearchAndFilter = ({
  // Dashboard filter props
  activeFilter,
  onFilterChange,
  newCount,
  upcomingCount,
  thisWeekCount,
  overdueCount,
  // Route optimization props
  routeOptimized,
  onOptimizeRoute,
  workOrdersToOptimize,
  isOptimizing,
  // Advanced filter props
  advancedFilters,
  onAdvancedFiltersChange,
  // Results
  resultCount
}) => {
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
  const [routeModalOpen, setRouteModalOpen] = useState(false);

  const getActiveFilterCount = () => {
    if (!advancedFilters) return 0;
    let count = 0;
    if (advancedFilters.searchText) count++;
    if (advancedFilters.cadence && advancedFilters.cadence !== 'all') count++;
    if (advancedFilters.activityDateFrom || advancedFilters.activityDateTo) count++;
    if (advancedFilters.status && advancedFilters.status !== 'all') count++;
    // Note: activeFilter (quick filters) is not included in advanced filter count
    return count;
  };

  const getFilterBadges = () => {
    const badges = [];

    // Dashboard filter badge
    if (activeFilter) {
      const filterLabels = {
        new: 'New',
        upcoming: 'This Month',
        thisWeek: 'This Week',
        overdue: 'Overdue'
      };
      badges.push({
        key: 'dashboard',
        label: filterLabels[activeFilter],
        onRemove: () => onFilterChange(null)
      });
    }

    // Advanced filter badges
    if (advancedFilters.searchText) {
      badges.push({
        key: 'search',
        label: `Search: "${advancedFilters.searchText}"`,
        icon: SearchIcon,
        onRemove: () => onAdvancedFiltersChange({ ...advancedFilters, searchText: '' })
      });
    }

    if (advancedFilters.cadence && advancedFilters.cadence !== 'all') {
      badges.push({
        key: 'cadence',
        label: `Cadence: ${advancedFilters.cadence}`,
        icon: ScheduleIcon,
        onRemove: () => onAdvancedFiltersChange({ ...advancedFilters, cadence: 'all' })
      });
    }

    if (advancedFilters.activityDateFrom || advancedFilters.activityDateTo) {
      const fromDate = advancedFilters.activityDateFrom ? advancedFilters.activityDateFrom.toLocaleDateString() : '';
      const toDate = advancedFilters.activityDateTo ? advancedFilters.activityDateTo.toLocaleDateString() : '';
      let dateLabel = 'Date: ';
      if (fromDate && toDate) {
        dateLabel += `${fromDate} - ${toDate}`;
      } else if (fromDate) {
        dateLabel += `From ${fromDate}`;
      } else if (toDate) {
        dateLabel += `Until ${toDate}`;
      }
      badges.push({
        key: 'dates',
        label: dateLabel,
        icon: DateRangeIcon,
        onRemove: () => onAdvancedFiltersChange({
          ...advancedFilters,
          activityDateFrom: null,
          activityDateTo: null
        })
      });
    }

    if (advancedFilters.status && advancedFilters.status !== 'all') {
      badges.push({
        key: 'status',
        label: `Status: ${advancedFilters.status}`,
        onRemove: () => onAdvancedFiltersChange({ ...advancedFilters, status: 'all' })
      });
    }

    return badges;
  };

  const handleAdvancedFiltersApply = (filters) => {
    onAdvancedFiltersChange(filters);
  };

  const handleResetFilters = () => {
    onAdvancedFiltersChange({
      searchText: '',
      cadence: 'all',
      activityDateFrom: null,
      activityDateTo: null,
      status: 'all'
    });
    onFilterChange(null); // Clear any active filter
  };

  const handleRouteOptimizationSubmit = async (originAddress) => {
    try {
      // If already optimized, turn off optimization
      if (routeOptimized) {
        onOptimizeRoute(null);
        setRouteModalOpen(false);
        return;
      }

      // Call onOptimizeRoute with the origin address to trigger optimization
      onOptimizeRoute(originAddress);
      setRouteModalOpen(false);
    } catch (error) {
      console.error('Error optimizing route:', error);
      // Don't close modal on error - let user try again
    }
  };

  const handleRouteButtonClick = () => {
    if (routeOptimized) {
      // If already optimized, turn it off immediately
      onOptimizeRoute(null);
    } else {
      // Open modal to get origin address
      setRouteModalOpen(true);
    }
  };

  const filterBadges = getFilterBadges();

  return (
    <Box>
      {/* Controls Row */}
      <Card elevation={2} sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            {/* Left side - Route button and Quick Filters */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              {/* Route Optimization Button */}
              <Button
                variant={routeOptimized ? 'contained' : 'outlined'}
                size="small"
                startIcon={<RouteIcon />}
                onClick={handleRouteButtonClick}
                color="success"
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  height: '36px', // Match filter button height
                  ...(routeOptimized && {
                    backgroundColor: 'success.main',
                    '&:hover': {
                      backgroundColor: 'success.dark'
                    }
                  })
                }}
              >
                {'Route'}
              </Button>

              {/* Quick Filter Buttons */}
              <Button
                variant={activeFilter === 'new' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => onFilterChange(activeFilter === 'new' ? null : 'new')}
                color="primary"
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  height: '36px',
                  minWidth: 'auto',
                  px: 1.5
                }}
              >
                New {newCount > 0 && `(${newCount})`}
              </Button>

              <Button
                variant={activeFilter === 'upcoming' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => onFilterChange(activeFilter === 'upcoming' ? null : 'upcoming')}
                color="info"
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  height: '36px',
                  minWidth: 'auto',
                  px: 1.5
                }}
              >
                Upcoming {upcomingCount > 0 && `(${upcomingCount})`}
              </Button>

              <Button
                variant={activeFilter === 'thisWeek' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => onFilterChange(activeFilter === 'thisWeek' ? null : 'thisWeek')}
                color="warning"
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  height: '36px',
                  minWidth: 'auto',
                  px: 1.5
                }}
              >
                This Week {thisWeekCount > 0 && `(${thisWeekCount})`}
              </Button>

              <Button
                variant={activeFilter === 'overdue' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => onFilterChange(activeFilter === 'overdue' ? null : 'overdue')}
                color="error"
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  height: '36px',
                  minWidth: 'auto',
                  px: 1.5
                }}
              >
                Overdue {overdueCount > 0 && `(${overdueCount})`}
              </Button>
            </Box>

            {/* Right side - Filters and Results */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              {/* Advanced Filter Button with Badge */}
              <Badge
                badgeContent={getActiveFilterCount()}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    display: getActiveFilterCount() > 0 ? 'block' : 'none',
                    fontSize: '0.75rem',
                    height: 18,
                    minWidth: 18,
                    borderRadius: '50%'
                  }
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FilterIcon />}
                  onClick={() => setAdvancedFilterOpen(true)}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Filters
                </Button>
              </Badge>

              {/* Reset Button - show only when filters are active */}
              {(getActiveFilterCount() > 0) && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={handleResetFilters}
                  color="error"
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Reset
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Filtered Record Count */}
      <Box sx={{ mb: 2, px: 1 }}>
        <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          Showing {resultCount} work {resultCount === 1 ? 'order' : 'orders'}
          {(getActiveFilterCount() > 0 || activeFilter) && ' (filtered)'}
        </Box>
      </Box>

      {/* Filter Badges */}
      {filterBadges.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filterBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <Chip
                  key={badge.key}
                  label={badge.label}
                  variant="filled"
                  color="primary"
                  size="small"
                  icon={Icon ? <Icon sx={{ fontSize: 16 }} /> : undefined}
                  onDelete={badge.onRemove}
                  deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    '& .MuiChip-deleteIcon': {
                      fontSize: 16,
                      '&:hover': {
                        color: 'primary.dark'
                      }
                    }
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        open={advancedFilterOpen}
        onClose={() => setAdvancedFilterOpen(false)}
        onApply={handleAdvancedFiltersApply}
        currentFilters={advancedFilters}
      />

      {/* Route Optimization Modal */}
      <RouteOptimizationModal
        open={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        onOptimize={handleRouteOptimizationSubmit}
        workOrdersToOptimize={workOrdersToOptimize ? workOrdersToOptimize.length : 0}
        isOptimizing={isOptimizing || false}
      />
    </Box>
  );
};

SearchAndFilter.propTypes = {
  // Dashboard filter props
  activeFilter: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired,
  newCount: PropTypes.number.isRequired,
  upcomingCount: PropTypes.number.isRequired,
  thisWeekCount: PropTypes.number.isRequired,
  overdueCount: PropTypes.number.isRequired,
  // Route optimization props
  routeOptimized: PropTypes.bool,
  onOptimizeRoute: PropTypes.func.isRequired,
  workOrdersToOptimize: PropTypes.array,
  isOptimizing: PropTypes.bool,
  // Advanced filter props
  advancedFilters: PropTypes.shape({
    searchText: PropTypes.string,
    cadence: PropTypes.string,
    activityDateFrom: PropTypes.object,
    activityDateTo: PropTypes.object,
    status: PropTypes.string
  }),
  onAdvancedFiltersChange: PropTypes.func.isRequired,
  // Results
  resultCount: PropTypes.number.isRequired
};

export default SearchAndFilter;
