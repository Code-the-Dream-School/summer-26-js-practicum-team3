import { Button } from '@mui/material';
import { Link } from 'react-router';

export function OnboardingFlag() {
  return (
    <Button component={Link} to="/onboarding" color="inherit">
      Finish Onboarding
    </Button>
  );
}
