/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Box, LinearProgress, Stack, Typography } from '@mui/material';

import { getNutritionGoals } from '../api/nutritionGoalsApi';

const MACROS = [
  { goalKey: 'calories_target', recipeKey: 'calories', label: 'Calories' },
  { goalKey: 'carbs_target', recipeKey: 'carbs', label: 'Carbs' },
  { goalKey: 'fat_target', recipeKey: 'fat', label: 'Fat' },
  { goalKey: 'protein_target', recipeKey: 'protein', label: 'Protein' },
];

export function DailyProgressContainer({ recipes = [] }) {
  const [goals, setGoals] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let stopDoubles = false;

    async function loadGoals() {
      const { status, data } = await getNutritionGoals();

      if (stopDoubles) return;

      if (status !== 200) {
        setError(data.message || 'Could not load your nutrition goals.');
        return;
      }

      setGoals(data);
    }

    loadGoals();

    return () => {
      stopDoubles = true;
    };
  }, []);

  if (error) {
    return (
      <Typography color="error" sx={{ mb: 3 }}>
        {error}
      </Typography>
    );
  }

  if (!goals) {
    return (
      <Typography sx={{ mb: 3 }}>Loading your nutrition goals...</Typography>
    );
  }

  // Recipe macro fields come back from Prisma as strings (Decimal), and a
  // recipe with no value set for a field is just missing that key entirely -
  // Number(undefined) is NaN, so fall back to 0 for both cases.
  const totals = recipes.reduce((acc, recipe) => {
    MACROS.forEach(({ recipeKey }) => {
      const value = Number(recipe[recipeKey]) || 0;
      acc[recipeKey] = (acc[recipeKey] || 0) + value;
    });
    return acc;
  }, {});

  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={1.5}>
        {MACROS.map(({ goalKey, recipeKey, label }) => {
          const goal = Number(goals[goalKey]) || 0;
          const total = totals[recipeKey] || 0;
          const percent = goal > 0 ? Math.min((total / goal) * 100, 100) : 0;

          return (
            <Box key={goalKey}>
              <Typography variant="body2">
                {label}: {total} / {goal}
              </Typography>
              <LinearProgress variant="determinate" value={percent} />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
