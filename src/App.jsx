import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import your components
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard'; // We'll create this next
import Feed from './components/Feed'; // We'll create this next

import './App.css'; // Your main App CSS

// PrivateRoute component to protect routes
function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner
  }

  return currentUser ? children : <Navigate to="/signin" />;
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header>
          <nav>
            {/* Navigation links will go here later */}
            <Link to="/">Home</Link>
            {/* Example: <Link to="/dashboard">Dashboard</Link> (conditionally visible) */}
            {/* Example: <Link to="/signin">Sign In</Link> / <Link to="/signup">Sign Up</Link> */}
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Feed />} /> {/* Public Feed will be here */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            {/* More routes for create-post, post-detail will come here */}
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;