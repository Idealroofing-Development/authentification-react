import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
// import { AuthProvider } from "./auth-context";
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './auth-context';
import { UserInfoProvider } from './userInfosContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry(failureCount, error) {
        if (error.status === 404) return false;
        else if (failureCount < 2) return true;
        else return false;
      }
    },
    mutations: {
      // mutation options
    }
  }
});

function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <UserInfoProvider>{children}</UserInfoProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export { AppProviders };
