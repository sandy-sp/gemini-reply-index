import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import authService from '../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      // On success, go to the login page
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.response.data.message);
      // Here you could set an error message state to display to the user
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
        Register
      </Typography>
      <TextField
        label="Username"
        name="username"
        value={username}
        onChange={onChange}
        margin="normal"
        required
      />
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
        Register
      </Button>
    </Box>
  );
};

export default RegisterPage;