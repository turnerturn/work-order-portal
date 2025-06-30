import { Box, Container, Typography } from '@mui/material';
import VersionInfo from './VersionInfo';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 2,
        px: 2,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2025 Work Order Portal. All rights reserved.
          </Typography>
          <VersionInfo showBuildDate />
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
