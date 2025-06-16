// src/components/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
      navigate('/signin'); // Redirect to sign-in page after logout
    } catch (error) {
      console.error('Error logging out:', error);
      // In a real app, you might show a user-friendly error message here
    }
  };

  // Show loading state if auth state is not yet determined
  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Loading Dashboard...</h2>
        <p>Please wait while we fetch your details.</p>
      </div>
    );
  }

  // If no current user, redirect to sign-in (should ideally be handled by PrivateRoute)
  if (!currentUser) {
    return (
      <div className="dashboard-container">
        <h2>Access Denied</h2>
        <p>You need to be logged in to view this page. <Link to="/signin">Sign In</Link></p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome to Your Dashboard, {currentUser.email}!</h2>
      <p>This is where you manage your AI-generated content.</p>

      <div className="dashboard-actions">
        <Link to="/create-post" className="dashboard-button">Create New Post</Link>
        {/* Link to view user's own posts will go here later */}
        <button onClick={handleLogout} className="dashboard-button logout-button">Log Out</button>
      </div>

      {/* Placeholder for "My Posts" and "Metrics" (future implementations) */}
      <div className="my-posts-section">
        <h3>My Posts (Coming Soon)</h3>
        <p>You will see a list of your previously created posts and their metrics here.</p>
      </div>
    </div>
  );
}

export default Dashboard;
