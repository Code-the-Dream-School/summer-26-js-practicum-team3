import { Link, Outlet } from 'react-router';
import styled from 'styled-components';

const AnchorLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: bold;
  margin-right: 1rem;
  cursor: pointer;

  &:hover {
    color: #007bff;
  }
`;

export default function AppLayout() {
  return (
    <div>
      <nav className="app-nav">
        <ul className="app-nav-list">
          <li>
            <AnchorLink to="/">Home</AnchorLink>
          </li>
          <li>
            <AnchorLink to="/daily-planner">Daily Planner</AnchorLink>
          </li>
          <li>
            <AnchorLink to="/goals">Goals</AnchorLink>
          </li>
          <li>
            <AnchorLink to="/add-recipe">Add Recipe</AnchorLink>
          </li>
          <li>
            <AnchorLink to="/profile">Profile</AnchorLink>
          </li>
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
