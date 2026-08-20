import { RecipeCard } from '../components/RecipeCard.jsx';
import { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';

import { baseFetch } from '../utils/api-helper.js';

import { SortBy } from '../components/SortBy.jsx';
import { SearchInput } from '../components/SearchInput.jsx';
import { DailyProgressContainer } from '../features/dailyMenu/components/DailyProgressContainer.jsx';
import { useHasCompletedOnboarding } from '../features/dailyMenu/useHasCompletedOnboarding.js';
import {
  getDailyMenu,
  addRecipeToDailyMenu,
} from '../features/dailyMenu/api/dailyMenuApi.js';
import { useAuth } from '../features/auth/context/AuthContext';
import useDebounce from '../utils/useDebounce.js';
import { isValid } from '../utils/isValid.js';
import { sanitizeInput } from '../utils/sanitize.js';

const MAX_DAILY_MEALS = 3;

const BASE_URL = 'http://localhost:8080/api/v1/recipes/';

const MAIN_CONTAINER = {
  // border: '2px solid red',
  height: '79dvh',
  padding: '8px',
  fontFamily: 'sans-serif',
  position: 'relative',
};
const RECIPE_NAV = {
  position: 'absolute',
  bottom: '10px',
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  px: 2,
};

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [databasepageNumber, setDatabasePageNumber] = useState(1);
  const [, setPagination] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('calories');
  const [sortDirection, setSortDirection] = useState('asc');

  const [dailyMenuRecipes, setDailyMenuRecipes] = useState([]);

  //  const statusFilter = searchParams.get('user_id') || '1'; //<--This could be how we pick from our recipes and theirs. simple button or filter
  const debouncedFilterTerm = useDebounce(searchTerm, 500);
  const hasCompletedOnboarding = useHasCompletedOnboarding();
  const { csrfToken } = useAuth();

  useEffect(() => {
    let stopDoubles = false;

    const paramsObj = {
      sortBy,
      sortDirection,
      limit: 10,
      page: databasepageNumber,
    };

    if (debouncedFilterTerm) {
      paramsObj.find = debouncedFilterTerm;
    }
    const params = new URLSearchParams(paramsObj);

    async function initialFetch() {
      let data = null;
      let resp = null;

      setError('');
      setIsLoading(true);

      try {
        console.log('ParamsObj', `${BASE_URL}?${params}`);
        resp = await baseFetch(`${BASE_URL}?${params}`);

        data = await resp;

        if (!stopDoubles) {
          setRecipes(data.recipes);
          setPagination(data.pagination);
          setCount(0);
        }
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
    initialFetch();
    return () => {
      console.log('one render clean-up');
      stopDoubles = true;
    };
  }, [debouncedFilterTerm, sortBy, sortDirection, databasepageNumber]);

  useEffect(() => {
    let stopDoubles = false;

    async function loadDailyMenu() {
      const { status, data } = await getDailyMenu();
      if (stopDoubles) return;
      if (status === 200) {
        setDailyMenuRecipes(data.recipes);
      }
    }

    loadDailyMenu();

    return () => {
      stopDoubles = true;
    };
  }, []);

  async function handleAddToPlanner(recipeId) {
    const { status, data } = await addRecipeToDailyMenu(recipeId, csrfToken);
    if (status === 201) {
      setDailyMenuRecipes((prev) => [...prev, data]);
    }
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
        <DailyProgressContainer recipes={dailyMenuRecipes} />
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
