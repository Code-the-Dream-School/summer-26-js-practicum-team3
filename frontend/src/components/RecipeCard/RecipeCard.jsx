import { useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Stack,
  Box,
} from '@mui/material';

const NO_OP = () => {};

/**
 *
 * @typedef {object} RecipeCardProps
 * @prop {string} id
 * @prop {string} title
 * @prop {number} total_time_minutes
 * @prop {string} ingredients
 * @prop {string} instructions
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
  id,
  title,
  total_time_minutes,
  servings,
  protein,
  carbs,
  calories,
  fat,
  instructions,
  ingredients,
  handleAddToPlanner = NO_OP,
}) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ textAlign: 'left' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
          <Button variant="contained" onClick={() => handleAddToPlanner(id)}>
            Add To Planner
          </Button>
        </Box>

        <Stack
          direction="row"
          spacing={3}
          component="ul"
          sx={{ p: 0, m: 0, listStyle: 'none' }}
        >
          <Box component="li" sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="span" display="block">
              {calories}
            </Typography>
            <Typography
              variant="caption"
              component="span"
              color="text.secondary"
            >
              Calories
            </Typography>
          </Box>

          <Box component="li" sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="span" display="block">
              {carbs}g
            </Typography>
            <Typography
              variant="caption"
              component="span"
              color="text.secondary"
            >
              Carbs
            </Typography>
          </Box>

          <Box component="li" sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="span" display="block">
              {fat}g
            </Typography>
            <Typography
              variant="caption"
              component="span"
              color="text.secondary"
            >
              Fat
            </Typography>
          </Box>

          <Box component="li" sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="span" display="block">
              {protein}g
            </Typography>
            <Typography
              variant="caption"
              component="span"
              color="text.secondary"
            >
              Protein
            </Typography>
          </Box>
        </Stack>

        {/* Accordion will go here with the rest of the info */}
        <RecipeCardDetails
          ingredients={ingredients}
          instructions={instructions}
          title={title}
          total_time_minutes={total_time_minutes}
          servings={servings}
        />
      </CardContent>
    </Card>
  );
}

/**
 *
 * @param {Pick<RecipeCardProps, 'ingredients' | 'instructions' | 'title'|'total_time_minutes'|'servings'>} props
 */

function RecipeCardDetails({
  ingredients,
  instructions,
  title,
  total_time_minutes,
  servings,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <details open={isExpanded} onToggle={() => setIsExpanded((prev) => !prev)}>
      <summary>
        <Typography component="span">
          {isExpanded ? 'Hide' : 'Show'} ingredients
        </Typography>
        <Typography component="span" sx={{ display: 'none' }}>
          for {title}
        </Typography>
      </summary>
      <div>
        <Typography component="h3" variant="h6">
          Ingredients
        </Typography>
        <Typography component="span">{ingredients}</Typography>
      </div>
      <div>
        <Typography component="h3" variant="h6">
          Instructions
        </Typography>
        <Typography component="span">{instructions}</Typography>
      </div>
      <div>
        <Typography component="h3" variant="h6">
          Summary
        </Typography>
        <Typography component="span">Time: {total_time_minutes}</Typography>
        <Typography component="span">Servings: {servings}</Typography>
      </div>
    </details>
  );
}
