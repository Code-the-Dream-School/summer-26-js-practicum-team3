import { Typography, TextField, Button, Grid, Alert, MobileStepper, Link } from '@mui/material';
import StepCard from '../StepCard';

const FIELDS = [
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'fat', label: 'Fat', unit: 'g' },
  { key: 'carbs', label: 'Carb', unit: 'g' },
  { key: 'cholesterol', label: 'Cholesterol', unit: 'mg' },
  { key: 'fiber', label: 'Fiber', unit: 'g' },
];

const FDA_GUIDELINES_URL =
  'https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels';

export default function GoalsStep({ formData, updateField, onNext, onBack }) {
  const goals = formData.goals;

  const setGoal = (key, value) =>
    updateField('goals', { ...goals, [key]: value === '' ? '' : Number(value) });

  return (
    <StepCard>
      <MobileStepper
        variant="dots"
        steps={3}
        position="static"
        activeStep={1}
        sx={{ justifyContent: 'center', bgcolor: 'transparent', mb: 1 }}
        nextButton={null}
        backButton={null}
      />
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
        Set your daily nutritional goals
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
        We pre-filled recommended values for an adult. Adjust any field to
        match your own needs.
      </Typography>

      <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
        Recommended values are based on general adult reference intake (US
        FDA Daily Values / WHO).{' '}
        <Link href={FDA_GUIDELINES_URL} target="_blank" rel="noopener noreferrer">
          See the guidelines.
        </Link>
      </Alert>

      <Grid container spacing={2}>
        {FIELDS.map(({ key, label, unit }) => (
          <Grid item xs={6} key={key}>
            <TextField
              label={`${label} (${unit})`}
              type="number"
              fullWidth
              size="small"
              value={goals[key]}
              onChange={(e) => setGoal(key, e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mt: 3 }}>
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

      <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 2 }}>
        You can edit anytime in Profile → Goals
      </Typography>
    </StepCard>
  );
}
