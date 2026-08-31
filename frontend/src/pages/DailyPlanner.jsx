import { RecipeCard } from '../components/RecipeCard.jsx';
import { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';

import { baseFetch } from '../utils/api-helper.js';
import { useHasCompletedOnboarding } from '../features/dailyMenu/useHasCompletedOnboarding.js';

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

const BASE_URL = 'http://localhost:8080/api/v1/recipes/';

const MAIN_CONTAINER = {
  height: '79dvh',
  padding: '8px',
  fontFamily: 'sans-serif',
  position: 'relative',
};
const RECIPE_NAV = {
  position: 'absolute',
  bottom: '3px',
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  px: 2,
};

export default function DailyPlanner() {
  const [recipes, setRecipes] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const hasCompletedOnboarding = useHasCompletedOnboarding();

  const [databasepageNumber, setDatabasePageNumber] = useState(1);
  const [, setPagination] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('calories');
  const [sortDirection, setSortDirection] = useState('asc');

  const [dailyMenuRecipes, setDailyMenuRecipes] = useState([]);
  const [isPlannerExpanded, setIsPlannerExpanded] = useState(false);

  //  const statusFilter = searchParams.get('user_id') || '1'; //<--This could be how we pick from our recipes and theirs. simple button or filter
  const debouncedFilterTerm = useDebounce(searchTerm, 500);

  const { goals, macros, error: goalsError } = useNutritionalGoals();

  const { csrfToken } = useAuth();

  useEffect(() => {
    if (!macros.calories) return;

    const paramsObj = {
      sortBy,
      sortDirection,
      limit: 10,
      page: databasepageNumber,
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
        resp = await baseFetch(`${BASE_URL}?${params}`, {
          method: 'GET',
          credentials: 'include',
        });

        data = await resp;

        setRecipes(data.recipes);
        setPagination(data.pagination);
        setCount(0);

        setIsLoading(false);
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
      }
    }
    getTailoredRecipes();
  }, [debouncedFilterTerm, sortBy, sortDirection, databasepageNumber, macros]);

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
    if (count === 0 && databasepageNumber > 1) {
      const previousPageNumber = databasepageNumber - 1;
      setDatabasePageNumber(previousPageNumber);
      setCount(0);
      setRecipes([]);
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
    <main style={MAIN_CONTAINER}>
      {hasCompletedOnboarding && (
        <DailyProgressContainer
          goals={goals}
          goalsError={goalsError}
          recipes={dailyMenuRecipes}
          onRemoveRecipe={handleRemoveFromPlanner}
          isExpanded={isPlannerExpanded}
          setIsExpanded={setIsPlannerExpanded}
        />
      )}
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoading && <h1>Loading Recipes...</h1>}
      {recipes.slice(count, count + 2).map((recipe) => (
        <RecipeCard
          key={recipe.id}
          {...recipe}
          handleAddToPlanner={handleAddToPlanner}
          disabled={dailyMenuRecipes.length >= MAX_DAILY_MEALS}
        />
      ))}
      <Box sx={RECIPE_NAV}>
        <Button
          variant="contained"
          size="large"
          type="button"
          disabled={count === 0 && databasepageNumber === 1}
          onClick={previous}
        >
          prev
        </Button>

        <Button
          variant="contained"
          size="large"
          type="button"
          disabled={count === 10}
          onClick={next}
        >
          next
        </Button>
      </Box>
    </main>
  );
}
