const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createPost, getPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
});

// /api/posts
router.route('/')
  .post(protect, upload.single('output_file'), createPost) // Use multer middleware here
  .get(getPosts);

// /api/posts/:id
router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;