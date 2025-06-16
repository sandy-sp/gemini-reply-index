// src/App.jsx (updated imports and routes)
import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom'; // Import Link
import { AuthProvider, useAuth } from './context/AuthContext';

// Import your components
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import Feed from './components/Feed';
import CreatePost from './components/CreatePost'; // Import CreatePost
import PostDetail from './components/PostDetail'; // We'll create this next

import './App.css'; // Your main App CSS

// PrivateRoute component to protect routes
function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="loading-state">Loading authentication...</div>; // Or a spinner
  }

  return currentUser ? children : <Navigate to="/signin" />;
}

function App() {
  const { currentUser } = useAuth(); // Access currentUser for conditional rendering in header

  return (
    <AuthProvider>
      <div className="App">
        <header>
          <nav className="main-nav">
            <Link to="/" className="nav-logo">Gemini Reply Index</Link>
            <div className="nav-links">
              <Link to="/" className="nav-item">Home</Link>
              {currentUser ? (
                <>
                  <Link to="/dashboard" className="nav-item">Dashboard</Link>
                  <Link to="/create-post" className="nav-item">Create Post</Link>
                </>
              ) : (
                <>
                  <Link to="/signin" className="nav-item">Sign In</Link>
                  <Link to="/signup" className="nav-item">Sign Up</Link>
                </>
              )}
            </div>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Feed />} />
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
            <Route
              path="/create-post"
              element={
                <PrivateRoute>
                  <CreatePost />
                </PrivateRoute>
              }
            />
            <Route path="/post/:postId" element={<PostDetail />} /> {/* Add PostDetail route */}
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;