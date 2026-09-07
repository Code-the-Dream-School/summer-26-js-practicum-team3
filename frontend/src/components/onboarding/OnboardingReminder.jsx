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

  return (
    <Snackbar
      open={open}
      onClose={handleDismiss}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        top: '-.5vh !important',
        width: '98%',
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
        sx={{
          width: '100%',
        }}
      >
        <span>
          Complete your onboarding to get a better tailored experience.
        </span>
        <Button sx={{ mx: 2 }} size="small" onClick={handleGoToProfile}>
          Go to Profile
        </Button>
      </Alert>
    </Snackbar>
  );
}
