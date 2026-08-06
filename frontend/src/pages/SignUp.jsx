import { Link } from 'react-router';
import SignUpForm from '../features/auth/components/SignUpForm';
import { Card, Box, CardContent, Typography } from '@mui/material';

function SignUp() {
  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
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
  );
}

export default SignUp;
