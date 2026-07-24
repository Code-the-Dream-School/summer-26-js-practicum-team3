export function RecipeCardSmall({
  title,
  total_time_minutes,
  servings,
  protein,
  carbs,
  calories,
  fat,
}) {
  return (
    <>
      <h2>{title}</h2>
    </>
  );
}

export function RecipeCardExpanded({
  title,
  total_time_minutes,
  servings,
  protein,
  carbs,
  calories,
  fat,
  ingredients,
  instructions,
}) {
  return (
    <>
      <h2>Large Card</h2>
    </>
  );
}
