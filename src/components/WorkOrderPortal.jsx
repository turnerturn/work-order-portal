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
import directionsService from '../services/directionsService';
import { isNewWorkOrder, isOverdue, isThisWeek, isUpcoming } from '../utils/dateUtils';
import DashboardStats from './DashboardStats';
import NavBar from './NavBar';
import OptimizeRouteModal from './OptimizeRouteModal';
import SearchAndFilter from './SearchAndFilter';
import WorkOrderCard from './WorkOrderCard';
import WorkOrderDetailsModal from './WorkOrderDetailsModal';

const WorkOrderPortal = () => {
  const { workOrders, loading, error, refreshWorkOrders } = useWorkOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [dashboardFilter, setDashboardFilter] = useState(null); // New filter from dashboard clicks
  const [sortBy, setSortBy] = useState('nextDue');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [optimizeModalOpen, setOptimizeModalOpen] = useState(false);
  const [optimizedOrder, setOptimizedOrder] = useState(null);

  // Filter and sort work orders
  const filteredAndSortedWorkOrders = React.useMemo(() => {
    let filtered = workOrders.filter(wo => {
      const matchesSearch = wo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          wo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          wo.address.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Apply dashboard filter if set
      if (dashboardFilter) {
        switch (dashboardFilter) {
          case 'all':
            return true; // Show all work orders
          case 'new':
            return isNewWorkOrder(wo['created-date']);
          case 'upcoming':
            return isUpcoming(wo.schedule.nextDue);
          case 'thisWeek':
            return isThisWeek(wo.schedule.nextDue);
          case 'overdue':
            return isOverdue(wo.schedule.nextDue);
          default:
            return true;
        }
      }

      return true;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'nextDue':
          aValue = new Date(a.schedule.nextDue);
          bValue = new Date(b.schedule.nextDue);
          break;
        case 'created':
          aValue = new Date(a['created-date']);
          bValue = new Date(b['created-date']);
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      }
    });

    return filtered;
  }, [workOrders, searchTerm, dashboardFilter, sortBy, sortOrder]);

  // Calculate dashboard stats
  const newCount = workOrders.filter(wo => isNewWorkOrder(wo['created-date'])).length;
  const overdueCount = workOrders.filter(wo => isOverdue(wo.schedule.nextDue)).length;
  const upcomingCount = workOrders.filter(wo => isUpcoming(wo.schedule.nextDue)).length;
  const thisWeekCount = workOrders.filter(wo => isThisWeek(wo.schedule.nextDue)).length;

  const handleAddNewOrder = () => {
    console.log('Add new work order');
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

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleOptimizeRoute = () => setOptimizeModalOpen(true);

  const handleDashboardStatClick = (filterType) => {
    setDashboardFilter(dashboardFilter === filterType ? null : filterType);
  };

  const handleOptimizeSubmit = async (origin) => {
    setOptimizeModalOpen(false);
    // Call directionsService.optimizeRoute
    try {
      const destinations = filteredAndSortedWorkOrders.map(wo => wo.address);
      const result = await directionsService.optimizeRoute(origin, destinations);
      if (result.status === 'OK' && result.routes[0]) {
        setOptimizedOrder(result.routes[0].waypoint_order);
      }
    } catch (error) {
      // Handle error by logging and resetting optimized order
      console.error('Failed to optimize route:', error);
      setOptimizedOrder(null);
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
        {/* Dashboard Stats */}
        <DashboardStats
          totalCount={workOrders.length}
          newCount={newCount}
          upcomingCount={upcomingCount}
          thisWeekCount={thisWeekCount}
          overdueCount={overdueCount}
          onStatClick={handleDashboardStatClick}
        />

        {/* Search and Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={toggleSort}
          resultCount={filteredAndSortedWorkOrders.length}
          onOptimizeRoute={handleOptimizeRoute}
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

      {/* Optimize Route Modal */}
      <OptimizeRouteModal
        open={optimizeModalOpen}
        onClose={() => setOptimizeModalOpen(false)}
        onSubmit={handleOptimizeSubmit}
      />
    </Box>
  );
};

export default WorkOrderPortal;
