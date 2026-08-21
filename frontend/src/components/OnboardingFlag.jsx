import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import { Typography, Box } from '@mui/material';
import { Link } from 'react-router';

const ONBOARDING_FLAG = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
};

export function OnboardingFlag() {
  return (
    <Box component={Link} to="/onboarding" sx={ONBOARDING_FLAG}>
      <Typography>Finish</Typography>
      <LabelImportantIcon />
      <Typography>Onboarding</Typography>
    </Box>
  );
}
