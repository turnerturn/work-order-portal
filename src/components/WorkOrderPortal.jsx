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
import { optimizeRoute } from '../services/directionsService';
import { formatDate, isWorkOrderNew, isWorkOrderOverdueNew, isWorkOrderUpcoming } from '../utils/dateUtils';
import NavBar from './NavBar';
import ScheduleNotification from './ScheduleNotification';
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

  // Notification states
  const [scheduleNotificationOpen, setScheduleNotificationOpen] = useState(false);
  const [scheduledDateText, setScheduledDateText] = useState('');

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

      // Apply quick filter (activeFilter)
      if (activeFilter) {
        let passesQuickFilter = false;
        switch (activeFilter) {
          case 'new':
            passesQuickFilter = isWorkOrderNew(wo);
            break;
          case 'upcoming':
            passesQuickFilter = isWorkOrderUpcoming(wo);
            break;
          case 'overdue':
            passesQuickFilter = isWorkOrderOverdueNew(wo);
            break;
          default:
            passesQuickFilter = true;
        }
        if (!passesQuickFilter) return false;
      }

      // Apply advanced filters
      if (advancedFilters.cadence && advancedFilters.cadence !== 'all') {
        if (wo.schedule?.frequency !== advancedFilters.cadence) return false;
      }

      return true;
    });

    return filtered;
  }, [workOrders, activeFilter, advancedFilters]);

  // Ensure filteredAndSortedWorkOrders is always an array
  const safeFilteredWorkOrders = filteredAndSortedWorkOrders || [];

  // Calculate dashboard stats
  const newCount = workOrders.filter(wo => isWorkOrderNew(wo)).length;
  const overdueCount = workOrders.filter(wo => isWorkOrderOverdueNew(wo)).length;
  const upcomingCount = workOrders.filter(wo => isWorkOrderUpcoming(wo)).length;

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

    // Show notification with formatted date
    const formattedDate = formatDate(date);
    setScheduledDateText(formattedDate);
    setScheduleNotificationOpen(true);

    // Note: New activity with status 'incomplete' would be added to work order here
    // This would typically be handled by the backend/state management
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
      const optimizedWorkOrders = await optimizeRoute(originAddress, safeFilteredWorkOrders);

      if (optimizedWorkOrders && optimizedWorkOrders.length > 0) {
        setRouteOptimized(true);
        // Convert work orders back to indices for current implementation
        const indices = optimizedWorkOrders.map(wo =>
          safeFilteredWorkOrders.findIndex(fwo => fwo.uuid === wo.uuid)
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
          overdueCount={overdueCount}
          routeOptimized={routeOptimized}
          onOptimizeRoute={handleOptimizeRoute}
          workOrdersToOptimize={safeFilteredWorkOrders}
          isOptimizing={isOptimizing}
          advancedFilters={advancedFilters}
          onAdvancedFiltersChange={handleAdvancedFiltersChange}
          resultCount={safeFilteredWorkOrders.length}
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
        {safeFilteredWorkOrders.length === 0 ? (
          <Paper
            elevation={2}
            sx={{
              textAlign: 'center',
              py: 8,
              px: 4,
              borderRadius: 3,
              bgcolor: 'background.paper',
              maxWidth: 'xl',
              mx: 'auto'
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
            {(optimizedOrder && safeFilteredWorkOrders.length > 0
              ? optimizedOrder.map(idx => safeFilteredWorkOrders[idx]).filter(Boolean)
              : safeFilteredWorkOrders
            ).map((workOrder) => (
              <Grid size={12} key={workOrder.uuid}>
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

      {/* Schedule Notification */}
      <ScheduleNotification
        open={scheduleNotificationOpen}
        onClose={() => setScheduleNotificationOpen(false)}
        scheduledDate={scheduledDateText}
      />

    </Box>
  );
};

export default WorkOrderPortal;
