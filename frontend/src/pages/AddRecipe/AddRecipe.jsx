import styles from './AddRecipe.module.css';

export default function AddRecipe() {
  return (
    <div className={styles.root}>
      <h2>Add Recipe</h2>
      <form className={styles.formContainer}>
        <div>
          <label htmlFor="title">Recipe Name</label>
          <input id="title" type="text" required />
        </div>
        <div>
          <label htmlFor="instructions">Instructions</label>
          <input id="instructions" type="text" required />
        </div>
        <div>
          <label htmlFor="ingredients">Ingredients</label>
          <input id="ingredients" type="text" />
        </div>
        <div>
          <label htmlFor="total_time">Total cook time</label>
          <input id="total_time" type="text" inputMode="numeric" />
        </div>
        <div>
          <label htmlFor="servings">Servings</label>
          <input id="servings" type="text" inputMode="numeric" />
        </div>
        <div>
          <label htmlFor="calories">Calories</label>
          <input id="calories" type="text" inputMode="numeric" />
        </div>
        <div>
          <label htmlFor="protein">Protein</label>
          <input id="protein" type="text" inputMode="numeric" />
        </div>
        <div>
          <label htmlFor="carbs">Carbs</label>
          <input id="carbs" type="text" inputMode="numeric" />
        </div>
        <div>
          <label htmlFor="fats">Fats</label>
          <input id="fats" type="text" inputMode="numeric" />
        </div>
      </form>
    </div>
  );
}
