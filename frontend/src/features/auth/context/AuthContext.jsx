import { createContext, useContext, useState } from 'react';
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [name, setName] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);

  const login = (data) => {
    setName(data.name);
    setCsrfToken(data.csrfToken);
  };
  return (
    <AuthContext.Provider value={{ userName: name, csrfToken, login }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
