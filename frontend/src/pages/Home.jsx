import { RecipeCard } from '../components/RecipeCard.jsx';
import { useEffect, useState } from 'react';
import { paginationFetch } from '../utils/api-helper.js';

import { SortBy } from '../components/SortBy.jsx';
import { SearchInput } from '../components/SearchInput.jsx';
import useDebounce from '../utils/useDebounce.js';
import { isValid } from '../utils/isValid.js';
import { sanitizeInput } from '../utils/sanatize.js';

const BASE_URL = 'http://localhost:8080/api/v1/recipes/';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [databasepageNumber, setDatabasePageNumber] = useState(1);
  const [pagination, setPagination] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('' | 'calories');
  const [sortDirection, setSortDirection] = useState('' | 'asc');

  //  const statusFilter = searchParams.get('status') || '1'; //<--This could be how we pick from our recipes and theirs. simple button or filter
  const debouncedFilterTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    let stopDoubles = false;

    const paramsObj = {
      sortBy,
      sortDirection,
      limit: 10,
    };

    if (debouncedFilterTerm) {
      paramsObj.find = debouncedFilterTerm;
    }
    console.log('ParamsObj', paramsObj);
    const params = new URLSearchParams(paramsObj);

    async function baseFetch() {
      let data = null;
      let resp = null;

      // const options = {
      //   headers: { 'X-CSRF-TOKEN': token },
      //   credentials: 'include',
      // };
      setError('');
      setIsLoading(true);

      try {
        resp = await fetch(`${BASE_URL}?${params}`);
        if (!resp?.ok) {
          throw new Error('Failed to fetch from backend');
        }

        data = await resp.json();
        console.log(data.recipes);
        if (!stopDoubles) {
          setRecipes(data.recipes);
          setPagination(data.pagination);
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

    baseFetch();
    return () => {
      console.log('one render clean-up');
      stopDoubles = true;
    };
  }, [debouncedFilterTerm, sortBy, sortDirection]);

  async function getMore() {
    const nextPageNumber = databasepageNumber + 1;
    setDatabasePageNumber(nextPageNumber);
    console.log('something', databasepageNumber);
    const nextSetOfRecipes = await paginationFetch(
      `${BASE_URL}?page=${nextPageNumber}&sortBy=${sortBy}&sortDirection=${sortDirection}&limit=10&find=${debouncedFilterTerm}`,
    );
    setRecipes((prev) => [...nextSetOfRecipes.recipes]);
    setPagination(nextSetOfRecipes.pagination);
    setCount(0);
  }

  function prev() {
    setCount((prev) => prev - 2);
  }

  function next() {
    setCount((prev) => prev + 2);
    if (count + 2 === 10) {
      getMore();
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
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoading && <p>Loading Recipes...</p>}
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <button
          type="button"
          disabled={count === 0 ? true : false}
          onClick={prev}
        >
          prev
        </button>

        <button
          type="button"
          disabled={count === 10 ? true : false}
          onClick={next}
        >
          next
        </button>
        {recipes.slice(count, count + 2).map((recipe, index) => (
          <RecipeCard key={index} {...recipe} />
        ))}
      </div>
    </main>
  );
}
