import {
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';

const DashboardStats = ({
  totalCount,
  newCount,
  upcomingCount,
  thisWeekCount,
  overdueCount,
  onStatClick
}) => {
  const theme = useTheme();

  const stats = [
    {
      title: 'All',
      value: totalCount,
      icon: AssignmentIcon,
      color: theme.palette.primary.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      lightColor: theme.palette.primary.light,
      filterType: 'all'
    },
    {
      title: 'New',
      value: newCount,
      icon: AssignmentIcon,
      color: theme.palette.info.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
      lightColor: theme.palette.info.light,
      filterType: 'new'
    },
    {
      title: 'Upcoming',
      value: upcomingCount,
      icon: ScheduleIcon,
      color: theme.palette.success.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
      lightColor: theme.palette.success.light,
      filterType: 'upcoming'
    },
    {
      title: 'This Week',
      value: thisWeekCount,
      icon: AssignmentIcon,
      color: theme.palette.warning.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
      lightColor: theme.palette.warning.light,
      filterType: 'thisWeek'
    },
    {
      title: 'Overdue',
      value: overdueCount,
      icon: WarningIcon,
      color: theme.palette.error.main,
      bgGradient: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
      lightColor: theme.palette.error.light,
      filterType: 'overdue'
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Grid item xs={12} sm={6} md={2.4} key={stat.title}>
            <Card
              elevation={3}
              onClick={() => onStatClick?.(stat.filterType)}
              sx={{
                background: stat.bgGradient,
                color: 'white',
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s ease-in-out',
                cursor: onStatClick ? 'pointer' : 'default',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              {/* Background decoration */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  zIndex: 0
                }}
              />

              <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: 500,
                        mb: 1,
                        fontSize: '0.875rem'
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h3"
                      component="div"
                      sx={{
                        fontWeight: 700,
                        color: 'white',
                        lineHeight: 1
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <IconComponent sx={{ fontSize: 28, color: 'white' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

DashboardStats.propTypes = {
  totalCount: PropTypes.number.isRequired,
  newCount: PropTypes.number.isRequired,
  upcomingCount: PropTypes.number.isRequired,
  thisWeekCount: PropTypes.number.isRequired,
  overdueCount: PropTypes.number.isRequired,
  onStatClick: PropTypes.func
};

export default DashboardStats;
