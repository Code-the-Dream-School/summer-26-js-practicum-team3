import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router';
import { Box, CircularProgress } from '@mui/material';

function PublicRoute({ children }) {
  const { userName, isChecking } = useAuth();
  if (isChecking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (userName) {
    return <Navigate to="/daily-planner" replace />;
  }
  return children;
}
export default PublicRoute;