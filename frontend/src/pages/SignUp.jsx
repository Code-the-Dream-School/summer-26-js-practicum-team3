import { Link } from 'react-router';
import SignUpForm from '../features/auth/components/SignUpForm';
import { Card, Box, CardContent, Typography } from '@mui/material';
import hero1x1 from '../assets/hero-1x1.webp';
import hero4x3 from '../assets/hero-4x3.webp';
import hero16x9 from '../assets/hero-16x9.webp';
import hero21x9 from '../assets/hero-21x9.webp';

// Nav in DefaultLayout is ~71px tall (py: 2 + small button + 1px border).
// Update this if the nav's padding or button size changes.
const NAV_HEIGHT = 71;

function SignUp() {
  return (
    <Box
      sx={{
        minHeight: `calc(100dvh - ${NAV_HEIGHT}px)`,
        backgroundImage: `url(${hero1x1})`,
        '@media (min-aspect-ratio: 8/7)': {
          backgroundImage: `url(${hero4x3})`,
        },
        '@media (min-aspect-ratio: 32/21)': {
          backgroundImage: `url(${hero16x9})`,
        },
        '@media (min-aspect-ratio: 37/18)': {
          backgroundImage: `url(${hero21x9})`,
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            boxShadow: '0 8px 30px rgba(35, 38, 31, 0.14)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              fontWeight={600}
              align="center"
              sx={{ mb: 3 }}
            >
              Sign up
            </Typography>
            <SignUpForm />
            <Typography variant="body1" align="center" sx={{ mt: 3 }}>
              Have an account? <Link to="/login">Log In</Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default SignUp;
