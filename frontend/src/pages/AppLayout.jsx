import { NavLink, Outlet } from 'react-router';
import { Box, Stack } from '@mui/material';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/daily-planner', label: 'Daily Planner' },
  { to: '/goals', label: 'Goals' },
  { to: '/add-recipe', label: 'Add Recipe' },
  { to: '/profile', label: 'Profile' },
];

export default function AppLayout() {
  return (
    <Box
      sx={{
        bgcolor: '#f5f7f4',
        color: '#1f2937',
        minHeight: '100vh',
      }}
    >
      <Box
        component="nav"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e5e7eb',
          px: 3,
          py: 2,
        }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#ffffff' : '#374151',
                backgroundColor: isActive ? '#2e7d32' : 'transparent',
                border: isActive
                  ? '1px solid #2e7d32'
                  : '1px solid transparent',
                fontWeight: 600,
                padding: '8px 16px',
                borderRadius: 999,
                transition: 'all 0.2s ease',
              })}
            >
              {label}
            </NavLink>
          ))}
        </Stack>
      </Box>

      <Box component="main" sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
