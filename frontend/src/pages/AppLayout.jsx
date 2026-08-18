import { Link, Outlet, useNavigate } from 'react-router';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { useAuth } from '../features/auth/context/AuthContext';
import { logoutUser } from '../features/auth/api/authApi';

const BOTTOM_NAV_CONTAINER = {
  top: 'auto',
  bottom: 0,
  maxWidth: 'sm',
  left: 0,
  right: 0,
  margin: '0 auto',
  borderRadius: 1,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
};
const TOP_NAV_CONTAINER = {
  top: 0,
  bottom: 'auto',
  maxWidth: 'sm',
  left: 0,
  right: 0,
  margin: '0 auto',
  borderRadius: 1,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
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

export default function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    logoutUser();
  };
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
        <Toolbar sx={{ justifyContent: 'space-around' }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content renders above navigation */}
      <main>
        <Outlet />
      </main>

      {/* Navigation pinned to bottom */}
      <AppBar
        position="fixed"
        color="primary"
        sx={BOTTOM_NAV_CONTAINER}
        component="nav"
        aria-label="Bottom navigation"
      >
        <Toolbar sx={{ justifyContent: 'space-around' }}>
          <Button color="inherit" component={Link} to="/daily-planner">
            Daily Planner
          </Button>
          <Button color="inherit" component={Link} to="/goals">
            Goals
          </Button>
          <Button color="inherit" component={Link} to="/add-recipe">
            Add Recipe
          </Button>
          <Button color="inherit" component={Link} to="/profile">
            Profile
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
