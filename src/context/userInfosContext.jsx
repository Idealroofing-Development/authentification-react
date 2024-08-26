// UserInfoContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';

export const UserInfoContext = createContext();

export const UserInfoProvider = ({ children }) => {
  const [userInfos, setUserInfos] = useState(null);
  const {user} = useAuth()

  useEffect(() => {
    const storedUserInfos = localStorage.getItem('userInfos');
    if (storedUserInfos) {
      setUserInfos(JSON.parse(storedUserInfos));
    }
  }, [user]);

  return (
    <UserInfoContext.Provider value={{ userInfos, setUserInfos }}>
      {children}
    </UserInfoContext.Provider>
  );
};
