import { Link } from 'react-router';


function Login() {
  return (
    <div style={{ padding: '2rem'}}>
      <h2>Log In</h2>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
      <Button variant="contained">Test</Button>
    </div>
  );
}
export default Login;
