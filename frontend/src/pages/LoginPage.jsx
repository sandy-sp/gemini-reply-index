import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/posts');
    } catch (error) {
      // In a real app, you would set an error state here to show the user
      console.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '500px',
        mx: 'auto',
        p: 2,
        border: '1px solid grey',
        borderRadius: '10px',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={onChange}
        margin="normal"
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={onChange}
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );
};

export default LoginPage;