import { createContext, useContext, useEffect, useState } from 'react';
import { initStorage, getCurrentUser, getTheme, toggleTheme, setCurrentUser, getUsers } from '../utils/storage';
import { initialUsers } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState(null);
  const [theme, setThemeState] = useState('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      initStorage();
      const user = getCurrentUser();
      const appTheme = getTheme();
      
      setCurrentUserState(user || initialUsers[0]);
      setThemeState(appTheme);
      document.documentElement.className = appTheme;
      setIsInitialized(true);
    } catch (error) {
      console.error('App initialization error:', error);
      setCurrentUserState(initialUsers[0]);
      setThemeState('light');
      document.documentElement.className = 'light';
      setIsInitialized(true);
    }
  }, []);

  const handleToggleTheme = () => {
    const newTheme = toggleTheme();
    setThemeState(newTheme);
    document.documentElement.className = newTheme;
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentUserState(user);
  };

  const handleRoleSwitch = (role) => {
    const users = getUsers();
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      setCurrentUserState(targetUser);
    }
  };

  const handleLogout = () => {
    const users = getUsers();
    const defaultUser = users.find(u => u.role === 'student') || users[0];
    setCurrentUser(defaultUser);
    setCurrentUserState(defaultUser);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      theme,
      isInitialized,
      onToggleTheme: handleToggleTheme,
      onLogin: handleLogin,
      onRoleSwitch: handleRoleSwitch,
      onLogout: handleLogout
    }}>
      {isInitialized && children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
