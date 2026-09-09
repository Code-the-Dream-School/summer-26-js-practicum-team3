import { Box, Button, Stack, Typography } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router';
import logo from '../assets/logo/logo400.png';

export default function DefaultLayout() {
  const location = useLocation()
  function activeState(pathname:string){
    return location.pathname === pathname? "contained":"outlined"
  }
  return (
    <Box>
      <Box
        component="nav"
        aria-label="Main navigation"
        sx={{
          px: { xs: 2, md: 6 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'common.white',
          border: '1px solid #dcebe0',
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Box
            component="img"
            src={logo}
            alt="Today Eatz"
            sx={{ height: 34, width: 'auto', display: 'block' }}
          />
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button component={Link} to="/about" variant={activeState("/about")} size="small">
            About
          </Button>

          <Button component={Link} to="/login" variant={activeState("/login")} size="small">
            Login
          </Button>
          <Button
            component={Link}
            to="/signup"
            variant={activeState("/signup")}
            size="small"
          >
            Sign Up
          </Button>
        </Stack>
      </Box>

      <main>
        <Outlet />
      </main>
    </Box>
  );
}
