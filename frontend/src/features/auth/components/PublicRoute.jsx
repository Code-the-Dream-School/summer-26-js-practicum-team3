import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router';
import { Box, CircularProgress } from '@mui/material';
import { useHasCompletedOnboarding } from '../../dailyMenu/useHasCompletedOnboarding';

function PublicRoute({ children }) {
  const { userName, isChecking } = useAuth();
  const hasCompletedOnboarding = useHasCompletedOnboarding();
 
  if (isChecking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (userName) {
    return (
      <Navigate to={hasCompletedOnboarding ? '/daily-planner' : '/onboarding'} replace />
    );
  }
  return children;
}
export default PublicRoute;