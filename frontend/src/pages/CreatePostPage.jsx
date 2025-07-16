import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import AuthContext from '../context/AuthContext';
import postService from '../services/postService';

const CreatePostPage = () => {
  const [formData, setFormData] =useState({
    topic_title: '',
    focus_area: '',
    prompt: '',
    output_text: '',
    keywords: '', // We'll handle this as a comma-separated string for simplicity
  });

  const { topic_title, focus_area, prompt, output_text, keywords } = formData;

  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get the logged-in user's data (including token)

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...formData,
        // Convert comma-separated string to an array for the backend
        keywords: keywords.split(',').map(keyword => keyword.trim()),
      };
      await postService.createPost(postData, user.token);
      navigate('/posts'); // Redirect to the posts list on success
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '800px',
        mx: 'auto',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Create a New Post
      </Typography>
      <TextField
        label="Topic Title"
        name="topic_title"
        value={topic_title}
        onChange={onChange}
        margin="normal"
        required
      />
      <TextField
        label="Focus Area"
        name="focus_area"
        value={focus_area}
        onChange={onChange}
        margin="normal"
      />
      <TextField
        label="Keywords (comma-separated)"
        name="keywords"
        value={keywords}
        onChange={onChange}
        margin="normal"
        helperText="e.g., react, javascript, webdev"
      />
      <TextField
        label="Prompt"
        name="prompt"
        value={prompt}
        onChange={onChange}
        margin="normal"
        required
        multiline
        rows={4}
      />
      <TextField
        label="Output / Document"
        name="output_text"
        value={output_text}
        onChange={onChange}
        margin="normal"
        multiline
        rows={10}
      />
      <Button type="submit" variant="contained" sx={{ mt: 2, alignSelf: 'flex-start' }}>
        Submit Post
      </Button>
    </Box>
  );
};

export default CreatePostPage;