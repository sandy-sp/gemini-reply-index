import axios from 'axios';

const API_URL = 'http://localhost:3000/api/posts/';

// Get all posts
const getPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create a new post (now sends FormData)
const createPost = async (formData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data', // This is important for file uploads
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, formData, config);
  return response.data;
};

// ++ ADD THIS FUNCTION ++
// Update a user's post
const updatePost = async (postId, postData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + postId, postData, config);
  return response.data;
};

// ++ ADD THIS FUNCTION ++
// Get a single post by its ID
const getPostById = async (postId) => {
    const response = await axios.get(API_URL + postId);
    return response.data;
};

// ++ ADD THIS FUNCTION ++
// Delete a user's post
const deletePost = async (postId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + postId, config);
  return response.data;
};

// ++ ADD THIS FUNCTION ++
// Get posts for logged in user
const getMyPosts = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'myposts', config);
  return response.data;
};

const postService = {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts 
};

export default postService;