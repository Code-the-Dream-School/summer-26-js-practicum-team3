/*eslint-disable */
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

  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const [databasepageNumber, setDatabasePageNumber] = useState(1);
  const [pagination, setPagination] = useState({});

  const [searchTerm, setSearchTerm] = useState('');

  //  const statusFilter = searchParams.get('status') || '1'; //<--This could be how we pick from our recipes and theirs. simple button or filter
  const debouncedFilterTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    let stopDoubles = false;

    //basic get req
    //we will need something that gets their macros values
    // to create a tailored search

    const paramsObj = {
      sortBy,
      sortDirection,
      limit: 10,
    };
    if (debouncedFilterTerm) {
      paramsObj.find = debouncedFilterTerm;
    }

    const params = new URLSearchParams(paramsObj);

    async function baseFetch() {
      let data = null;

      const options = {
        headers: { 'X-CSRF-TOKEN': token },
        credentials: 'include',
      };
      setIsLoading(true);
      try {
        const resp = await fetch(`${BASE_URL}${params}`, options);
        if (!resp.ok) {
          throw new Error('Failed to fetch from backend');
        }
        setMessage('Fetch Success');
        data = await resp.json();
        console.log(data.recipes);
        if (!stopDoubles) {
          setRecipes(data.recipes);
          setPagination(data.pagination);
        }
      } catch (error) {
        setError(error.message);
      }
    }

    baseFetch();
    return () => {
      console.log('one render clean-up');
      stopDoubles = true;
    };
  }, []);

  async function getMore() {
    const nextPageNumber = databasepageNumber + 1;
    setDatabasePageNumber(nextPageNumber);
    console.log('something', databasepageNumber);
    const nextSetOfRecipes = await paginationFetch(
      `http://localhost:8080/api/v1/recipes/?page=${nextPageNumber}&limit=10&search=${searchTerm}`,
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
    {
      count + 2 === 10 && getMore();
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

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && <p>{message}</p>}
      <SearchInput
        searchTerm={searchTerm}
        onFilterChange={handleSearchChange}
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
