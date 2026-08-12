import { Typography, TextField, Button, MobileStepper, Grid, Link } from '@mui/material';
import StepCard from '../StepCard';

export default function DobStep({ formData, updateField, onNext, onBack, onSkip }) {
  return (
    <StepCard>
      <MobileStepper
        variant="dots"
        steps={3}
        position="static"
        activeStep={0}
        sx={{ justifyContent: 'center', bgcolor: 'transparent', mb: 2 }}
        nextButton={null}
        backButton={null}
      />
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Date of Birth
      </Typography>

      <TextField
        type="date"
        fullWidth
        value={formData.dob}
        onChange={(e) => updateField('dob', e.target.value)}
        InputLabelProps={{ shrink: true }}
      />

      <Grid container spacing={2} sx={{ mt: 3 }}>
        {onBack && (
          <Grid item xs={4}>
            <Button variant="outlined" fullWidth size="large" onClick={onBack}>
              Back
            </Button>
          </Grid>
        )}
        <Grid item xs={onBack ? 8 : 12}>
          <Button variant="contained" fullWidth size="large" onClick={onNext} disabled={!formData.dob}>
            Continue
          </Button>
        </Grid>
      </Grid>
      <Link component="button" variant="caption" color="text.disabled" onClick={onSkip} sx={{ mt: 1 }}>
        Skip for now
      </Link>
    </StepCard>
  );
}
