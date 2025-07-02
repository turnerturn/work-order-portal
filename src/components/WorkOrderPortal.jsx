import {
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useWorkOrders } from '../hooks/useWorkOrders';
import { isNewWorkOrder, isOverdue, isThisWeek, isUpcoming } from '../utils/dateUtils';
import NavBar from './NavBar';
import SearchAndFilter from './SearchAndFilter';
import WorkOrderCard from './WorkOrderCard';
import WorkOrderDetailsModal from './WorkOrderDetailsModal';

const WorkOrderPortal = () => {
  const { workOrders, loading, error, refreshWorkOrders } = useWorkOrders();
  const [activeFilter, setActiveFilter] = useState(null);
  const [advancedFilters, setAdvancedFilters] = useState({
    searchText: '',
    cadence: 'all',
    activityDateFrom: null,
    activityDateTo: null,
    status: 'all'
  });
  const [routeOptimized, setRouteOptimized] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [optimizedOrder, setOptimizedOrder] = useState(null);

  // Filter and sort work orders
  const filteredAndSortedWorkOrders = React.useMemo(() => {
    let filtered = workOrders.filter(wo => {
      // Apply text search from advanced filters
      if (advancedFilters.searchText) {
        const searchTerm = advancedFilters.searchText.toLowerCase();
        const matchesSearch = wo.name.toLowerCase().includes(searchTerm) ||
                            wo.description.toLowerCase().includes(searchTerm) ||
                            wo.address.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Apply dashboard filter
      if (activeFilter) {
        switch (activeFilter) {
          case 'new':
            return isNewWorkOrder(wo['created-date']);
          case 'upcoming':
            return isUpcoming(wo.schedule.nextDue);
          case 'thisWeek':
            return isThisWeek(wo.schedule.nextDue);
          case 'overdue':
            return isOverdue(wo.schedule.nextDue);
          default:
            break;
        }
      }

      // Apply advanced filters
      if (advancedFilters.cadence && advancedFilters.cadence !== 'all') {
        if (wo.schedule.frequency !== advancedFilters.cadence) return false;
      }

      return true;
    });

    return filtered;
  }, [workOrders, activeFilter, advancedFilters]);

  // Calculate dashboard stats
  const newCount = workOrders.filter(wo => isNewWorkOrder(wo['created-date'])).length;
  const overdueCount = workOrders.filter(wo => isOverdue(wo.schedule.nextDue)).length;
  const upcomingCount = workOrders.filter(wo => isUpcoming(wo.schedule.nextDue)).length;
  const thisWeekCount = workOrders.filter(wo => isThisWeek(wo.schedule.nextDue)).length;

  const handleAddNewOrder = () => {
    console.log('Add new work order');
  };

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    if (filterType) {
      setRouteOptimized(false); // Reset route optimization when changing filters
      setOptimizedOrder(null);
    }
  };

  const handleAdvancedFiltersChange = (filters) => {
    setAdvancedFilters(filters);
    setRouteOptimized(false); // Reset route optimization when changing filters
    setOptimizedOrder(null);
  };

  const handleViewDetails = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setDetailsModalOpen(true);
  };

  const handleSchedule = (workOrder, date) => {
    console.log('Schedule work order:', workOrder, 'for date:', date);
    // Here you would typically update the work order schedule in your backend
  };

  const handleSaveWorkOrder = (updatedWorkOrder) => {
    console.log('Save work order:', updatedWorkOrder);
    // Here you would typically update the work order in your backend
    setDetailsModalOpen(false);
    setSelectedWorkOrder(null);
  };

  const handleOptimizeRoute = async (originAddress) => {
    if (!originAddress) {
      // Turn off optimization
      setRouteOptimized(false);
      setOptimizedOrder(null);
      return;
    }

    try {
      setIsOptimizing(true);

      // Call the directions service to get optimized route
      const optimizedWorkOrders = await optimizeRoute(originAddress, filteredAndSortedWorkOrders);

      if (optimizedWorkOrders && optimizedWorkOrders.length > 0) {
        setRouteOptimized(true);
        // Convert work orders back to indices for current implementation
        const indices = optimizedWorkOrders.map(wo =>
          filteredAndSortedWorkOrders.findIndex(fwo => fwo.uuid === wo.uuid)
        );
        setOptimizedOrder(indices);
      } else {
        // If optimization failed, turn off optimization
        setRouteOptimized(false);
        setOptimizedOrder(null);
      }
    } catch (error) {
      console.error('Error optimizing route:', error);
      setRouteOptimized(false);
      setOptimizedOrder(null);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
          Loading Work Orders
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we fetch your data...
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation Bar */}
      <NavBar
        onAddNewOrder={handleAddNewOrder}
        onRefresh={refreshWorkOrders}
        loading={loading}
      />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search and Filter */}
        <SearchAndFilter
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          newCount={newCount}
          upcomingCount={upcomingCount}
          thisWeekCount={thisWeekCount}
          overdueCount={overdueCount}
          routeOptimized={routeOptimized}
          onOptimizeRoute={handleOptimizeRoute}
          workOrdersToOptimize={filteredAndSortedWorkOrders}
          isOptimizing={isOptimizing}
          advancedFilters={advancedFilters}
          onAdvancedFiltersChange={handleAdvancedFiltersChange}
          resultCount={filteredAndSortedWorkOrders.length}
        />

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
              Unable to load work orders
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={refreshWorkOrders}
              sx={{ textTransform: 'none' }}
            >
              Try again
            </Button>
          </Alert>
        )}

        {/* Work Orders Grid */}
        {filteredAndSortedWorkOrders.length === 0 ? (
          <Paper
            elevation={2}
            sx={{
              textAlign: 'center',
              py: 8,
              px: 4,
              borderRadius: 3,
              bgcolor: 'background.paper'
            }}
          >
            <AssignmentIcon
              sx={{
                fontSize: 64,
                color: 'text.disabled',
                mb: 3
              }}
            />
            <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
              { 'No work orders found...'}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}
            >
              {'Try adjusting your filters.'}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {(optimizedOrder
              ? optimizedOrder.map(idx => filteredAndSortedWorkOrders[idx])
              : filteredAndSortedWorkOrders
            ).map((workOrder) => (
              <Grid item xs={12} key={workOrder.uuid}>
                <WorkOrderCard
                  workOrder={workOrder}
                  onViewDetails={handleViewDetails}
                  onSchedule={(date) => handleSchedule(workOrder, date)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Work Order Details Modal */}
      <WorkOrderDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedWorkOrder(null);
        }}
        workOrder={selectedWorkOrder}
        onSave={handleSaveWorkOrder}
      />

    </Box>
  );
};

export default WorkOrderPortal;
