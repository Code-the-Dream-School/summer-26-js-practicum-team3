import {
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  MobileStepper,
  Grid,
  Link,
} from '@mui/material';
import StepCard from '../StepCard';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'prefer_not_to_say', label: 'Prefer Not to say' },
];

export default function GenderStep({ formData, updateField, onNext, onBack, onSkip, submitting }) {
  return (
    <StepCard>
      <MobileStepper
        variant="dots"
        steps={3}
        position="static"
        activeStep={1}
        sx={{ justifyContent: 'center', bgcolor: 'transparent', mb: 2 }}
        nextButton={null}
        backButton={null}
      />
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Gender
      </Typography>

      <RadioGroup
        value={formData.gender || ''}
        onChange={(e) => updateField('gender', e.target.value)}
        sx={{ textAlign: 'left', pl: 1 }}
      >
        {GENDER_OPTIONS.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio />}
            label={opt.label}
          />
        ))}
      </RadioGroup>

      <Grid container spacing={2} sx={{ mt: 3 }}>
        {onBack && (
          <Grid item xs={4}>
            <Button variant="outlined" fullWidth size="large" onClick={onBack}>
              Back
            </Button>
          </Grid>
        )}
        <Grid item xs={onBack ? 8 : 12}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={onNext}
            disabled={submitting}
          >
            {submitting ? 'Saving…' : 'Continue'}
          </Button>
        </Grid>
      </Grid>
      <Link component="button" variant="caption" color="text.disabled" onClick={onSkip} sx={{ mt: 1 }}>
        Skip for now
      </Link>
    </StepCard>
  );
}
