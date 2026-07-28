import styles from './RecipeCard.module.css';

/**
 *
 * @typedef {object} RecipeCardProps
 * @prop {string} title
 * @prop {number} total_time_minutes
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
  title,
  total_time_minutes,
  servings,
  protein,
  carbs,
  calories,
  fat,
}) {
  return (
    <div className={styles.root}>
      <h2>{title}</h2>
      <h3>Summary</h3>
      Time: {total_time_minutes}
      Servings: {servings}
      <h3>Nutrition facts</h3>
      <ul>
        <li>Calories: {calories}</li>
        <li>Protein: {protein}g</li>
        <li>Carbs: {carbs}g</li>
        <li>Fat: {fat}g</li>
      </ul>
    </div>
  );
}
