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

  const convertedMacrosForQuery = useMemo(() => {
    return {
      calories: nutritionGoals.calories_target,
      protein: nutritionGoals.protein_target,
      fat: nutritionGoals.fat_target,
      carbs: nutritionGoals.carbs_target,
    };
  }, [nutritionGoals]);
  return convertedMacrosForQuery;
}
