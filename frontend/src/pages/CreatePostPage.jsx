import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import AuthContext from '../context/AuthContext';
import postService from '../services/postService';

const CreatePostPage = () => {
  const [textData, setTextData] = useState({
    topic_title: '',
    focus_area: '',
    prompt: '',
    keywords: '',
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const onTextChange = (e) => {
    setTextData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('topic_title', textData.topic_title);
    formData.append('focus_area', textData.focus_area);
    formData.append('prompt', textData.prompt);
    formData.append('keywords', textData.keywords);
    formData.append('output_file', file);

    try {
      await postService.createPost(formData, user.token);
      navigate('/posts');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create a New Post
      </Typography>
      <TextField label="Topic Title" name="topic_title" value={textData.topic_title} onChange={onTextChange} margin="normal" required fullWidth />
      <TextField label="Focus Area" name="focus_area" value={textData.focus_area} onChange={onTextChange} margin="normal" fullWidth />
      <TextField label="Keywords (comma-separated)" name="keywords" value={textData.keywords} onChange={onTextChange} margin="normal" helperText="e.g., react, javascript, webdev" fullWidth />
      <TextField label="Prompt" name="prompt" value={textData.prompt} onChange={onTextChange} margin="normal" required multiline rows={4} fullWidth />
      
      <Button variant="contained" component="label" sx={{ mt: 2, mb: 1 }}>
        Upload Document (PDF or DOCX)
        <input type="file" name="output_file" hidden onChange={onFileChange} accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
      </Button>
      {file && <Typography variant="body2">{file.name}</Typography>}
      
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, alignSelf: 'flex-start' }}>
        Submit Post
      </Button>
    </Box>
  );
};

export default CreatePostPage;