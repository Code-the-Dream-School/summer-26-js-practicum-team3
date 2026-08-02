import { Link, Outlet } from 'react-router';

export default function AppLayout() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dailyplanner">Daily Planner</Link>
          </li>
          <li>
            <Link to="/goals">Goals</Link>
          </li>
          <li>
            <Link to="/add-recipe">Add Recipe</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
