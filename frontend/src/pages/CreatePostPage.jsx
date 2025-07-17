import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Input } from '@mui/material';
import AuthContext from '../context/AuthContext';
import postService from '../services/postService';

const CreatePostPage = () => {
  const [textData, setTextData] = useState({
    topic_title: '',
    focus_area: '',
    prompt: '',
    keywords: '',
  });
  const [file, setFile] = useState(null); // State for the file itself
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const onTextChange = (e) => {
    setTextData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]); // Get the first file selected
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    // Use FormData to send both text and file data
    const formData = new FormData();
    formData.append('topic_title', textData.topic_title);
    formData.append('focus_area', textData.focus_area);
    formData.append('prompt', textData.prompt);
    formData.append('keywords', textData.keywords.split(',').map(k => k.trim()));
    formData.append('output_file', file); // Append the file

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
      <TextField label="Keywords (comma-separated)" name="keywords" value={textData.keywords} onChange={onTextChange} margin="normal" fullWidth />
      <TextField label="Prompt" name="prompt" value={textData.prompt} onChange={onTextChange} margin="normal" required multiline rows={4} fullWidth />
      
      <Button variant="contained" component="label" sx={{ mt: 2, mb: 1 }}>
        Upload Document (PDF or DOCX)
        <input type="file" name="output_file" hidden onChange={onFileChange} accept=".pdf,.doc,.docx" />
      </Button>
      {file && <Typography variant="body2">{file.name}</Typography>}
      
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        Submit Post
      </Button>
    </Box>
  );
};

export default CreatePostPage;