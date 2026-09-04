import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Snackbar, Alert, Button } from '@mui/material';
import { useHasCompletedOnboarding } from '../../features/dailyMenu/useHasCompletedOnboarding';

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
  const HIDE_TIME = 5000;
  return (
    <Snackbar
      open={open}
      onClose={handleDismiss}
      autoHideDuration={HIDE_TIME}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
