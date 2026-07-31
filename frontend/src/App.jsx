import { useEffect, useState } from 'react';
import './App.css';
import { RecipeCard } from './components/RecipeCard';
import { BrowserRouter as Router, Route, Routes } from 'react-router';

// Connected Pages
import { DailyPlanner } from '../pages/dailyplanner';
import { Goals } from '../pages/goals';
import { AddRecipe } from '../pages/addRecipe';
import { Profile } from '../pages/profile';

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
import { DailyPlanner } from '../pages/dailyplanner';

function AppContent() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Call the backend API
    fetch('http://localhost:8080/api/hello')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch from backend');
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    // TODO: replace inline styles with CSS classes
    <main style={{ fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {MOCK_RECIPE_DATA.map((recipe, index) => (
          <RecipeCard key={index} {...recipe} />
        ))}
      </div>

      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dailyplanner">Daily Planner</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/dailyplanner" element={<DailyPlanner />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/addRecipe" element={<AddRecipe />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!error && (
        <p>
          Message from API: <strong>{message}</strong>
        </p>
      )}
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
