import {
    FiberNew as NewIcon,
    Warning as OverdueIcon,
    DateRange as ThisWeekIcon,
    Schedule as UpcomingIcon
} from '@mui/icons-material';
import {
    Badge,
    Box,
    Button,
    useTheme
} from '@mui/material';
import PropTypes from 'prop-types';

const FilterButtons = ({
  activeFilter,
  onFilterChange,
  newCount,
  upcomingCount,
  thisWeekCount,
  overdueCount
}) => {
  const theme = useTheme();

  const filters = [
    {
      key: 'new',
      label: 'New',
      count: newCount,
      icon: NewIcon,
      color: theme.palette.info.main,
      activeColor: theme.palette.info.main
    },
    {
      key: 'upcoming',
      label: 'This Month',
      count: upcomingCount,
      icon: UpcomingIcon,
      color: theme.palette.success.main,
      activeColor: theme.palette.success.main
    },
    {
      key: 'thisWeek',
      label: 'This Week',
      count: thisWeekCount,
      icon: ThisWeekIcon,
      color: theme.palette.warning.main,
      activeColor: theme.palette.warning.main
    },
    {
      key: 'overdue',
      label: 'Overdue',
      count: overdueCount,
      icon: OverdueIcon,
      color: theme.palette.error.main,
      activeColor: theme.palette.error.main
    }
  ];

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {filters.map((filter) => {
        const IconComponent = filter.icon;
        const isActive = activeFilter === filter.key;

        return (
          <Badge
            key={filter.key}
            badgeContent={filter.count}
            color="default"
            sx={{
              '& .MuiBadge-badge': {
                right: 6,
                top: 6,
                bgcolor: isActive ? 'white' : theme.palette.grey[600],
                color: isActive ? filter.activeColor : 'white',
                fontWeight: 600,
                fontSize: '0.75rem'
              }
            }}
          >
            <Button
              variant={isActive ? 'contained' : 'outlined'}
              size="small"
              startIcon={<IconComponent />}
              onClick={() => onFilterChange(filter.key)}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                py: 1,
                fontWeight: 600,
                minWidth: 'auto',
                height: '36px', // Match route button height
                ...(isActive ? {
                  backgroundColor: filter.activeColor,
                  borderColor: filter.activeColor,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: filter.activeColor,
                    borderColor: filter.activeColor,
                    filter: 'brightness(0.9)'
                  }
                } : {
                  borderColor: filter.color,
                  color: filter.color,
                  '&:hover': {
                    borderColor: filter.color,
                    backgroundColor: `${filter.color}10`
                  }
                })
              }}
            >
              {filter.label}
            </Button>
          </Badge>
        );
      })}
    </Box>
  );
};

FilterButtons.propTypes = {
  activeFilter: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired,
  newCount: PropTypes.number.isRequired,
  upcomingCount: PropTypes.number.isRequired,
  thisWeekCount: PropTypes.number.isRequired,
  overdueCount: PropTypes.number.isRequired
};

export default FilterButtons;
