import { Link } from 'react-router';
import SignUpForm from '../features/auth/components/SignUpForm';
import { Card, Box, CardContent, Typography } from '@mui/material';

// Nav in DefaultLayout is ~71px tall (py: 2 + small button + 1px border).
// Update this if the nav's padding or button size changes.
const NAV_HEIGHT = 71;

function SignUp() {
  const IMAGE_SQUARE =
    'https://res.cloudinary.com/doiwe9d5a/image/upload/v1788529293/TodayEatz_background-image_2_1_tbveo7.png';
  const IMAGE_WIDE =
    'https://res.cloudinary.com/doiwe9d5a/image/upload/v1788531472/hero-fresh-food-wide_r1eqyy.webp';
  return (
    <Box
      sx={{
        minHeight: `calc(100dvh - ${NAV_HEIGHT}px)`,
        backgroundImage: {
          xs: `url(${IMAGE_SQUARE})`,
          lg: `url(${IMAGE_WIDE})`,
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
