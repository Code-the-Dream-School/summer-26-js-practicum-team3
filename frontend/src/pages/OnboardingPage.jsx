import OnboardingWizard from '../components/onboarding/OnboardingWizard';

// Standalone route for onboarding, separate from the main app shell.
// TODO: once login is functional, redirect here automatically after sign-in
// instead of requiring users to navigate to /onboarding manually.
export default function OnboardingPage() {
  return (
    <OnboardingWizard
      onComplete={() => {
        // TODO: once routing/auth context exists, navigate to the main
        // dashboard/home page here instead of leaving the wizard mounted.
        console.log('Onboarding complete');
      }}
    />
  );
}
