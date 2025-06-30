import {
  Add as AddIcon,
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
import { isOverdue } from '../utils/dateUtils';
import DashboardStats from './DashboardStats';
import NavBar from './NavBar';
import SearchAndFilter from './SearchAndFilter';
import WorkOrderCard from './WorkOrderCard';

const WorkOrderPortal = () => {
  const { workOrders, loading, error, refreshWorkOrders } = useWorkOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('nextDue');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter and sort work orders
  const filteredAndSortedWorkOrders = React.useMemo(() => {
    let filtered = workOrders.filter(wo => {
      const matchesSearch = wo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          wo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          wo.address.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      switch (filterStatus) {
        case 'overdue':
          return isOverdue(wo.schedule.nextDue);
        case 'upcoming':
          return !isOverdue(wo.schedule.nextDue);
        default:
          return true;
      }
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
  }, [workOrders, searchTerm, filterStatus, sortBy, sortOrder]);  const overdueCount = workOrders.filter(wo => isOverdue(wo.schedule.nextDue)).length;
  const upcomingCount = workOrders.filter(wo => !isOverdue(wo.schedule.nextDue)).length;

  const handleAddNewOrder = () => {
    console.log('Add new work order');
  };

  const handleScheduleClick = (workOrder) => {
    console.log('Schedule clicked for:', workOrder.name);
  };

  const handleViewDetails = (workOrder) => {
    console.log('View details for:', workOrder.name);
  };

  const handleScheduleWork = (workOrder) => {
    console.log('Schedule work for:', workOrder.name);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
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
          overdueCount={overdueCount}
          upcomingCount={upcomingCount}
        />

        {/* Search and Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={toggleSort}
          resultCount={filteredAndSortedWorkOrders.length}
          onOptimizeRoute={() => {}}
          thisWeekWorkOrdersCount={0}
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
              {searchTerm ? 'No matching work orders' : 'No work orders yet'}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}
            >
              {searchTerm
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'Get started by creating your first work order to track maintenance and schedules.'
              }
            </Typography>
            {!searchTerm && (
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleAddNewOrder}
                sx={{
                  textTransform: 'none',
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                Create Work Order
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredAndSortedWorkOrders.map((workOrder) => (
              <Grid item xs={12} lg={6} key={workOrder.uuid}>
                <WorkOrderCard
                  workOrder={workOrder}
                  onScheduleClick={handleScheduleClick}
                  onViewDetails={handleViewDetails}
                  onScheduleWork={handleScheduleWork}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default WorkOrderPortal;
