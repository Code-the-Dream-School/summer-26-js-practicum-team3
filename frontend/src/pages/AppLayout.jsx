import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import { AppBar, Toolbar, Box, Button, Typography } from '@mui/material';
import { useAuth } from '../features/auth/context/AuthContext';
import { logoutUser } from '../features/auth/api/authApi';
// import { OnboardingFlag } from '../components/OnboardingFlag.jsx';
// import OnboardingReminder from '../components/onboarding/OnboardingReminder.jsx';
// import { useHasCompletedOnboarding } from '../features/dailyMenu/useHasCompletedOnboarding.js';

const THEME_STUFF = {
  // px: { xs: 2, md: 6 },
  // py: 2,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  bgcolor: 'common.white',
  border: '1px solid #dcebe0',
};
const BOTTOM_NAV_CONTAINER = {
  position: 'fixed',
  bottom: 0,
  top: 'auto',
  maxHeight: '300px',
  left: 0,
  right: 0,
  margin: '0 auto',
  ...THEME_STUFF,
};
// const APP_CONTAINER = {
//   px: { xs: 2, md: 6 },
//   py: 2,
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   bgcolor: 'common.white',
//   border: '1px solid #dcebe0',
// };
const APP_CONTAINER = {
  maxWidth: 'sm',
  left: 0,
  right: '25px',
  margin: '0 auto',
  minHeight: '92dvh',
};
// const JUSTIFY_AROUND = { justifyContent: 'space-around' };
const NAV_LINK_LAYOUT = {
  width: { xs: '60%', md: '40%' },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: '8px',
};
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
          // color="primary"
          sx={BOTTOM_NAV_CONTAINER}
          component="nav"
          aria-label="Bottom navigation"
        >
          {/* BANNER */}
          <Typography
            component={Link}
            color="primary"
            to="/"
            sx={{
              fontSize: '1.4rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Today Eatz
          </Typography>
          <Toolbar sx={NAV_LINK_LAYOUT}>
            <Button
              component={Link}
              variant="outlined"
              size="small"
              to="/daily-planner"
            >
              Daily Planner
            </Button>
            <Button
              component={Link}
              variant="outlined"
              size="small"
              to="/add-recipe"
            >
              Add Recipe
            </Button>
            <Button
              component={Link}
              variant="outlined"
              size="small"
              to="/profile"
            >
              Profile
            </Button>
            {/* {!hasCompletedOnboarding && <OnboardingFlag />}
            {!hasCompletedOnboarding && <OnboardingReminder />} */}
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          </Toolbar>
        </AppBar>
      )}
    </Box>
  );
}
