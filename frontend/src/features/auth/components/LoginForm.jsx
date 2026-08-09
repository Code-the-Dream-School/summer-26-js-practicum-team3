import { useState } from 'react';
import { loginUser } from '../api/authApi';
import { isValidEmail } from '../utils/validators';
import { TextField, Button, Stack, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isFormValid = isValidEmail(email) && password.length > 0;
  const emailError = email.length > 0 && !isValidEmail(email);
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await loginUser(email, password);

      if (response.status !== 200) {
        if (response.status === 401) {
          setErrorMessage(response.data.message);
          setPassword('');
        } else if (response.status === 400) {
          setErrorMessage('Invalid input data. Please check your fields.');
        } else {
          setErrorMessage(response.data.message || 'Something went wrong.');
        }
        return;
      }
      login(response.data);
    } catch (error) {
      setErrorMessage('Submission failed: A critical error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          label="Email"
          id="emailInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          helperText={emailError ? 'Please enter a valid email address' : ' '}
          fullWidth
          autoComplete="email"
        />

        <TextField
          label="Password"
          id="passwordInput"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          autoComplete="current-password"
        />
      </Stack>
      <Button
        variant="contained"
        fullWidth
        size="large"
        type="submit"
        disabled={loading || !isFormValid}
        sx={{ mt: 2 }}
      >
        {loading ? 'Logging In...' : 'Log in'}
      </Button>
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </form>
  );
}
export default LoginForm;
