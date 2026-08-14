import { RecipeCard } from '../components/RecipeCard.jsx';
import { useEffect, useState } from 'react';
import { paginationFetch } from '../utils/api-helper.js';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [count, setCount] = useState(0);

  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const [databasepageNumber, setDatabasePageNumber] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    let stopDoubles = false;

    //basic get req
    //we will need something that gets their macros values
    // to create a tailored search
    async function baseFetch() {
      let data = null;
      try {
        const resp = await fetch(
          'http://localhost:8080/api/v1/recipes/?limit=10',
        );
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
      `http://localhost:8080/api/v1/recipes/?page=${nextPageNumber}&limit=10`,
    );
    setRecipes((prev) => [...nextSetOfRecipes.recipes]);
    setPagination(nextSetOfRecipes.pagination);
    setCount(0);
  }
  function prev() {
    setCount((prev) => prev - 2);
  }
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && <p>{message}</p>}
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
        <button type="button" onClick={getMore}>
          Get More
        </button>
        <button
          type="button"
          disabled={count === 8 ? true : false}
          onClick={() => setCount((prev) => prev + 2)}
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
