import { TextField, Button, Stack, Alert } from '@mui/material';
import { useAuth } from '../../auth/context/AuthContext.jsx';
import { useState } from 'react';

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? '';
const BASE_PATH = `${API_ORIGIN}/api/v1/recipes`;

const NUMERIC_INPUT = { slotProps: { htmlInput: { inputMode: 'numeric' } } };

export function AddRecipeForm() {
  const { csrfToken } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    instructions: '',
    ingredients: '',
    servings: '',
    total_time_minutes: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  const [serverMessage, setServerMessage] = useState(null); // { type: 'success' | 'error', text }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(BASE_PATH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      if (response.ok) {
        setServerMessage({
          type: 'success',
          text: 'Recipe saved successfully',
        });
      } else {
        setServerMessage({ type: 'error', text: 'Could not save the recipe' });
      }
    } catch (error) {
      console.log('Sending created recipe failed', error);
    }
  }

  function handleChange(e) {
    const key = e.target.name;
    let value = e.target.value;
    if (e.target.getAttribute('inputMode') === 'numeric' && value !== '') {
      value = parseInt(value);
      if (Number.isNaN(value)) {
        alert(`This ${key} must be a number`);
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        <TextField
          fullWidth
          id="title"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={12}
          id="instructions"
          label="Instructions"
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={8}
          id="ingredients"
          label="Ingredients"
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          id="total_time_minutes"
          label="Total cook time"
          name="total_time_minutes"
          value={formData.total_time_minutes}
          onChange={handleChange}
          {...NUMERIC_INPUT}
        />
        <TextField
          fullWidth
          id="servings"
          label="Servings"
          name="servings"
          value={formData.servings}
          onChange={handleChange}
          {...NUMERIC_INPUT}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            id="calories"
            label="Calories"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            {...NUMERIC_INPUT}
          />
          <TextField
            fullWidth
            id="protein"
            label="Protein"
            name="protein"
            value={formData.protein}
            onChange={handleChange}
            {...NUMERIC_INPUT}
          />
          <TextField
            fullWidth
            id="carbs"
            label="Carbs"
            name="carbs"
            value={formData.carbs}
            onChange={handleChange}
            {...NUMERIC_INPUT}
          />
          <TextField
            fullWidth
            id="fat"
            label="Fat"
            name="fat"
            value={formData.fat}
            onChange={handleChange}
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
      >
        Save recipe
      </Button>
      {serverMessage && (
        <Alert severity={serverMessage.type} sx={{ mt: 2 }}>
          {serverMessage.text}
        </Alert>
      )}
    </form>
  );
}
