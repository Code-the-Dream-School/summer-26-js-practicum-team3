import { Link } from 'react-router';
import LoginForm from '../features/auth/components/LoginForm';
import { Card, Box, CardContent, Typography } from '@mui/material';

const HERO_1X1 =
  'https://res.cloudinary.com/doiwe9d5a/image/upload/v1788534790/hero-1x1_hnf1bf.webp';
const HERO_4X3 =
  'https://res.cloudinary.com/doiwe9d5a/image/upload/v1788534790/hero-4x3_ryhozy.webp';
const HERO_16X9 =
  'https://res.cloudinary.com/doiwe9d5a/image/upload/v1788534790/hero-16x9_tcskoe.webp';
const HERO_21X9 =
  'https://res.cloudinary.com/doiwe9d5a/image/upload/v1788534790/hero-21x9_pgorlr.webp';

// Nav in DefaultLayout is ~71px tall (py: 2 + small button + 1px border).
// Update this if the nav's padding or button size changes.
const NAV_HEIGHT = 71;

function Login() {
  return (
    <Box
      sx={{
        minHeight: `calc(100dvh - ${NAV_HEIGHT}px)`,
        backgroundImage: `url(${HERO_1X1})`,
        '@media (min-aspect-ratio: 8/7)': {
          backgroundImage: `url(${HERO_4X3})`,
        },
        '@media (min-aspect-ratio: 32/21)': {
          backgroundImage: `url(${HERO_16X9})`,
        },
        '@media (min-aspect-ratio: 37/18)': {
          backgroundImage: `url(${HERO_21X9})`,
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
              Log in
            </Typography>
            <LoginForm />
            <Typography variant="body1" align="center" sx={{ mt: 3 }}>
              Need an account? <Link to="/signup">Sign Up</Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Login;
