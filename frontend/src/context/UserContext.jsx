import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from local storage
  useEffect(() => {
    const initUser = async () => {
      const storedUserId = localStorage.getItem('userId');
      const storedRole = localStorage.getItem('userRole');
      const storedUsername = localStorage.getItem('username');

      if (storedUserId) {
        setUser({
          id: storedUserId,
          role: storedRole || 'student',
          username: storedUsername || 'user'
        });
      }
      setLoading(false);
    };

    initUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userId', userData.id);
    if (userData.role) localStorage.setItem('userRole', userData.role);
    if (userData.username) localStorage.setItem('username', userData.username);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
