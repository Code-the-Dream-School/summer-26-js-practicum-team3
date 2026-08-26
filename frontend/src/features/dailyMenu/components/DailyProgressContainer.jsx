/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Fade,
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
  // Keep anchorEl even after the popup closes. If we clear it, the popup's
  // width drops to 0 while it is still fading out, and it looks broken.
  const [anchorEl, setAnchorEl] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Recipe values come from the database as text, not numbers.
  // If a value is missing, use 0 instead of NaN.
  const totals = recipes.reduce((acc, recipe) => {
    MACROS.forEach(({ recipeKey }) => {
      const value = Number(recipe[recipeKey]) || 0;
      acc[recipeKey] = (acc[recipeKey] || 0) + value;
    });
    return acc;
  }, {});

  const macroRows = MACROS.map(({ goalKey, recipeKey, label }) => {
    const goal = Number(goals[goalKey]) || 0;
    const total = totals[recipeKey] || 0;
    const percent = goal > 0 ? Math.min((total / goal) * 100, 100) : 0;
    return { key: goalKey, label, total, goal, percent };
  });

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
          setIsExpanded((prev) => !prev);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setAnchorEl(event.currentTarget);
            setIsExpanded((prev) => !prev);
          }
        }}
        sx={{ cursor: 'pointer' }}
      >
        <Stack spacing={1.5}>
          {macroRows.map(({ key, label, total, goal, percent }) => (
            <Box key={key}>
              <Typography variant="body2">
                {label}: {total} / {goal}
              </Typography>
              <LinearProgress variant="determinate" value={percent} />
            </Box>
          ))}
        </Stack>
      </Box>

      <Popover
        open={isExpanded}
        anchorEl={anchorEl}
        onClose={() => setIsExpanded(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slots={{ transition: Fade }}
        slotProps={{
          paper: {
            sx: {
              // Make the popup a little bigger than the bars behind it,
              // so it fully covers them with no edge showing.
              width: (anchorEl?.offsetWidth ?? 0) + 8,
              ml: '-2px',
              mt: '-2px',
              p: 1.5,
            },
          },
        }}
      >
        <Stack spacing={1.5} sx={{ mb: 1 }}>
          {macroRows.map(({ key, label, total, goal, percent }) => (
            <Box key={key}>
              <Typography variant="body2">
                {label}: {total} / {goal}
              </Typography>
              <LinearProgress variant="determinate" value={percent} />
            </Box>
          ))}
        </Stack>

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
