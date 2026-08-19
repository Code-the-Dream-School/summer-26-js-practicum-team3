import styles from './AddRecipe.module.css';
import { useState } from 'react';
import { Box, TextField } from '@mui/material';

export default function AddRecipe() {
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
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/v1/recipes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('confirm response', data);
        alert('Recipe saved successfully');
      }
    } catch (error) {
      console.log('Sending created recipe to back', error);
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
    <Box sx={{ padding: '2rem', margin: '2rem' }}>
      <h2>Add Recipe</h2>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            id="title"
            label="Title"
            type="text"
            name="title"
            value={formData.title}
            required
            onChange={handleChange}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            id="instructions"
            label="Instructions"
            type="text"
            name="instructions"
            value={formData.instructions}
            required
            onChange={handleChange}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            id="ingredients"
            label="Ingredients"
            type="text"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            id="total_time_minutes"
            label="Total cook time"
            type="text"
            name="total_time_minutes"
            slotProps={{ htmlinput: { inputMode: 'numeric' } }}
            onChange={handleChange}
            value={formData.total_time_minutes}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            id="servings"
            label="Servings"
            type="text"
            name="servings"
            slotProps={{ htmlinput: { inputMode: 'numeric' } }}
            onChange={handleChange}
            value={formData.servings}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            id="calories"
            label="Calories"
            type="text"
            name="calories"
            slotProps={{ htmlinput: { inputMode: 'numeric' } }}
            onChange={handleChange}
            value={formData.calories}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            id="protein"
            label="Protein"
            type="text"
            name="protein"
            slotProps={{ htmlinput: { inputMode: 'numeric' } }}
            onChange={handleChange}
            value={formData.protein}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            id="carbs"
            label="Carbs"
            type="text"
            name="carbs"
            slotProps={{ htmlinput: { inputMode: 'numeric' } }}
            onChange={handleChange}
            value={formData.carbs}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            id="fat"
            label="Fat"
            type="text"
            name="fat"
            slotProps={{ htmlinput: { inputMode: 'numeric' } }}
            onChange={handleChange}
            value={formData.fat}
          />
        </Box>
        <button type="submit">Save</button>
      </form>
    </Box>
  );
}
