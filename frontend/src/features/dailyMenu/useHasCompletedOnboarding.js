import { baseFetch } from '../../utils/api-helper';
import { useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:8080';
export function useHasCompletedOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    async function checkOnboardingStatus() {
      try {
        const resp = await baseFetch(
          `${BASE_URL}/api/v1/users/me/onboarding-status`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );
        setHasCompletedOnboarding(resp.on_boarding);
      } catch (error) {
        throw new Error('OnboardingStatus Catch', error.message);
      }
    }

    checkOnboardingStatus();
  }, []);

  return hasCompletedOnboarding;
}
