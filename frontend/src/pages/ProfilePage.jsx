import { useState, useEffect, useContext } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import AuthContext from '../context/AuthContext';
import postService from '../services/postService';
import PostItem from '../components/PostItem'; // We can reuse this component!

const ProfilePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
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
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Typography variant="h6">Username: {user.username}</Typography>
      <Typography variant="h6" sx={{mb: 4}}>Email: {user.email}</Typography>

      <Typography variant="h5" gutterBottom>My Posts</Typography>
      {posts.length > 0 ? (
        posts.map((post) => <PostItem key={post.post_id} post={post} />)
      ) : (
        <Typography>You have not created any posts yet.</Typography>
      )}
    </Box>
  );
};

export default ProfilePage;