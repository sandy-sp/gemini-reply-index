const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// /api/posts
router.route('/')
    .post(protect, createPost)
    .get(getPosts);

// /api/posts/:id
router.route('/:id')
    .get(getPostById)
    .put(protect, updatePost)    // Add this line
    .delete(protect, deletePost); // Add this line

module.exports = router;