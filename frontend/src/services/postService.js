import axios from 'axios';

const API_URL = 'http://localhost:3000/api/posts/';

// Get all posts
const getPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ++ ADD THIS FUNCTION ++
// Create a new post
const createPost = async (postData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, postData, config);
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


const postService = {
  getPosts,
  createPost,
  getPostById,
  deletePost, // ++ ADD TO EXPORTS ++
};

export default postService;