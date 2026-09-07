import { useState } from 'react';
import {
  Box,
  LinearProgress,
  Alert,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import WelcomeStep from './steps/WelcomeStep';
import GoalsStep from './steps/GoalsStep';
import ActivityStep from './steps/ActivityStep';
import DobStep from './steps/DobStep';
import SexStep from './steps/SexStep';
import { saveOnboarding } from '../../services/onboardingService';
import { useAuth } from '../../features/auth/context/AuthContext';
import onboardingWide from '../../assets/AppImages/onboarding-wide.webp';
import onboardingPortrait from '../../assets/AppImages/onboarding-portrait.webp';
import logo from '../../assets/logo/logo400.png';

const STEPS = [
  { key: 'welcome', Component: WelcomeStep },
  { key: 'goals', Component: GoalsStep },
  { key: 'activity', Component: ActivityStep },
  { key: 'dob', Component: DobStep },
  { key: 'sex', Component: SexStep },
];

const DEFAULT_GOALS = {
  calories_target: 2000,
  protein_target: 50,
  fat_target: 70,
  carbs_target: 275,
};

export default function OnboardingWizard({ onComplete = () => {} }) {
  const { csrfToken } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    goals: DEFAULT_GOALS,
    activityLevel: null,
    dob: '',
    sex: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { key, Component } = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleFinish = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await saveOnboarding(formData, csrfToken);
      onComplete();
    } catch (err) {
      setError(err.message || 'Something went wrong saving your info.');
    } finally {
      setSubmitting(false);
    }
  };

  // Skippable steps: Activity, DOB, Sex. Sex is the last step, so skipping
  // it finishes onboarding (with sex left unset) instead of just advancing.
  const skipHandlers = {
    activity: goNext,
    dob: goNext,
    sex: handleFinish,
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        backgroundImage: `url(${onboardingPortrait})`,
        '@media (min-aspect-ratio: 1/1)': {
          backgroundImage: `url(${onboardingWide})`,
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(255, 255, 255, 0.6)',
        },
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 480 }} v>
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{ mb: 2 }}
        >
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box
              component="img"
              src={logo}
              alt="Today Eatz"
              sx={{ height: 28, width: 'auto', display: 'block' }}
            />
          </Toolbar>
        </AppBar>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 3, borderRadius: 2, height: 6 }}
        />

        <Component
          formData={formData}
          updateField={updateField}
          onNext={isLastStep ? handleFinish : goNext}
          onBack={stepIndex > 0 ? goBack : null}
          onSkip={skipHandlers[key] || null}
          submitting={submitting}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
}
