import { useState } from 'react';
import registerUser from '../api/authApi';
import {
  isValidName,
  isValidEmail,
  isValidPassword,
} from '../utils/validators';
import { TextField, Button, Stack, Alert } from '@mui/material';

function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorType, setErrorType] = useState('');
  const isFormValid =
    isValidName(name) && isValidEmail(email) && isValidPassword(password);

  const nameError = name.length > 0 && !isValidName(name);
  const emailError = email.length > 0 && !isValidEmail(email);
  const passwordError = password.length > 0 && !isValidPassword(password);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setErrorType('');

    try {
      const response = await registerUser(name, email, password);

      if (response.status !== 201) {
        if (response.status === 409) {
          setErrorMessage('This email is already in use. Please log in.');
          setErrorType('emailTaken');
        } else if (response.status === 400) {
          setErrorMessage('Invalid input data. Please check your fields.');
          setErrorType('validation');
        } else {
          setErrorMessage(response.data.message || 'Something went wrong.');
        }
        return;
      }
      setSuccessMessage('Account created successfully!');
      console.log('Registered user:', response.data);
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
          label="Name"
          id="nameInput"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError}
          helperText={nameError ? 'Name must be at least 2 characters' : ' '}
          fullWidth
        />
        <TextField
          label="Email"
          id="emailInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          helperText={emailError ? 'Please enter a valid email address' : ' '}
          fullWidth
        />

        <TextField
          label="Password"
          id="passwordInput"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          helperText={
            passwordError ? 'Password must be at least 8 characters' : ' '
          }
          fullWidth
        />
      </Stack>
      <Button
        variant="contained"
        fullWidth
        size="large"
        type="submit"
        disabled={loading || !isFormValid}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {errorType === 'emailTaken' && (
        <>
          <button type="button">Log In</button>
          <button type="button">Try Again</button>
        </>
      )}
      {successMessage && (
        <Alert severity="success" aria-live="polite" sx={{ mt: 2 }}>
          {successMessage}
        </Alert>
      )}
    </form>
  );
}
export default SignUpForm;
