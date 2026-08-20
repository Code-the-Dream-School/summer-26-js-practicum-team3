import { useEffect, useState } from 'react';
import { Box, LinearProgress, Stack, Typography } from '@mui/material';

import { getNutritionGoals } from '../api/nutritionGoalsApi';

const MACROS = [
  { key: 'calories_target', label: 'Calories' },
  { key: 'carbs_target', label: 'Carbs' },
  { key: 'fat_target', label: 'Fat' },
  { key: 'protein_target', label: 'Protein' },
];

export function DailyProgressContainer() {
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

  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={1.5}>
        {MACROS.map(({ key, label }) => (
          <Box key={key}>
            <Typography variant="body2">
              {label}: 0 / {goals[key]}
            </Typography>
            <LinearProgress variant="determinate" value={0} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
