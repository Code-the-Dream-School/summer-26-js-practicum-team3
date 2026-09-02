import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Snackbar, Alert, Button } from '@mui/material';

const BASE_URL = 'http://localhost:8080/api/v1';
const DISMISS_KEY = 'onboardingReminderDismissed';

export default function OnboardingReminder() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === 'true') return;

    async function checkOnboardingStatus() {
      try {
        const res = await fetch(`${BASE_URL}/users/me/onboarding-status`, {
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.on_boarding === false) {
          setOpen(true);
        }
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
        // don't block the app over a reminder banner
      }
    }

    checkOnboardingStatus();
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, 'true');
    setOpen(false);
  };

  const handleGoToProfile = () => {
    handleDismiss();
    navigate('/profile');
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity="info"
        onClose={handleDismiss}
        action={
          <Button color="inherit" size="small" onClick={handleGoToProfile}>
            Go to Profile
          </Button>
        }
        sx={{ width: '100%' }}
      >
        Complete your onboarding to get tailored recipes.
      </Alert>
    </Snackbar>
  );
}
