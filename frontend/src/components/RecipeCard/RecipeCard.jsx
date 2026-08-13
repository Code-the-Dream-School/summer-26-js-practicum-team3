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

const CARD_CONTAINER = { width: '75%', justifySelf: 'center' };
const CARD_CONTEXT = {
  textAlign: 'left',
  p: '8px',
  '&:last-child': { pb: '12px' },
};
const FLEX_COLUMN = { display: 'flex', flexDirection: 'column' };
const STACKED_TEXT = { textAlign: 'center', ...FLEX_COLUMN };
const EXPANDED_CARD_TEXT = { textAlign: 'left', display: 'flex' };
const TITLE_BUTTON_CONTAINER = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
const LIST_CONTROL = { p: 0, m: 0, listStyle: 'none' };
const TEXT_HIDDEN_FOR_SCREEN_READERS = { display: 'none' };
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
    <Card variant="outlined" sx={CARD_CONTAINER}>
      <CardContent sx={CARD_CONTEXT}>
        <Box sx={TITLE_BUTTON_CONTAINER}>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
          <Button variant="contained" onClick={() => handleAddToPlanner(id)}>
            Add To Planner
          </Button>
        </Box>

        <Stack direction="row" spacing={3} component="ul" sx={LIST_CONTROL}>
          <Box component="li" sx={STACKED_TEXT}>
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

          <Box component="li" sx={STACKED_TEXT}>
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

          <Box component="li" sx={STACKED_TEXT}>
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

          <Box component="li" sx={STACKED_TEXT}>
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
        <Typography component="span" sx={TEXT_HIDDEN_FOR_SCREEN_READERS}>
          for {title}
        </Typography>
      </summary>
      <div>
        <Typography component="h3" variant="h6">
          Ingredients
        </Typography>
        <Typography variant="caption" component="span" color="text.secondary">
          {ingredients}
        </Typography>
      </div>
      <div>
        <Typography component="h3" variant="h6">
          Instructions
        </Typography>
        <Typography variant="caption" component="span" color="text.secondary">
          {instructions?.startsWith('http') ? (
            <a href={instructions} about="_blank">
              Link to site
            </a>
          ) : (
            instructions
          )}
        </Typography>
      </div>
      <Stack direction="row" spacing={3} component="ul" sx={LIST_CONTROL}>
        <Box sx={STACKED_TEXT}>
          <Typography component="span">{total_time_minutes}</Typography>
          <Typography variant="caption" component="span" color="text.secondary">
            Minutes
          </Typography>
        </Box>
        <Box sx={STACKED_TEXT}>
          <Typography component="span">{servings}</Typography>
          <Typography variant="caption" component="span" color="text.secondary">
            Servings
          </Typography>
        </Box>
      </Stack>
    </details>
  );
}
