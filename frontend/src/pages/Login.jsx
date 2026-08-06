import { Link } from 'react-router';

function Login() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Log In</h2>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}
export default Login;
