import {
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Route as RouteIcon
} from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import AdvancedFilterModal from './AdvancedFilterModal';
import FilterButtons from './FilterButtons';

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
  // Advanced filter props
  advancedFilters,
  onAdvancedFiltersChange,
  // Results
  resultCount
}) => {
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);

  const getActiveFilterCount = () => {
    if (!advancedFilters) return 0;
    let count = 0;
    if (advancedFilters.searchText) count++;
    if (advancedFilters.cadence && advancedFilters.cadence !== 'all') count++;
    if (advancedFilters.activityDateFrom || advancedFilters.activityDateTo) count++;
    if (advancedFilters.status && advancedFilters.status !== 'all') count++;
    return count;
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

  return (
    <Box>
      {/* Controls Row */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            {/* Left side - Route button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Route Optimization Toggle */}
              <Button
                variant={routeOptimized ? 'contained' : 'outlined'}
                size="small"
                startIcon={<RouteIcon />}
                onClick={onOptimizeRoute}
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
                Route
              </Button>
            </Box>

            {/* Center - Filter Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-start', ml: 2 }}>
              <FilterButtons
                activeFilter={activeFilter}
                onFilterChange={onFilterChange}
                newCount={newCount}
                upcomingCount={upcomingCount}
                thisWeekCount={thisWeekCount}
                overdueCount={overdueCount}
              />
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
              {(getActiveFilterCount() > 0 || activeFilter) && (
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

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        open={advancedFilterOpen}
        onClose={() => setAdvancedFilterOpen(false)}
        onApply={handleAdvancedFiltersApply}
        currentFilters={advancedFilters}
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
