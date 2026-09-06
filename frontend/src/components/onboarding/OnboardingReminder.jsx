import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Snackbar, Alert, Button } from '@mui/material';
import { useHasCompletedOnboarding } from '../../features/dailyMenu/useHasCompletedOnboarding';

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? '';
const BASE_URL = `${API_ORIGIN}/api/v1`;

export default function OnboardingReminder() {
  const navigate = useNavigate();
  const hasCompletedOnboarding = useHasCompletedOnboarding();
  const [open, setOpen] = useState(!hasCompletedOnboarding);

  const handleDismiss = () => {
    setOpen(false);
  };

  const handleGoToProfile = () => {
    handleDismiss();
    navigate('/profile');
  };

  return (
    <Snackbar
      open={open}
      onClose={handleDismiss}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        top: '-.5vh !important',
      }}
    >
      <Alert
        severity="info"
        onClose={handleDismiss}
        action={
          <Button color="inherit" size="small" onClick={handleDismiss}>
            x
          </Button>
        }
        sx={{ width: '100%' }}
      >
        <span>
          Complete your onboarding to get a better tailored experience.
        </span>
        <Button sx={{ mx: 1 }} size="small" onClick={handleGoToProfile}>
          Go to Profile
        </Button>
      </Alert>
    </Snackbar>
  );
}
