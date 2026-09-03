import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/authApi';
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [name, setName] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  const login = (data) => {
    setName(data.name);
    setCsrfToken(data.csrfToken);
  };

  const logout = () => {
    setName(null);
    setCsrfToken(null);
  };

  useEffect(() => {
    async function checkSession() {
      const response = await getMe();
      if (response.status === 200) {
        login(response.data);
      }
     
      setIsChecking(false);
    }
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ userName: name, csrfToken, login, logout, isChecking }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
