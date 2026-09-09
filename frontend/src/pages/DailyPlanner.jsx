import { RecipeCard } from '../components/RecipeCard.jsx';
import { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';

import { baseFetch } from '../utils/api-helper.js';

import { SortBy } from '../components/SortBy.jsx';
import { SearchInput } from '../components/SearchInput.jsx';
import { DailyProgressContainer } from '../features/dailyMenu/components/DailyProgressContainer.jsx';
import {
  getDailyMenu,
  addRecipeToDailyMenu,
  removeRecipeFromDailyMenu,
} from '../features/dailyMenu/api/dailyMenuApi.js';
import { useAuth } from '../features/auth/context/AuthContext';
import useDebounce from '../utils/customHooks/useDebounce.js';
import { isValid } from '../utils/isValid.js';
import { sanitizeInput } from '../utils/sanitize.js';

import { useNutritionalGoals } from '../utils/customHooks/useNutritionGoals.js';

const MAX_DAILY_MEALS = 3;

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? '';
const BASE_PATH = `${API_ORIGIN}/api/v1/recipes`;

const FILTER_CONTAINER = {
  width: '100%',
  display: 'flex',
  // On the narrowest screens the search drops onto its own row so the two
  // sort selects still have room for their labels.
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: 2,
};

const MAIN_CONTAINER = {
  fontFamily: 'sans-serif',
  px: { xs: 2, sm: 3 },
  pt: 4,
  // Clears the fixed bottom navigation bar.
  pb: 10,
};
const RECIPE_LIST = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  pt: 2,
};
const RECIPE_NAV = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mt: 2,
};

export default function DailyPlanner() {
  const [recipes, setRecipes] = useState([]);
  const [recipeCount, setRecipeCount] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [databasePageNumber, setDatabasePageNumber] = useState(1);
  const [pagination, setPagination] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('calories');
  const [sortDirection, setSortDirection] = useState('asc');

  const [dailyMenuRecipes, setDailyMenuRecipes] = useState([]);
  const [isPlannerExpanded, setIsPlannerExpanded] = useState(false);

  const debouncedFilterTerm = useDebounce(searchTerm, 500);

  const { goals, macros, error: goalsError } = useNutritionalGoals();

  const { csrfToken } = useAuth();

  useEffect(() => {
    if (!macros.calories) return;

    const paramsObj = {
      sortBy,
      sortDirection,
      limit: 10,
      page: databasePageNumber,
      ...macros,
    };

    if (debouncedFilterTerm) {
      paramsObj.find = debouncedFilterTerm;
    }

    const params = new URLSearchParams(paramsObj);

    async function getTailoredRecipes() {
      let data = null;
      let resp = null;

      setError('');
      setIsLoading(true);

      try {
        resp = await baseFetch(`${BASE_PATH}?${params}`, {
          method: 'GET',
          credentials: 'include',
        });

        data = await resp;
        setRecipes(data.recipes);
        setRecipeCount(
          data.recipes?.length === 10
            ? data.recipe?.length
            : data.recipes?.length - 2,
        );
        setPagination(data.pagination);
        setCount(0);
      } catch (error) {
        if (
          debouncedFilterTerm ||
          sortBy !== sortBy ||
          sortDirection !== sortDirection
        ) {
          setError(`Search and Filter Error\n${error.message}`);
        } else {
          setError(`Fetch Error\n${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    }
    getTailoredRecipes();
  }, [debouncedFilterTerm, sortBy, sortDirection, databasePageNumber, macros]);

  useEffect(() => {
    async function loadDailyMenu() {
      const { status, data } = await getDailyMenu();
      if (status === 200) {
        setDailyMenuRecipes(data.recipes);
      }
    }

    loadDailyMenu();
  }, []);

  async function handleAddToPlanner(recipeId) {
    const { status, data } = await addRecipeToDailyMenu(recipeId, csrfToken);
    if (status === 201) {
      setDailyMenuRecipes((prev) => [...prev, data]);
      setIsPlannerExpanded(true);
    }
  }

  async function handleRemoveFromPlanner(dailyMenuRecipeId) {
    const { status, data } = await removeRecipeFromDailyMenu(
      dailyMenuRecipeId,
      csrfToken,
    );
    if (status === 204) {
      setDailyMenuRecipes((prev) =>
        prev.filter(
          (recipe) => recipe.daily_menu_recipe_id !== dailyMenuRecipeId,
        ),
      );
      return;
    }
    setError(data.message || 'Could not remove that meal. Please try again.');
  }

  async function previous() {
    setCount((prev) => prev - 2);
    if (count === 0 && databasePageNumber > 1) {
      //this sets reipes to empty so when new fetch is triggered
      // they do not stack
      setRecipes([]);
      const previousPageNumber = databasePageNumber - 1;
      setDatabasePageNumber(previousPageNumber);
      setCount(0);
    }
  }

  function next() {
    setCount((prev) => prev + 2);
    if (count + 2 === 10) {
      setDatabasePageNumber((p) => p + 1);
    }
  }

  function handleSearchChange(newTerm) {
    if (isValid(newTerm)) {
      if (sanitizeInput(newTerm) === '') {
        setError('Only non-malicous character');
        return;
      }
    }
    setSearchTerm(newTerm);
  }

  function handleChangeSortBy(newMacroSort) {
    setSortBy(newMacroSort);
  }
  function handleChangeSortDirection(newSortDirection) {
    setSortDirection(newSortDirection);
  }

  return (
    <Box sx={MAIN_CONTAINER}>
      <DailyProgressContainer
        goals={goals}
        goalsError={goalsError}
        recipes={dailyMenuRecipes}
        onRemoveRecipe={handleRemoveFromPlanner}
        isExpanded={isPlannerExpanded}
        setIsExpanded={setIsPlannerExpanded}
      />

      <Box sx={FILTER_CONTAINER}>
        <SearchInput
          searchTerm={searchTerm}
          onFilterChange={handleSearchChange}
        />
        <SortBy
          onSortByChange={handleChangeSortBy}
          onSortDirectionChange={handleChangeSortDirection}
          sortBy={sortBy}
          sortDirection={sortDirection}
        />
      </Box>
      {error && <h3 style={{ color: 'red' }}>{error}</h3>}
      {isLoading && <h1>Loading Recipes...</h1>}

      <Box sx={RECIPE_LIST}>
        {recipes.slice(count, count + 2).map((recipe) => (
          <RecipeCard
            key={recipe.id}
            {...recipe}
            handleAddToPlanner={handleAddToPlanner}
            disabled={dailyMenuRecipes.length >= MAX_DAILY_MEALS}
          />
        ))}
      </Box>

      <Box sx={RECIPE_NAV}>
        <Button
          key="previous-button"
          variant="contained"
          size="large"
          type="button"
          disabled={count === 0 && pagination.hasPrev === false}
          onClick={previous}
        >
          prev
        </Button>

        <Button
          key="next-button"
          variant="contained"
          size="large"
          type="button"
          disabled={count === recipeCount && pagination.hasNext === false}
          onClick={next}
        >
          next
        </Button>
      </Box>
    </Box>
  );
}
