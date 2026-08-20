import { Link, Outlet, useLocation } from 'react-router';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { useAuth } from '../features/auth/context/AuthContext';
//pull all matching in
const NAV_BASICS_DEFINED = {
  maxHeight: '50px',
  left: 0,
  right: 0,
  margin: '0 auto',
  borderRadius: 1,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  maxWidth: 'sm',
};
const BOTTOM_NAV_CONTAINER = {
  top: 'auto',
  bottom: 0,
  ...NAV_BASICS_DEFINED,
};
const TOP_NAV_CONTAINER = {
  top: 0,
  bottom: 'auto',
  ...NAV_BASICS_DEFINED,
};
const APP_CONTAINER = {
  pb: 7,
  maxWidth: 'sm',
  left: 0,
  right: 0,
  margin: '0 auto',
  mt: '64px',
  minHeight: '78.5dvh',
};
const JUSTIFY_AROUND = { justifyContent: 'space-around' };
export default function AppLayout() {
  const { user } = useAuth();
  const location = useLocation();
  return (
    <Box sx={APP_CONTAINER}>
      {/* Top Navigation */}
      <AppBar
        position="fixed"
        color="primary"
        sx={TOP_NAV_CONTAINER}
        component="nav"
        aria-label="Top navigation"
      >
        <Toolbar sx={JUSTIFY_AROUND}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
          <Button color="inherit" component={Link} to="/logout">
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content renders above navigation */}
      <main>
        <Outlet />
      </main>
      {/* Navigation pinned to bottom */}
      {(user || location.pathname === '/onboarding') && (
        <AppBar
          position="fixed"
          color="primary"
          sx={BOTTOM_NAV_CONTAINER}
          component="nav"
          aria-label="Bottom navigation"
        >
          <Toolbar sx={JUSTIFY_AROUND}>
            <Button color="inherit" component={Link} to="/daily-planner">
              Daily Planner
            </Button>
            {/* <Button color="inherit" component={Link} to="/goals">
            Goals
          </Button> */}
            <Button color="inherit" component={Link} to="/add-recipe">
              Add Recipe
            </Button>
            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>
          </Toolbar>
        </AppBar>
      )}
    </Box>
  );
}
