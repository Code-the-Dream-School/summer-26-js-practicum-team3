import { useEffect, useState } from 'react';
import { getProfile } from '../features/auth/api/authApi';
import { OnboardingFlag } from '../components/OnboardingFlag.jsx';
import { useHasCompletedOnboarding } from '../features/dailyMenu/useHasCompletedOnboarding.js';
import { baseFetch } from '../utils/api-helper';
import { useAuth } from '../features/auth/context/AuthContext';

/*************
 * MACROS EDIT
 **************/
import { useNutritionalGoals } from '../utils/customHooks/useNutritionGoals.js';

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

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? '';
const BASE_PATH = `${API_ORIGIN}/api/v1/users/me`;

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const hasCompletedOnboarding = useHasCompletedOnboarding();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const { csrfToken } = useAuth();

  /*************
   * MACROS EDIT
   **************/
  const {
    goals: { id, ...goals },
    setGoals,
  } = useNutritionalGoals();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        let { status, data } = await getProfile();
        if (status >= 200 && 300 > status) {
          data.dob = data.dob ? data.dob.split('T')[0] : '';

          setProfile(data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error.message);
        setError(error.message);
      }
    };

    fetchProfile();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: profile.name,
      email: profile.email,
      dob: profile.dob,
      activity_level: profile.activity_level,
      goals: { ...goals },
    };

    try {
      let data = await baseFetch(BASE_PATH, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const { userInfo, nutritionGoals } = data;

      userInfo.dob = userInfo.dob ? userInfo.dob.split('T')[0] : '';
      setGoals(nutritionGoals);
      setProfile(userInfo);

      setIsEditing(false);
      setLoading(false);
      setError('');
    } catch (error) {
      console.log(error);
      setError(error.message);

      setLoading(false);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}
    >
      {loading && <Typography>Loading...</Typography>}
      {/**
       * clearing error state by clicking needs better adhearnece
       */}
      {error && (
        <Typography
          sx={{ width: '100%', color: 'red' }}
          onClick={() => setError('')}
        >
          {error}
        </Typography>
      )}
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
                <TextField
                  required
                  onChange={(e) =>
                    setProfile((previous) => ({
                      ...previous,
                      name: e.target.value,
                    }))
                  }
                  variant="standard"
                  value={profile.name}
                />
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
                  required
                  onChange={(e) =>
                    setProfile((previous) => ({
                      ...previous,
                      email: e.target.value,
                    }))
                  }
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
                <TextField
                  required
                  type="date"
                  onChange={(e) =>
                    setProfile((previous) => ({
                      ...previous,
                      dob: e.target.value,
                    }))
                  }
                  variant="standard"
                  value={profile?.dob}
                />
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
                  onChange={(value) => {
                    setProfile((previous) => ({
                      ...previous,
                      activity_level: value,
                    }));
                  }}
                  value={profile.activity_level || ''}
                />
              ) : (
                <Typography variant="body1">
                  {removedUnderscoreForUI(profile?.activity_level) ||
                    'Not provided'}
                </Typography>
              )}
            </Grid>
          </Grid>
          {/*****************
           * MACROS EDITING *
           *****************/}
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <Typography variant="standard" color="textSecondary">
                Calories:
              </Typography>
              {isEditing ? (
                <TextField
                  required
                  variant="standard"
                  onChange={(e) =>
                    setGoals((previous) => ({
                      ...previous,
                      calories_target: e.target.value,
                    }))
                  }
                  value={goals?.calories_target}
                />
              ) : (
                <Typography variant="body1">
                  {goals?.calories_target || '0'}
                </Typography>
              )}
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Carbs:
              </Typography>
              {isEditing ? (
                <TextField
                  required
                  variant="standard"
                  onChange={(e) =>
                    setGoals((previous) => ({
                      ...previous,
                      carbs_target: e.target.value,
                    }))
                  }
                  value={goals.carbs_target}
                />
              ) : (
                <Typography variant="body1">
                  {goals?.carbs_target || '0'}
                </Typography>
              )}
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Fat:
              </Typography>
              {isEditing ? (
                <TextField
                  required
                  variant="standard"
                  onChange={(e) =>
                    setGoals((previous) => ({
                      ...previous,
                      fat_target: e.target.value,
                    }))
                  }
                  value={goals.fat_target}
                />
              ) : (
                <Typography variant="body1">
                  {goals?.fat_target || '0'}
                </Typography>
              )}
            </Grid>
            <Grid xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Protein:
              </Typography>
              {isEditing ? (
                <TextField
                  required
                  variant="standard"
                  onChange={(e) =>
                    setGoals((previous) => ({
                      ...previous,
                      protein_target: e.target.value,
                    }))
                  }
                  value={goals?.protein_target}
                />
              ) : (
                <Typography variant="body1">
                  {goals?.protein_target || '0'}
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
            variant="contained"
            color="primary"
            disabled={!isEditing}
            key="update-button"
          >
            Update
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            variant="contained"
            color="primary"
            key="edit-button"
          >
            Edit
          </Button>
        )}
        {isEditing && (
          <Button
            type="button"
            onClick={() => setIsEditing(false)}
            variant="contained"
            color="primary"
            key="cancel-button"
          >
            Cancel
          </Button>
        )}

        {!hasCompletedOnboarding && <OnboardingFlag />}
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
      <MenuItem value="lightly_active">Lightly active</MenuItem>
      <MenuItem value="moderately_active">Moderately active</MenuItem>
      <MenuItem value="very_active">Very active</MenuItem>
    </TextField>
  );
}

function removedUnderscoreForUI(string) {
  if (string) {
    let cap = string.charAt(0).toUpperCase() + string.slice(1);
    cap = cap.replaceAll('_', ' ');
    return cap;
  }
  return null;
}
