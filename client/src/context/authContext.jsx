import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/verifyToken', { withCredentials: true })
      .then(res => {
        if (res.data.valid) {
          setLoggedIn(true);
          setUsername(res.data.username);
        }
      })
      .catch(() => {
        setLoggedIn(false);
        setUsername(null);
      })
      .finally(() => {
        setLoading(false); // 👈 set when done
      });
  }, []);

  const logout = () => {
    axios.post('/api/logout', { withCredentials: true })
      .then(() => {
        setLoggedIn(false);
        setUsername(null);
      });
  };

  return (
    <AuthContext.Provider value={{ username, loggedIn, logout , loading}}>
      {children}
    </AuthContext.Provider>
  );
};