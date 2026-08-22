/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  LinearProgress,
  Popover,
  Stack,
  Typography,
} from '@mui/material';

import { getNutritionGoals } from '../api/nutritionGoalsApi';

const MACROS = [
  { goalKey: 'calories_target', recipeKey: 'calories', label: 'Calories' },
  { goalKey: 'carbs_target', recipeKey: 'carbs', label: 'Carbs' },
  { goalKey: 'fat_target', recipeKey: 'fat', label: 'Fat' },
  { goalKey: 'protein_target', recipeKey: 'protein', label: 'Protein' },
];

const NO_OP = () => {};

export function DailyProgressContainer({
  recipes = [],
  onRemoveRecipe = NO_OP,
}) {
  const [goals, setGoals] = useState(null);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const isExpanded = Boolean(anchorEl);

  useEffect(() => {
    let isRan = false;

    async function loadGoals() {
      const { status, data } = await getNutritionGoals();

      if (isRan) return;

      if (status !== 200) {
        setError(data.message || 'Could not load your nutrition goals.');
        return;
      }

      setGoals(data);
    }

    loadGoals();

    return () => {
      isRan = true;
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
      <Box
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={(event) =>
          setAnchorEl((prev) => (prev ? null : event.currentTarget))
        }
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setAnchorEl((prev) => (prev ? null : event.currentTarget));
          }
        }}
        sx={{ cursor: 'pointer' }}
      >
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

      <Popover
        open={isExpanded}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { width: anchorEl?.offsetWidth, p: 1.5 } } }}
      >
        {recipes.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No meals added yet.
          </Typography>
        ) : (
          <Stack spacing={0}>
            {recipes.slice(0, 3).map((recipe) => (
              <Box
                key={recipe.daily_menu_recipe_id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 1,
                  py: 0.75,
                  '&:not(:last-of-type)': {
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  },
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {recipe.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {recipe.calories} cal · {recipe.carbs}g carbs · {recipe.fat}
                    g fat · {recipe.protein}g protein
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => onRemoveRecipe(recipe.daily_menu_recipe_id)}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        )}
      </Popover>
    </Box>
  );
}
