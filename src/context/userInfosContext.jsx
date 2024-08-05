// UserInfoContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UserInfoContext = createContext();

export const UserInfoProvider = ({ children }) => {
  const [userInfos, setUserInfos] = useState(null);

  useEffect(() => {
    const storedUserInfos = localStorage.getItem('userInfos');
    if (storedUserInfos) {
      setUserInfos(JSON.parse(storedUserInfos));
    }
  }, []);

  return (
    <UserInfoContext.Provider value={{ userInfos, setUserInfos }}>
      {children}
    </UserInfoContext.Provider>
  );
};
