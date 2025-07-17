import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import AuthContext from '../context/AuthContext';
import postService from '../services/postService';

const EditPostPage = () => {
  const [formData, setFormData] = useState({
    topic_title: '',
    focus_area: '',
    prompt: '',
    keywords: '',
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getPostById(id);
        // Pre-populate the form with the fetched data
        setFormData({
          topic_title: data.topic_title,
          focus_area: data.focus_area || '',
          prompt: data.prompt,
          keywords: data.keywords?.join(', ') || '',
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchPost();
  }, [id]);

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
        keywords: formData.keywords.split(',').map(keyword => keyword.trim()),
      };
      await postService.updatePost(id, postData, user.token);
      navigate(`/posts/${id}`); // Redirect to the detail page on success
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Post
      </Typography>
      <TextField label="Topic Title" name="topic_title" value={formData.topic_title} onChange={onChange} margin="normal" required fullWidth />
      <TextField label="Focus Area" name="focus_area" value={formData.focus_area} onChange={onChange} margin="normal" fullWidth />
      <TextField label="Keywords (comma-separated)" name="keywords" value={formData.keywords} onChange={onChange} margin="normal" fullWidth />
      <TextField label="Prompt" name="prompt" value={formData.prompt} onChange={onChange} margin="normal" required multiline rows={4} fullWidth />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Update Post
      </Button>
    </Box>
  );
};

export default EditPostPage;