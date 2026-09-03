import { TextField, Button, Stack, Alert } from '@mui/material';
import { useAuth } from '../../auth/context/AuthContext.jsx';
import { useState } from 'react';
import { validateRecipe, toRecipePayload } from '../utils/validators.js';

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? '';
const BASE_PATH = `${API_ORIGIN}/api/v1/recipes`;

const NUMERIC_INPUT = { slotProps: { htmlInput: { inputMode: 'numeric' } } };
const EMPTY_FORM = {
  title: '',
  instructions: '',
  ingredients: '',
  servings: '',
  total_time_minutes: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
};

export function AddRecipeForm() {
  const { csrfToken } = useAuth();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [serverMessage, setServerMessage] = useState(null); // { type: 'success' | 'error', text }
  const [touched, setTouched] = useState({});
  const errors = validateRecipe(formData);
  const isFormValid = Object.keys(errors).length === 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setServerMessage(null);

    if (!isFormValid) {
      setTouched(
        Object.keys(formData).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {},
        ),
      );
      return;
    }

    try {
      const response = await fetch(BASE_PATH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(toRecipePayload(formData)),
        credentials: 'include',
      });
      if (response.ok) {
        setServerMessage({
          type: 'success',
          text: 'Recipe saved successfully',
        });
        setFormData(EMPTY_FORM);
        setTouched({});
      } else if (response.status === 401) {
        setServerMessage({
          type: 'error',
          text: 'Your session has expired. Please log in again.',
        });
      } else {
        setServerMessage({ type: 'error', text: 'Could not save the recipe' });
      }
    } catch (error) {
      console.error('Sending created recipe failed', error);
      setServerMessage({ type: 'error', text: 'Unable to reach the server' });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(e) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }

  const fieldProps = (name) => {
    const showError = Boolean(touched[name] && errors[name]);
    return {
      name,
      value: formData[name],
      onChange: handleChange,
      onBlur: handleBlur,
      error: showError,
      helperText: showError ? errors[name] : undefined,
    };
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack spacing={2}>
        {serverMessage && (
          <Alert severity={serverMessage.type} aria-live="polite">
            {serverMessage.text}
          </Alert>
        )}
        <TextField
          fullWidth
          id="title"
          label="Title"
          {...fieldProps('title')}
          required
        />
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={12}
          id="instructions"
          label="Instructions"
          {...fieldProps('instructions')}
          required
        />
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={8}
          id="ingredients"
          label="Ingredients"
          {...fieldProps('ingredients')}
        />
        <TextField
          fullWidth
          id="total_time_minutes"
          label="Total cook time"
          {...fieldProps('total_time_minutes')}
          {...NUMERIC_INPUT}
        />
        <TextField
          fullWidth
          id="servings"
          label="Servings"
          {...fieldProps('servings')}
          {...NUMERIC_INPUT}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            id="calories"
            label="Calories"
            {...fieldProps('calories')}
            {...NUMERIC_INPUT}
          />
          <TextField
            fullWidth
            id="protein"
            label="Protein"
            {...fieldProps('protein')}
            {...NUMERIC_INPUT}
          />
          <TextField
            fullWidth
            id="carbs"
            label="Carbs"
            {...fieldProps('carbs')}
            {...NUMERIC_INPUT}
          />
          <TextField
            fullWidth
            id="fat"
            label="Fat"
            {...fieldProps('fat')}
            {...NUMERIC_INPUT}
          />
        </Stack>
      </Stack>
      <Button
        variant="contained"
        fullWidth
        size="large"
        type="submit"
        sx={{ mt: 3 }}
        disabled={!isFormValid}
      >
        Save recipe
      </Button>
    </form>
  );
}
