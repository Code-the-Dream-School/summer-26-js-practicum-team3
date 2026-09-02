import { useState, useEffect, useMemo } from 'react';
import { baseFetch } from '../api-helper';

const BASE_URL = 'http://localhost:8080/api/v1';

// Single source of truth for nutrition goals on the page - both
// DailyProgressContainer (needs the raw *_target fields) and the tailored
// recipe query (needs them renamed, without the _target suffix) read from
// here instead of each fetching /nutrition-goals on their own.
export function useNutritionalGoals() {
  const [nutritionGoals, setNutritionGoals] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isRan = false;

    async function getNutritionGoals() {
      try {
        const data = await baseFetch(`${BASE_URL}/nutrition-goals/`, {
          method: 'GET',
          credentials: 'include',
        });
        if (isRan) return;
        setNutritionGoals(data);
      } catch (err) {
        if (isRan) return;
        setError(err.message || 'Could not load your nutrition goals.');
      }
    }

    getNutritionGoals();

    return () => {
      isRan = true;
    };
  }, []);

  const convertedMacrosForQuery = useMemo(() => {
    if (!nutritionGoals) return {};
    return {
      calories: nutritionGoals.calories_target,
      protein: nutritionGoals.protein_target,
      fat: nutritionGoals.fat_target,
      carbs: nutritionGoals.carbs_target,
    };
  }, [nutritionGoals]);

  return { goals: nutritionGoals, macros: convertedMacrosForQuery, error };
}
