import { LabelImportantIcon } from '@mui/icons-material';
import { Typography, Box } from '@mui/material';

export function OnboardingFlag() {
  return (
    <Box>
      <Typography>Finish</Typography>
      <LabelImportantIcon />
      <Typography>Onboarding</Typography>
    </Box>
  );
}
