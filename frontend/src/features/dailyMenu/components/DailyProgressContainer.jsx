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

import { ariaNotify } from '../../../utils/aria-notify';

const MACROS = [
  { goalKey: 'calories_target', recipeKey: 'calories', label: 'Calories' },
  { goalKey: 'carbs_target', recipeKey: 'carbs', label: 'Carbs' },
  { goalKey: 'fat_target', recipeKey: 'fat', label: 'Fat' },
  { goalKey: 'protein_target', recipeKey: 'protein', label: 'Protein' },
];

const NO_OP = () => {};

// isExpanded/setIsExpanded are lifted up to DailyPlanner too,
// so it can open this popup itself right after a recipe is added to the planner
export function DailyProgressContainer({
  goals,
  goalsError = '',
  recipes = [],
  onRemoveRecipe = NO_OP,
  isExpanded = false,
  setIsExpanded = NO_OP,
}) {
  const [triggerEl, setTriggerEl] = useState(null);

  // This popup has no title of its own, so a screen reader user wouldn't otherwise 
  // know it opened - announce it manually instead.
  useEffect(() => {
    if (!isExpanded) return;

    const mealText =
      recipes.length === 1 ? '1 meal' : `${recipes.length} meals`;
    ariaNotify(`Daily meal summary expanded. ${mealText} added today.`);
  }, [isExpanded, recipes.length]);

  useEffect(() => {
    if (goalsError) {
      ariaNotify(goalsError, { priority: 'high' });
    }
  }, [goalsError]);

  if (goalsError) {
    return (
      <Typography color="error" sx={{ mb: 3 }}>
        {goalsError}
      </Typography>
    );
  }

  if (!goals) {
    return (
      <Typography sx={{ mb: 3 }}>Loading your nutrition goals...</Typography>
    );
  }

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
        ref={setTriggerEl}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
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
        anchorEl={triggerEl}
        onClose={() => setIsExpanded(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slots={{ transition: Fade }}
        slotProps={{
          paper: {
            sx: {
              // A bit wider/taller than the trigger and nudged up-left, so
              // this paper fully covers it - no sliver of the trigger
              // should peek out from behind the edges.
              width: (triggerEl?.offsetWidth ?? 0) + 8,
              ml: '-4px',
              mt: '-4px',
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
            {recipes.slice(0, 3).map((recipe) => {
              // Same convention RecipeCard uses: instructions holding a URL
              // means it's an external recipe link.
              const isExternalRecipe = recipe.instructions?.startsWith('http');

              return (
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
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      // Typography defaults to <p> (block) here, but an <a>
                      // is inline - force block so the layout stays the same either way.
                      sx={{ display: 'block' }}
                      {...(isExternalRecipe && {
                        component: 'a',
                        href: recipe.instructions,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      })}
                    >
                      {recipe.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {recipe.calories} cal · {recipe.carbs}g carbs ·{' '}
                      {recipe.fat}g fat · {recipe.protein}g protein
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    onClick={() => onRemoveRecipe(recipe.daily_menu_recipe_id)}
                  >
                    Remove
                  </Button>
                </Box>
              );
            })}
          </Stack>
        )}
      </Popover>
    </Box>
  );
}
