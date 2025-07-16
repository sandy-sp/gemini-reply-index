import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  return response.data;
};

// ++ ADD THIS FUNCTION ++
// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    // Store the user's token in local storage
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const authService = {
  register,
  login, // Add login here
};

export default authService;