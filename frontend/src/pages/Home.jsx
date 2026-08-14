import { RecipeCard } from '../components/RecipeCard.jsx';
import { useEffect, useState } from 'react';
import { paginationFetch } from '../utils/api-helper.js';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [pageLimit, setPageLimit] = useState(8);
  const [databasepageNumber, setDatabasePageNumber] = useState(1);
  const [page, setPage] = useState({});
  console.log('top level', recipes);
  useEffect(() => {
    let stopDoubles = false;

    //basic get req
    //we will need something that gets their macros values
    // to create a tailored search
    async function baseFetch() {
      let data = null;
      try {
        const resp = await fetch('http://localhost:8080/api/v1/recipes/');
        if (!resp.ok) {
          throw new Error('Failed to fetch from backend');
        }
        setMessage('Fetch Success');
        data = await resp.json();
        console.log(data.recipes);
        if (!stopDoubles) {
          setRecipes(data.recipes);
          // setRecipes((previous) => [...previous, ...data.recipes]);
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
  // TODO: dashboard
  // return <Dashboard />;

  async function getMore() {
    const nextPageNumber = databasepageNumber + 1;
    setDatabasePageNumber(nextPageNumber);
    console.log('something', databasepageNumber);
    const nextSetOfRecipes = await paginationFetch(
      `http://localhost:8080/api/v1/recipes/?page=${nextPageNumber}`,
    );
    setRecipes(nextSetOfRecipes.recipes);
    setPage(nextSetOfRecipes.pagination);
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
        {recipes.map((recipe, index) => (
          <RecipeCard key={index} {...recipe} />
        ))}
      </div>
      <button type="button" onClick={getMore}>
        Get More
      </button>
    </main>
  );
}
