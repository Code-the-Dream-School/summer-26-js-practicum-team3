import { Link } from 'react-router';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../features/auth/context/AuthContext';
import wideBg from '../assets/AppImages/notfound-wide.webp';
import portraitBg from '../assets/AppImages/notfound-portrait.webp';

const MINT = '#d5eae7';
const WIDE = '@media (min-aspect-ratio: 1/1)';

export default function NotFound() {
  const { userName, isChecking } = useAuth();

  const destination = userName ? '/daily-planner' : '/';
  const label = userName ? 'Back to Daily Planner' : 'Back to Home';

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
        backgroundColor: MINT,
        backgroundImage: `url(${portraitBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: 3,
        pb: '12%',
        [WIDE]: {
          backgroundImage: `url(${wideBg})`,
          backgroundPosition: 'center',
          alignItems: 'flex-end',
          justifyContent: 'center',
          pb: 0,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 420,
          textAlign: 'center',
          [WIDE]: {
            width: '40%',
            maxWidth: 440,
            mr: '5%',
            textAlign: 'left',
          },
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 1.5 }}>
          We couldn&apos;t find that page.
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The link may be broken, or the page may have moved.
        </Typography>

        {isChecking ? (
          <CircularProgress />
        ) : (
          <Button
            component={Link}
            to={destination}
            variant="contained"
            size="large"
          >
            {label}
          </Button>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Error 404
        </Typography>
      </Box>
    </Box>
  );
}