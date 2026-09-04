import { useState } from 'react';
import { useNavigate } from 'react-router';
import { registerUser } from '../api/authApi';
import {
  isValidName,
  isValidEmail,
  isValidPassword,
} from '../utils/validators';
import { TextField, Button, Stack, Alert } from '@mui/material';
import DuplicateEmail from './DuplicateEmail';
import Modal from '../../../components/shared/Modal';
import { useAuth } from '../context/AuthContext';

function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const isFormValid =
    isValidName(name) && isValidEmail(email) && isValidPassword(password);

  const nameError = name.length > 0 && !isValidName(name);
  const emailError = email.length > 0 && !isValidEmail(email);
  const passwordError = password.length > 0 && !isValidPassword(password);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await registerUser(name, email, password);

      if (response.status !== 201) {
        if (response.status === 409) {
          setModalOpen(true);
        } else if (response.status === 400) {
          setErrorMessage(
            response.data.message ||
              'Invalid input data. Please check your fields.',
          );
        } else {
          setErrorMessage(response.data.message || 'Something went wrong.');
        }
        return;
      }
      login(response.data);
      navigate('/onboarding');
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
            passwordError
              ? 'Password must be at least 8 characters and include upper and lower case letters, a number, and a special character.'
              : ' '
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <DuplicateEmail
          onSignIn={() => navigate('/login')}
          onTryAgain={() => setModalOpen(false)}
        />
      </Modal>
      {successMessage && navigate('/onboarding')}
    </form>
  );
}
export default SignUpForm;
