import { Link } from 'react-router';

function NotFound() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Page Not Found</h2>
      <p>
        The page you are trying to reach doesn’t exist or may have been moved.
      </p>
      <Link to="/">Home</Link>
    </div>
  );
}
export default NotFound;
