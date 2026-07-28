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
    </div>
  );
}
