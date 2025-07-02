import {
    Search as SearchIcon,
    KeyboardArrowUp as SortAscIcon,
    KeyboardArrowDown as SortDescIcon,
    Sort as SortIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    InputAdornment,
    TextField
} from '@mui/material';
import PropTypes from 'prop-types';

const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  resultCount,
  onOptimizeRoute
}) => {
  const handleSortToggle = (field) => {
    onSortChange(field);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <SortIcon />;
    return sortOrder === 'asc' ? <SortAscIcon /> : <SortDescIcon />;
  };

  const getSortButtonVariant = (field) => {
    return sortBy === field ? 'contained' : 'outlined';
  };

  return (
    <Card elevation={2} sx={{ mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Search Field */}
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search work orders by name, description, or location..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Grid>

          {/* Filter and Sort Controls */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
              {/* Sort Button */}
              <Button
                variant={getSortButtonVariant('nextDue')}
                size="small"
                onClick={() => handleSortToggle('nextDue')}
                startIcon={getSortIcon('nextDue')}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2
                }}
              >
                Due Date
              </Button>

              {/* Optimize Route Button */}
              <Button
                variant="contained"
                color="success"
                onClick={onOptimizeRoute}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Optimize Route
              </Button>
            </Box>
          </Grid>

          {/* Results Count */}
          {searchTerm && (
            <Grid item xs={12}>
              <Chip
                label={`${resultCount} result${resultCount !== 1 ? 's' : ''} found`}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

SearchAndFilter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  resultCount: PropTypes.number.isRequired,
  onOptimizeRoute: PropTypes.func.isRequired
};

export default SearchAndFilter;
