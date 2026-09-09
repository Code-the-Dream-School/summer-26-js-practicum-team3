import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

function PublicRoute({ children }) {
  const { isChecking } = useAuth();

  if (isChecking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return children;
}
export default PublicRoute;
