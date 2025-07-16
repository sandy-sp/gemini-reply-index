const pool = require('../config/db');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    const { topic_title, focus_area, prompt, output_text, keywords, notes } = req.body;
    if (!topic_title || !prompt) {
        return res.status(400).json({ message: 'Please provide a topic title and a prompt.' });
    }
    try {
        const newPostQuery = `
            INSERT INTO posts (user_id, topic_title, focus_area, prompt, output_text, keywords, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [req.user.user_id, topic_title, focus_area, prompt, output_text, keywords, notes];
        const newPost = await pool.query(newPostQuery, values);
        res.status(201).json(newPost.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating post.' });
    }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
    try {
        const allPostsQuery = 'SELECT * FROM posts ORDER BY created_at DESC';
        const allPosts = await pool.query(allPostsQuery);
        res.status(200).json(allPosts.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while getting posts.' });
    }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const postQuery = 'SELECT * FROM posts WHERE post_id = $1';
        const post = await pool.query(postQuery, [id]);

        if (post.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.status(200).json(post.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while getting post.' });
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        // Get all possible fields from the body for a full update
        const { topic_title, focus_area, prompt, output_text, keywords, notes } = req.body;

        const postResult = await pool.query('SELECT user_id FROM posts WHERE post_id = $1', [id]);

        if (postResult.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const post = postResult.rows[0];

        if (post.user_id !== req.user.user_id) {
            return res.status(403).json({ message: 'User not authorized to update this post.' });
        }

        const updateQuery = `
            UPDATE posts 
            SET 
                topic_title = $1, 
                focus_area = $2,
                prompt = $3,
                output_text = $4,
                keywords = $5,
                notes = $6,
                updated_at = CURRENT_TIMESTAMP 
            WHERE post_id = $7 
            RETURNING *`;

        const values = [topic_title, focus_area, prompt, output_text, keywords, notes, id];
        const updatedPost = await pool.query(updateQuery, values);

        res.status(200).json(updatedPost.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating post.' });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const postResult = await pool.query('SELECT user_id FROM posts WHERE post_id = $1', [id]);

        if (postResult.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const post = postResult.rows[0];

        if (post.user_id !== req.user.user_id) {
            return res.status(403).json({ message: 'User not authorized to delete this post.' });
        }

        await pool.query('DELETE FROM posts WHERE post_id = $1', [id]);
        res.status(200).json({ message: 'Post removed successfully.', post_id: id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting post.' });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
};