const express = require('express');
const router = express.Router();
const multer = require('multer');
// VVV The fix is on this line VVV
const { createPost, getPosts, getPostById, updatePost, deletePost, getMyPosts, likePost } = require('../controllers/postController');
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
  .post(protect, upload.single('output_file'), createPost)
  .get(getPosts);

// This must come BEFORE the '/:id' route
router.get('/myposts', protect, getMyPosts);

// /api/posts/:id
router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// This is the new route for liking a post
router.route('/:id/like').post(protect, likePost);

module.exports = router;