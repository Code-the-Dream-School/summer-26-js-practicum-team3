import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { useAuth } from '../features/auth/context/AuthContext';
import { logoutUser } from '../features/auth/api/authApi';
import { OnboardingFlag } from '../components/OnboardingFlag.jsx';
import OnboardingReminder from '../components/onboarding/OnboardingReminder.jsx';
import { useHasCompletedOnboarding } from '../features/dailyMenu/useHasCompletedOnboarding.js';

const BOTTOM_NAV_CONTAINER = {
  position: 'fixed',
  bottom: 0,
  top: 'auto',
  maxHeight: '50px',
  left: 0,
  right: 0,
  margin: '0 auto',
};
const APP_CONTAINER = {
  maxWidth: 'sm',
  left: 0,
  right: '25px',
  margin: '0 auto',
  minHeight: '92dvh',
};
const JUSTIFY_AROUND = { justifyContent: 'space-around' };
export default function AppLayout() {
  const hasCompletedOnboarding = useHasCompletedOnboarding();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
    logoutUser();
  };
  return (
    <Box sx={APP_CONTAINER}>
      <main>
        <Outlet />
      </main>
      {location.pathname !== '/onboarding' && (
        <AppBar
          color="primary"
          sx={BOTTOM_NAV_CONTAINER}
          component="nav"
          aria-label="Bottom navigation"
        >
          <Toolbar sx={JUSTIFY_AROUND}>
            <Button color="inherit" component={Link} to="/daily-planner">
              Daily Planner
            </Button>
            <Button color="inherit" component={Link} to="/add-recipe">
              Add Recipe
            </Button>
            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>
            {!hasCompletedOnboarding && <OnboardingFlag />}
            {!hasCompletedOnboarding && <OnboardingReminder />}
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          </Toolbar>
        </AppBar>
      )}
    </Box>
  );
}