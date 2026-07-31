import { Link } from 'react-router';

export default function AddRecipe() {
  return (
    <>
      <section className="navigation">
        <nav className="nav-bar">
          <ul>
            <li>
              <Link to="/dailyplanner">Daily Planner</Link>
            </li>
            <li>
              <Link to="/goals">Goals</Link>
            </li>
            <li>
              <Link to="/addRecipe">Add Recipe</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>
      </section>
    </>
  );
}
