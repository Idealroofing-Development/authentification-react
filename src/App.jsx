import React, { useState } from 'react';
import './App.css';
import { useAuth } from './context/auth-context';
import AuthenticatedApp from './Router/AuthenticatedApp.jsx';
import UnauthenticatedApp from './Router/UnauthenticatedApp.jsx';
import Spiner from './components/pageRendu/Spiner.jsx';
import { UserInfoProvider } from './context/userInfosContext';

function App() {
  // on teste si le user exciste on retourne la plaitor de l'authentification (route et contexte et tous ce qui va avec )
  const { user } = useAuth();
  return (
    <React.Suspense fallback={<Spiner />}>
      {user ? (
        <UserInfoProvider>
          <AuthenticatedApp />
        </UserInfoProvider>
      ) : (
        <UnauthenticatedApp />
      )}
    </React.Suspense>
  );
}

export default App;
