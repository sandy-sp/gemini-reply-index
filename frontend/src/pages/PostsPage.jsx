import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import postService from '../services/postService';
import PostItem from '../components/PostItem';

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, []); // The empty array ensures this runs only once when the component loads

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gemini Reply Index
      </Typography>
      <Button component={RouterLink} to="/create" variant="contained" color="primary" sx={{ mb: 2 }}>
        Create New Post
      </Button>
      <Box>
        {posts.length > 0 ? (
          posts.map((post) => <PostItem key={post.post_id} post={post} />)
        ) : (
          <Typography>No posts found. Be the first to create one!</Typography>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;