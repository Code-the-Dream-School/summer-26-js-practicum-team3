import { createContext, useContext, useState } from 'react';
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [name, setName] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);

  const login = (data) => {
    setName(data.name);
    setCsrfToken(data.csrfToken);
  };

  const logout = () => {
    setName(null);
    setCsrfToken(null);
  };
  return (
    <AuthContext.Provider value={{ userName: name, csrfToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
