import React from 'react';
import { QueryCache } from '@tanstack/react-query';

import * as auth from '../provider-auth';

import FullPageErrorFallback from '../components/pageRendu/FullPageErrorFallback';
import { useAsync } from '../utils/hooks';
import { client } from '../utils/api-client';
import Spiner from '../components/pageRendu/Spiner';

async function bootstrapAppData() {
  let user = null;

  const token = await auth.getToken();
  if (token) {
    user = token;
  }
  return user;
}

const AuthContext = React.createContext();
AuthContext.displayName = 'AuthContext';

function AuthProvider(props) {
  const {
    data: user,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData
  } = useAsync();

  React.useEffect(() => {
    const appDataPromise = bootstrapAppData();
    run(appDataPromise);
  }, [run]);

  const login = React.useCallback(
    async (form) => {
      await auth.login(form).then((user) => setData(user));
    },
    [setData]
  );

  const register = React.useCallback(
    (form) => {
      auth.register(form).then((user) => setData(user));
    },
    [setData]
  );
  const logout = React.useCallback(() => {
    const queryCache = new QueryCache();
    auth.logout();
    queryCache.clear();
    setData(null);
  }, [setData]);

  const value = React.useMemo(
    () => ({ user, login, logout, register }),
    [login, logout, register, user]
  );

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  if (isLoading || isIdle) {
    return <Spiner />;
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />;
  }

  throw new Error(`Unhandled status: ${status}`);
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

function useClient() {
  const { user } = useAuth();
  console.log({ user });
  const token = user?.token;
  return React.useCallback((endpoint, config) => client(endpoint, { ...config, token }), [token]);
}

export { AuthProvider, useAuth, useClient, bootstrapAppData };
