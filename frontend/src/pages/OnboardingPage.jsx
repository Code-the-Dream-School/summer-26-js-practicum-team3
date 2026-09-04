import OnboardingWizard from '../components/onboarding/OnboardingWizard';
import { useNavigate } from 'react-router';

export default function OnboardingPage() {
  const navigate = useNavigate();
  return (
    <OnboardingWizard
      onComplete={() => {
             navigate('/daily-planner');
      }}
    />
  );
}
