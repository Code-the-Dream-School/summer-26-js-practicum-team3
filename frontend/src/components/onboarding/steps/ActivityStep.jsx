import {
  Typography,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  MobileStepper,
  Link,
} from '@mui/material';
import StepCard from '../StepCard';

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary', helper: 'little or no exercise' },
  {
    value: 'lightly_active',
    label: 'Lightly Active',
    helper: 'exercise 1-3 days/week',
  },
  {
    value: 'moderate_active',
    label: 'Moderately active',
    helper: 'exercise 3-5 days/week',
  },
  {
    value: 'very_active',
    label: 'Very active',
    helper: 'exercise 6-7 days/week',
  },
];

export default function ActivityStep({
  formData,
  updateField,
  onNext,
  onBack,
  onSkip,
}) {
  return (
    <StepCard>
      <MobileStepper
        variant="dots"
        steps={3}
        position="static"
        activeStep={2}
        sx={{ justifyContent: 'center', bgcolor: 'transparent', mb: 1 }}
        nextButton={null}
        backButton={null}
      />
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
        How active are you?
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mb: 3 }}
      >
        This helps us calculate your daily calorie needs.
      </Typography>

      <Grid container spacing={1}>
        {ACTIVITY_OPTIONS.map((opt) => (
          <Grid item xs={6} key={opt.value}>
            <FormControlLabel
              sx={{
                alignItems: 'flex-start',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                m: 0,
                p: 1,
                width: '100%',
              }}
              control={
                <Checkbox
                  checked={formData.activityLevel === opt.value}
                  onChange={() => updateField('activityLevel', opt.value)}
                />
              }
              label={
                <>
                  <Typography variant="body2">{opt.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {opt.helper}
                  </Typography>
                </>
              }
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mt: 4 }}>
        {onBack && (
          <Grid item xs={4}>
            <Button variant="outlined" fullWidth size="large" onClick={onBack}>
              Back
            </Button>
          </Grid>
        )}
        <Grid item xs={onBack ? 8 : 12}>
          <Button variant="contained" fullWidth size="large" onClick={onNext}>
            Continue
          </Button>
        </Grid>
      </Grid>
      <Link
        component="button"
        variant="caption"
        color="text.disabled"
        onClick={onSkip}
        sx={{ mt: 1 }}
      >
        Skip for now
      </Link>
    </StepCard>
  );
}
