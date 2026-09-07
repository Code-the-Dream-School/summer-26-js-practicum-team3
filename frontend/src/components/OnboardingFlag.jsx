import { Button } from '@mui/material';
import { Link } from 'react-router';

export function OnboardingFlag() {
  return (
    <Button
      variant="contained"
      color="primary"
      component={Link}
      to="/onboarding"
    >
      Finish Onboarding
    </Button>
  );
}
