import { Link, Outlet } from 'react-router';
import { AppBar, Toolbar, Box, Button } from '@mui/material';

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
  return (
    <Box sx={APP_CONTAINER}>
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
