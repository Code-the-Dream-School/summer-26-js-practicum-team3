import styles from './AddRecipe.module.css';
import { useState } from 'react';

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
    <div className={styles.root}>
      <h2>Add Recipe</h2>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Recipe Name</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="instructions">Instructions</label>
          <input
            id="instructions"
            type="text"
            name="instructions"
            required
            onChange={handleChange}
            value={formData.instructions}
          />
        </div>
        <div>
          <label htmlFor="ingredients">Ingredients</label>
          <input
            id="ingredients"
            type="text"
            name="ingredients"
            onChange={handleChange}
            value={formData.ingredients}
          />
        </div>
        <div>
          <label htmlFor="total_time_minutes">Total cook time</label>
          <input
            id="total_time_minutes"
            type="text"
            name="total_time_minutes"
            inputMode="numeric"
            onChange={handleChange}
            value={formData.total_time_minutes}
          />
        </div>
        <div>
          <label htmlFor="servings">Servings</label>
          <input
            id="servings"
            type="text"
            name="servings"
            inputMode="numeric"
            onChange={handleChange}
            value={formData.servings}
          />
        </div>
        <div>
          <label htmlFor="calories">Calories</label>
          <input
            id="calories"
            type="text"
            name="calories"
            inputMode="numeric"
            onChange={handleChange}
            value={formData.calories}
          />
        </div>
        <div>
          <label htmlFor="protein">Protein</label>
          <input
            id="protein"
            type="text"
            name="protein"
            inputMode="numeric"
            onChange={handleChange}
            value={formData.protein}
          />
        </div>
        <div>
          <label htmlFor="carbs">Carbs</label>
          <input
            id="carbs"
            type="text"
            name="carbs"
            inputMode="numeric"
            onChange={handleChange}
            value={formData.carbs}
          />
        </div>
        <div>
          <label htmlFor="fat">fat</label>
          <input
            id="fat"
            type="text"
            name="fat"
            inputMode="numeric"
            onChange={handleChange}
            value={formData.fat}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
