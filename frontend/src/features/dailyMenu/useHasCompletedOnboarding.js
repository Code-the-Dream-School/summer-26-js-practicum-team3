import { baseFetch } from '../../utils/api-helper';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/context/AuthContext';

const BASE_URL = 'http://localhost:8080';
export function useHasCompletedOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { userName } = useAuth();

  useEffect(() => {
    // Skip the request on public pages (signup, login) where no one is
    // logged in yet - the endpoint would just 401.
    if (!userName) return;

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
        throw new Error('Unable to check onboarding status', error.message);
      }
    }

    checkOnboardingStatus();
  }, [userName]);

  return hasCompletedOnboarding;
}
