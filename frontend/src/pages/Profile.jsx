import { useEffect, useState } from 'react';
import { getProfile } from '../features/auth/api/authApi';
import { OnboardingFlag } from '../components/OnboardingFlag.jsx';
import { useHasCompletedOnboarding } from '../features/dailyMenu/useHasCompletedOnboarding.js';

import {
  Card,
  Box,
  CardContent,
  Typography,
  Grid,
  Divider,
  Button,
} from '@mui/material';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasCompletedOnboarding = useHasCompletedOnboarding();

  useEffect(() => {
    const fetchProfile = async () => {
      const { status, data } = await getProfile();
      if (status === 200) {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (!profile) return <Typography>Error loading profile.</Typography>;

  return (
    <Box sx={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
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
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Name:
              </Typography>
              <Typography variant="body1">{profile?.name || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Email:
              </Typography>
              <Typography variant="body1">{profile?.email || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Sex:
              </Typography>
              <Typography variant="body1">
                {profile?.sex || 'Not provided'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Activity Level:
              </Typography>
              <Typography variant="body1">
                {profile?.activity_level || 'Not provided'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary">
          Edit Profile
        </Button>
        {!hasCompletedOnboarding && <OnboardingFlag />}
      </Box>
    </Box>
  );
}
