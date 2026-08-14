import { RecipeCard } from '../components/RecipeCard.jsx';
import { useEffect, useState } from 'react';

// TODO: Replace MOCK_RECIPE_DATA with data fetched from the backend API
const MOCK_RECIPE_DATA = [
  {
    title: 'How to Cook Bacon in the Oven',
    instructions: 'https://www.allrecipes.com/recipe/267904/oven-baked-bacon',
    total_time_minutes: 35,
    servings: 6,
    calories: 134,
    protein: 9,
    fat: 10,
    carbs: 0,
    ingredients: '1 (16 ounce) package bacon',
  },
  {
    title: 'Boiled Peanuts',
    instructions: 'https://www.allrecipes.com/recipe/17551/boiled-peanuts/',
    total_time_minutes: 185,
    servings: 40,
    calories: 322,
    protein: 15,
    fat: 28,
    carbs: 9,
    ingredients:
      '5 pounds raw peanuts, in shells, 1 cup salt, or to taste, water to cover',
  },
  {
    id: 967,
    user_id: 1,
    title: 'Manicotti Pancakes II',
    instructions:
      'https://www.allrecipes.com/recipe/20566/manicotti-pancakes-ii/',
    total_time_minutes: 15,
    servings: 12,
    calories: 66,
    protein: 3,
    fat: 2,
    carbs: 9,
    ingredients: '3  eggs, 1 cup milk, 1 cup all-purpose flour',
  },
];

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

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
          setRecipes((previous) => [...previous, ...data.recipes]);
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
    </main>
  );
}
