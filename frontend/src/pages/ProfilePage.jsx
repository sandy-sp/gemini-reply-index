import { useState, useEffect, useContext } from 'react';
import { Box, Typography, CircularProgress, Button, Grid } from '@mui/material'; // ++ IMPORT Grid ++
import { Link as RouterLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import postService from '../services/postService';
import ProfilePostCard from '../components/ProfilePostCard'; // ++ USE THE NEW CARD ++

const ProfilePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // ... useEffect hook is unchanged
    const fetchUserPosts = async () => {
      try {
        const data = await postService.getMyPosts(user.token);
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchUserPosts();
    }
  }, [user?.token]);


  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      {/* --- User Info and Create Button (Unchanged) --- */}
      <Typography variant="h4" gutterBottom>My Profile</Typography>
      <Typography variant="h6">Username: {user.username}</Typography>
      <Typography variant="h6" sx={{mb: 2}}>Email: {user.email}</Typography>
      <Button component={RouterLink} to="/create" variant="contained" color="primary" sx={{ mb: 4 }}>
        Create New Post
      </Button>

      <Typography variant="h5" gutterBottom>My Posts</Typography>

      {/* ++ USE A GRID CONTAINER FOR POSTS ++ */}
      <Grid container spacing={2}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Grid item key={post.post_id} xs={12} sm={6} md={4}>
              <ProfilePostCard post={post} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>You have not created any posts yet.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ProfilePage;