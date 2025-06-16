import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig'; // Import your Firebase auth instance
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Clean up subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    // You can add sign-up, sign-in, sign-out functions here later,
    // or keep them in separate components. For now, we'll just expose currentUser.
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only after authentication state is determined */}
    </AuthContext.Provider>
  );
};