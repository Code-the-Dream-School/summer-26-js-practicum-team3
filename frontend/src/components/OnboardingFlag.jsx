import { Button } from '@mui/material';
import { Link } from 'react-router';

export function OnboardingFlag() {
  return (
    <Button color="common.primary" component={Link} to="/onboarding">
      Finish Onboarding
    </Button>
  );
}
