import { useState, useEffect, useMemo } from 'react';
import { baseFetch } from '../api-helper';
const BASE_URL = 'http://localhost:8080/api/v1';

export function useNutritionalGoals() {
  const [nutritionGoals, setNutritionGoals] = useState({});
  useEffect(() => {
    async function getNutritionGoals() {
      const data = await baseFetch(`${BASE_URL}/nutrition-goals/`, {
        method: 'GET',
        credentials: 'include',
      });
      setNutritionGoals(() => data);
    }
    getNutritionGoals();
  }, []);

  const { calories_target, protein_target, fat_target, carbs_target } =
    nutritionGoals;
  const convertedMacrosForQuery = useMemo(
    () => ({
      calories: calories_target,
      protein: protein_target,
      fat: fat_target,
      carbs: carbs_target,
    }),
    [calories_target, protein_target, fat_target, carbs_target],
  );
  return convertedMacrosForQuery;
}
