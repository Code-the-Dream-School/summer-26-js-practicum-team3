import { Link } from 'react-router';
import SignUpForm from '../features/auth/components/SignUpForm';

function SignUp() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <p>
        Have an account? <Link to="/login">Log In</Link>
      </p>
      <SignUpForm />
    </div>
  );
}

export default SignUp;
