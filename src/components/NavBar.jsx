import {
    Add as AddIcon,
    Menu as MenuIcon,
    NotificationsOutlined as NotificationsIcon,
    Refresh as RefreshIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import VersionInfo from './VersionInfo';

const NavBar = ({ onAddNewOrder, onRefresh, loading = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        bgcolor: 'white',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side - Logo/Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Work Order Portal
          </Typography>
          <VersionInfo variant="caption" />
        </Box>

        {/* Right side - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMobile && (
            <>
              <IconButton
                color="inherit"
                onClick={onRefresh}
                disabled={loading}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
                title="Refresh"
              >
                <RefreshIcon sx={{
                  animation: loading ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} />
              </IconButton>

              <IconButton
                color="inherit"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
                title="Notifications"
              >
                <NotificationsIcon />
              </IconButton>

              <IconButton
                color="inherit"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
                title="Settings"
              >
                <SettingsIcon />
              </IconButton>
            </>
          )}

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddNewOrder}
            sx={{
              ml: 1,
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 2, sm: 3 },
              py: 1,
              borderRadius: 2,
              fontSize: { xs: '0.875rem', sm: '0.9rem' }
            }}
          >
            {isMobile ? 'New' : 'New Work Order'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  onAddNewOrder: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default NavBar;
