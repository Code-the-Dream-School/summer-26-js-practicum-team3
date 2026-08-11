import { Link } from 'react-router';
import LoginForm from '../features/auth/components/LoginForm';
import { Card, Box, CardContent, Typography } from '@mui/material';

function Login() {
  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', p: 3 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            fontWeight={600}
            align="center"
            sx={{ mb: 3 }}
          >
            Login
          </Typography>
          <LoginForm />
          <Typography variant="body1" align="center" sx={{ mt: 3 }}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
export default Login;
