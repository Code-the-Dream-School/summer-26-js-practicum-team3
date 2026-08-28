import { Box, Button, Stack, Typography } from '@mui/material';
import { Link, Outlet } from 'react-router';

export default function DefaultLayout() {
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
        <Typography
          sx={{
            color: 'primary.main',
            fontSize: '1.4rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Today Eatz
        </Typography>

        <Stack direction="row" spacing={{ xs: 1, md: 3 }}>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          <Button component={Link} to="/about" color="inherit">
            About
          </Button>
          <Button component={Link} to="/contact" color="inherit">
            Contact
          </Button>
        </Stack>
      </Box>
      <main>
        <Outlet />
      </main>
    </Box>
  );
}
