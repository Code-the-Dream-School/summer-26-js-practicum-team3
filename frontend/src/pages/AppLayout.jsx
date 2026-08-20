import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
const NAV_HEIGHT = { maxHeight: '50px' };
const BOTTOM_NAV_CONTAINER = {
  top: 'auto',
  bottom: 0,
  maxWidth: 'sm',
  // height: '1.2em',
  left: 0,
  right: 0,
  margin: '0 auto',
  borderRadius: 1,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  ...NAV_HEIGHT,
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
  ...NAV_HEIGHT,
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
  const [hideNavigation, setHideNavigation] = useState(true);

  const location = useLocation();

  useEffect(() => {
    function hideBottomNavigation() {
      const allowedPages = ['/daily-planner', '/add-recipe', '/profile'];
      const currentPage = location.pathname;
      console.log(currentPage);
      setHideNavigation(() => allowedPages.includes(currentPage));
    }

    // console.log(hideNavigation);
    hideBottomNavigation();
  }, [hideNavigation, location.pathname]);
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
      {hideNavigation && (
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
