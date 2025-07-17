import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import PostsPage from './pages/PostsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage'; // ++ ADD THIS IMPORT ++
import PostDetailPage from './pages/PostDetailPage'; // ++ ADD THIS IMPORT ++
import EditPostPage from './pages/EditPostPage'; // ++ ADD THIS IMPORT ++
import { Container } from '@mui/material';

// -- DELETE THE OLD PLACEHOLDER LINE THAT WAS HERE --

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Container sx={{ mt: 4 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />

            {/* Protected Routes */}
            <Route
              path="/posts"
              element={
                <ProtectedRoute>
                  <PostsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;