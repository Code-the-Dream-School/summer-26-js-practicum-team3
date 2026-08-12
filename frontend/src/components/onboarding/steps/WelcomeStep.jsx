import { Typography, Button, Box } from '@mui/material';
import StepCard from '../StepCard';

export default function WelcomeStep({ onNext }) {
  return (
    <StepCard>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Welcome to TodayEatz
      </Typography>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Let's set up your goals
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Answer a few quick questions so we can tailor your recipes and daily
        targets to you. Takes about 2 minutes.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" fullWidth size="large" onClick={onNext}>
          Get Started
        </Button>
      </Box>
    </StepCard>
  );
}
