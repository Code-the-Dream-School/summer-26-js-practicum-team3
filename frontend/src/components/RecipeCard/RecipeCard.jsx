import { useState } from 'react';

import styles from './RecipeCard.module.css';

/**
 *
 * @typedef {object} RecipeCardProps
 * @prop {string} title
 * @prop {number} total_time_minutes
 * @prop {string} ingredients
 * @prop {string} instructions
 * @prop {number} servings
 * @prop {number} protein
 * @prop {number} carbs
 * @prop {number} calories
 * @prop {number} fat
 */

/**
 * @param {RecipeCardProps} props
 */
export function RecipeCard({
  id,
  title,
  total_time_minutes,
  servings,
  protein,
  carbs,
  calories,
  fat,
  instructions,
  ingredients,
}) {
  return (
    <div className={styles.root}>
      <h2>{title}</h2>
      <h3>Summary</h3>
      <ul>
        <li>Time: {total_time_minutes}</li>
        <li>Servings: {servings}</li>
      </ul>
      <h3>Nutrition facts</h3>
      <ul className={styles.nutritionList}>
        <li className={styles.nutritionItem}>
          <span>{calories}</span>
          <span>Calories</span>
        </li>
        <li className={styles.nutritionItem}>
          <span>{carbs}g</span>
          <span>Carbs</span>
        </li>
        <li className={styles.nutritionItem}>
          <span>{fat}g</span>
          <span>Fat</span>
        </li>
        <li className={styles.nutritionItem}>
          <span>{protein}g</span>
          <span>Protein</span>
        </li>
      </ul>
      <button type="button" onClick={() => handleAddToPlanner(id)}>
        Add To Planner
      </button>
      <RecipeCardDetails
        ingredients={ingredients}
        instructions={instructions}
        title={title}
      />
    </div>
  );
}

/**
 *
 * @param {Pick<RecipeCardProps, 'ingredients' | 'instructions' | 'title'>} props
 */
function RecipeCardDetails({ ingredients, instructions, title }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <details open={isExpanded} onToggle={() => setIsExpanded((prev) => !prev)}>
      <summary>
        <span>{isExpanded ? 'Hide' : 'Show'} ingredients</span>
        <span className="visually-hidden">for {title}</span>
      </summary>
      <div>
        <h3>Ingredients</h3>
        <span>{ingredients}</span>
      </div>
      <div>
        <h3>Instructions</h3>
        <span>{instructions}</span>
      </div>
    </details>
  );
}
