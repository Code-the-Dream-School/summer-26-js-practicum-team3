import { useEffect, useState } from 'react';
import { getProfile } from '../features/auth/api/authApi';
// import { useEditableState } from '../utils/customHooks/useEditibleState';
import {
  Card,
  Box,
  CardContent,
  Typography,
  Grid,
  Divider,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';

export default function Profile() {
  const [profile, setProfile] = useState({
    activity_level: 'sedentary',
    created_at: null,
    dob: null,
    email: null,
    id: null,
    name: null,
    sex: null,
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { status, data } = await getProfile();
      if (status === 200) {
        console.log('said data: ', data);
        setProfile((prev) => ({
          ...data,
          activity_level:
            data.activity_level === null ? prev.activity_level : 'sedentary',
        }));
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);
  function handleChange(currentValue) {
    setProfile((previous) => ({
      ...previous,
      activity_level: currentValue,
    }));
  }
  async function handleUpdate(e) {
    e.preventDefault();
    setIsEditing(false);
  }
  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
      sx={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}
    >
      {loading && <Typography>Loading...</Typography>}
      {!profile && <Typography>Error loading profile.</Typography>}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        My Profile
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Personal Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Name:
              </Typography>
              {isEditing ? (
                <TextField variant="standard" value={profile.name} />
              ) : (
                <Typography variant="body1">
                  {profile?.name || 'N/A'}
                </Typography>
              )}
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Email:
              </Typography>
              {isEditing ? (
                <TextField
                  sx={{ width: '250px' }}
                  variant="standard"
                  value={profile.email}
                />
              ) : (
                <Typography variant="body1">
                  {profile?.email || 'N/A'}
                </Typography>
              )}
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Date of Birth:
              </Typography>
              {isEditing ? (
                <TextField variant="standard" placeholder="MM/DD/YYYY" />
              ) : (
                <Typography variant="body1">
                  {profile?.dob || 'Not provided'}
                </Typography>
              )}
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Activity Level:
              </Typography>
              {isEditing ? (
                <ActivityLevelOptions
                  onChange={handleChange}
                  value={profile.activity_level}
                />
              ) : (
                <Typography variant="body1">
                  {profile?.activity_level || 'Not provided'}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {isEditing ? (
          <Button
            type="submit"
            onClick={handleUpdate}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setIsEditing((p) => !p)}
            variant="contained"
            color="primary"
          >
            Edit
          </Button>
        )}
        <Button variant="outlined" color="secondary">
          Change Password
        </Button>
      </Box>
    </Box>
  );
}
const NO_OP = () => {};
function ActivityLevelOptions({ value, onChange = NO_OP }) {
  return (
    <TextField
      select
      sx={{ width: '200px' }}
      onChange={(e) => onChange(e.target.value)}
      value={value}
      variant="standard"
    >
      <MenuItem value="sedentary">Sedentary</MenuItem>
      <MenuItem value="light">Light</MenuItem>
      <MenuItem value="medium">Medium</MenuItem>
      <MenuItem value="very-active">Very Active</MenuItem>
    </TextField>
  );
}
