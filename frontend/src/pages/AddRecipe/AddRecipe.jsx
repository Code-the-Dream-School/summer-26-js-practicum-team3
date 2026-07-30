import styles from './AddRecipe.module.css';
import { useState } from 'react';

export default function AddRecipe() {
  const [formData, setFormData] = useState({
    title: '',
    instructions: '',
    ingredients: '',
    servings: '',
    total_cook_time: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/v1/recipes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      console.log('Sending created recipe to back', error);
    }
  }
  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.value;
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
          <label htmlFor="total_cook_time">Total cook time</label>
          <input
            id="total_cook_time"
            type="text"
            name="total_cook_time"
            inputMode="numeric"
            onChange={handleChange}
            value={formData.total_cook_time}
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
          <label htmlFor="fats">Fats</label>
          <input
            id="fats"
            type="text"
            name="fats"
            inputMode="numeric"
            onChange={handleChange}
            value={formData.fats}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
