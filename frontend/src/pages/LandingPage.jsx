import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h2" gutterBottom>
        Welcome to the Gemini Reply Index
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        A public library of prompts and AI-generated content.
        Share your results, learn from others, and help build a valuable dataset.
      </Typography>
      <Button component={RouterLink} to="/register" variant="contained" size="large" sx={{ mr: 2 }}>
        Get Started
      </Button>
      <Button component={RouterLink} to="/login" variant="outlined" size="large">
        Login
      </Button>
    </Box>
  );
};

export default LandingPage;