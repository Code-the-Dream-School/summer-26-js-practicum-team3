// Stand-in for MEAL-125's real onboarding-complete check
// (GET /api/v1/users/me/onboarding-status). Hardcoded until that lands -
// swap the return value here for the real fetch, callers don't need to change.
export function useHasCompletedOnboarding() {
  return true;
}
