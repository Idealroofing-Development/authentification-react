// UserInfoContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';

export const PermissionsContext = createContext();



export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState(null);
  const {user} = useAuth()

  useEffect(() => {
    const storedPermissions = localStorage.getItem('permissions');
    if (storedPermissions) {
      setPermissions(JSON.parse(storedPermissions));
    }
  }, [user]);

  return (
    <PermissionsContext.Provider value={{ permissions, setPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};
