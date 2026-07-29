import { useState } from 'react';
import registerUser from '../api/authApi';

function SignUpForm() {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
const [successMessage, setSuccessMessage] = useState('');
const [errorType, setErrorType] = useState('');


const handleSubmit = async (event) =>{
    event.preventDefault(); 
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setErrorType('');

 try {
    const response = await registerUser(name, email, password);
    
    if (response.status !== 201) {
        if (response.status === 409) {
          setErrorMessage('This email is already in use. Please log in.');
          setErrorType('emailTaken');
          alert('This email is already in use. Please log in.')
        } else if (response.status === 400) {
          setErrorMessage('Invalid input data. Please check your fields.');
          setErrorType('validation');
          alert('Invalid input data. Please check your fields.')
        } else {
          setErrorMessage(response.data.message || 'Something went wrong.');
        }
        return;
      }
      setSuccessMessage('Account created successfully!');
      console.log('Registered user:', response.data);
 } catch(error) {  
    setErrorMessage("Submission failed: A critical error occurred");
    console.error(error);
}finally{
    setLoading(false)
 }
};
return (
    <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="nameInput">Name</label>
            <input id="nameInput" 
                   type="text"
                   value={name} 
                   onChange={(e) => setName(e.target.value)} 
            />
        </div>
        <div>
            <label htmlFor="emailInput">Email</label>
            <input id="emailInput" 
                   type="email"
                   value={email} 
                   onChange={(e) => setEmail(e.target.value)} 
            />
        </div>
        <div>
            <label htmlFor="passwordInput">Password</label>
            <input id="passwordInput"
                   type="password" 
                   value={password} 
                   onChange={(e) => setPassword(e.target.value)} 
            />
        </div>
         <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
        </button>
         {errorMessage && <p>{errorMessage}</p>}

         {errorType === 'emailTaken' && (
            <>
              <button type="button">Sign In</button>
              <button type="button">Try Again</button>
            </>
            )}

         {successMessage && <p>{successMessage}</p>}
    </form>
);
}
export default SignUpForm; 