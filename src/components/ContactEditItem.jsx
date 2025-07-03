import {
    Delete as DeleteIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    StarBorder as StarBorderIcon,
    Star as StarIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Checkbox,
    Chip,
    Collapse,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

const ContactEditItem = ({
  contact,
  contactIndex,
  isEditing,
  isExpanded,
  onToggleExpanded,
  onContactChange,
  onPhoneChange,
  onAddPhone,
  onRemovePhone,
  onSetPrimary,
  onRemove
}) => {
  const handleContactFieldChange = useCallback((field, value) => {
    onContactChange(contactIndex, field, value);
  }, [contactIndex, onContactChange]);

  const handlePhoneFieldChange = useCallback((phoneIndex, field, value) => {
    onPhoneChange(contactIndex, phoneIndex, field, value);
  }, [contactIndex, onPhoneChange]);

  const handleAddPhoneClick = useCallback(() => {
    onAddPhone(contactIndex);
  }, [contactIndex, onAddPhone]);

  const handleRemovePhoneClick = useCallback((phoneIndex) => {
    onRemovePhone(contactIndex, phoneIndex);
  }, [contactIndex, onRemovePhone]);

  const handleSetPrimaryClick = useCallback((e) => {
    e.stopPropagation();
    onSetPrimary(contactIndex);
  }, [contactIndex, onSetPrimary]);

  const handleRemoveClick = useCallback((e) => {
    e.stopPropagation();
    onRemove(contactIndex);
  }, [contactIndex, onRemove]);

  const getPhoneDisplayText = () => {
    if (!contact.phones?.length) return 'No phone';
    const phoneCount = contact.phones.length;
    const pluralSuffix = phoneCount !== 1 ? 's' : '';
    const primaryPhone = contact.phones[0]?.phone;
    const countText = `${phoneCount} phone${pluralSuffix}`;
    return primaryPhone ? `${countText} • ${primaryPhone}` : countText;
  };

  const handlePhonePrimaryChange = useCallback((phoneIndex, checked) => {
    if (checked) {
      const updatedPhones = contact.phones.map((p, i) => ({
        ...p,
        primary: i === phoneIndex
      }));
      handleContactFieldChange('phones', updatedPhones);
    }
  }, [contact.phones, handleContactFieldChange]);

  return (
    <Box>
      <ListItem
        sx={{
          py: 2,
          display: 'flex',
          alignItems: 'flex-start',
          cursor: isEditing ? 'pointer' : 'default'
        }}
        onClick={isEditing ? onToggleExpanded : undefined}
      >
        <ListItemIcon>
          <PersonIcon color={contact.primary ? 'primary' : 'inherit'} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: contact.primary ? 600 : 400 }}>
                {contact.name || 'Unnamed Contact'}
              </Typography>
              {contact.primary && (
                <Chip label="Primary" size="small" color="primary" />
              )}
              {isEditing && (
                <Chip
                  label={isExpanded ? 'Collapse' : 'Edit'}
                  size="small"
                  variant="outlined"
                  sx={{ ml: 'auto' }}
                />
              )}
            </Box>
          }
          secondary={
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {contact.email || 'No email'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getPhoneDisplayText()}
              </Typography>
              {contact.notes && (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Notes: {contact.notes}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Preference: {contact.preference || 'voice'}
              </Typography>
            </Box>
          }
        />
        {isEditing && (
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleSetPrimaryClick}
              size="small"
              color={contact.primary ? 'primary' : 'default'}
              title="Set as primary contact"
            >
              {contact.primary ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
            <IconButton
              onClick={handleRemoveClick}
              size="small"
              color="error"
              title="Remove contact"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </ListItem>

      {/* Expanded Contact Edit Form */}
      <Collapse in={isEditing && isExpanded}>
        <Box sx={{ p: 3, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
          <Grid container spacing={2}>
            {/* Basic Contact Info */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                size="small"
                value={contact.name || ''}
                onChange={(e) => handleContactFieldChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                size="small"
                type="email"
                value={contact.email || ''}
                onChange={(e) => handleContactFieldChange('email', e.target.value)}
              />
            </Grid>

            {/* Preference */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Contact Preference</InputLabel>
                <Select
                  value={contact.preference || 'voice'}
                  label="Contact Preference"
                  onChange={(e) => handleContactFieldChange('preference', e.target.value)}
                >
                  <MenuItem value="voice">Voice Call</MenuItem>
                  <MenuItem value="sms">SMS Text</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Primary Toggle */}
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={contact.primary || false}
                    onChange={(e) => e.target.checked && onSetPrimary(contactIndex)}
                  />
                }
                label="Primary Contact"
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                size="small"
                multiline
                rows={2}
                value={contact.notes || ''}
                onChange={(e) => handleContactFieldChange('notes', e.target.value)}
                placeholder="Special instructions, preferred contact times, etc."
              />
            </Grid>

            {/* Phone Numbers Section */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Phone Numbers ({contact.phones?.length || 0})
                </Typography>
                <Button
                  startIcon={<PhoneIcon />}
                  onClick={handleAddPhoneClick}
                  size="small"
                  variant="outlined"
                  sx={{ textTransform: 'none' }}
                >
                  Add Phone
                </Button>
              </Box>

              {contact.phones?.map((phone, phoneIndex) => (
                <Box key={`phone-${contact.name || contactIndex}-${phoneIndex}`} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={phone.type || 'mobile'}
                          label="Type"
                          onChange={(e) => handlePhoneFieldChange(phoneIndex, 'type', e.target.value)}
                        >
                          <MenuItem value="mobile">Mobile</MenuItem>
                          <MenuItem value="home">Home</MenuItem>
                          <MenuItem value="work">Work</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        size="small"
                        value={phone.phone || ''}
                        onChange={(e) => handlePhoneFieldChange(phoneIndex, 'phone', e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={phone['sms-enabled'] || false}
                            onChange={(e) => handlePhoneFieldChange(phoneIndex, 'sms-enabled', e.target.checked)}
                            size="small"
                          />
                        }
                        label="SMS"
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={phone.primary || false}
                            onChange={(e) => handlePhonePrimaryChange(phoneIndex, e.target.checked)}
                            size="small"
                          />
                        }
                        label="Primary"
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <IconButton
                        onClick={() => handleRemovePhoneClick(phoneIndex)}
                        size="small"
                        color="error"
                        disabled={contact.phones?.length <= 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              )) || (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No phone numbers added yet
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
};

ContactEditItem.propTypes = {
  contact: PropTypes.object.isRequired,
  contactIndex: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggleExpanded: PropTypes.func.isRequired,
  onContactChange: PropTypes.func.isRequired,
  onPhoneChange: PropTypes.func.isRequired,
  onAddPhone: PropTypes.func.isRequired,
  onRemovePhone: PropTypes.func.isRequired,
  onSetPrimary: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default ContactEditItem;
