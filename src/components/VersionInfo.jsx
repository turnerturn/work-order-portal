import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import packageJson from '../../package.json';

const VersionInfo = ({ variant = 'caption', showBuildDate = false }) => {
  const version = packageJson.version;
  const buildDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      opacity: 0.7,
      fontSize: '0.75rem'
    }}>
      <Typography variant={variant} color="text.secondary">
        v{version}
      </Typography>
      {showBuildDate && (
        <Typography variant={variant} color="text.secondary">
          • {buildDate}
        </Typography>
      )}
    </Box>
  );
};

VersionInfo.propTypes = {
  variant: PropTypes.string,
  showBuildDate: PropTypes.bool
};

export default VersionInfo;
