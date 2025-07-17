const pool = require('../config/db');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { format } = require('util');

// Configure Google Cloud Storage
const storage = new Storage();
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

// @desc    Create a new post with a file upload
const createPost = async (req, res) => {
    const { topic_title, focus_area, prompt, keywords, notes } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a document file.' });
    }

    const blob = bucket.file(Date.now() + path.extname(req.file.originalname));
    const blobStream = blob.createWriteStream({
        resumable: false,
    });

    blobStream.on('error', (err) => {
        res.status(500).json({ message: err.message });
    });

    blobStream.on('finish', async () => {
        const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
        try {
            const keywordsForDb = `{${keywords}}`;

            const newPostQuery = `
                INSERT INTO posts (user_id, topic_title, focus_area, prompt, keywords, notes, file_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *;
            `;
            const values = [req.user.user_id, topic_title, focus_area, prompt, keywordsForDb, notes, publicUrl];
            const newPost = await pool.query(newPostQuery, values);
            res.status(201).json(newPost.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error while saving post to database.' });
        }
    });

    blobStream.end(req.file.buffer);
};

// @desc    Get all posts
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
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { topic_title, focus_area, prompt, keywords, notes } = req.body;

        const postResult = await pool.query('SELECT user_id FROM posts WHERE post_id = $1', [id]);
        if (postResult.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const post = postResult.rows[0];
        if (post.user_id !== req.user.user_id) {
            return res.status(403).json({ message: 'User not authorized to update this post.' });
        }
        
        const keywordsForDb = `{${keywords}}`;
        const updateQuery = `
            UPDATE posts 
            SET 
                topic_title = $1, 
                focus_area = $2,
                prompt = $3,
                keywords = $4,
                notes = $5,
                updated_at = CURRENT_TIMESTAMP 
            WHERE post_id = $6 
            RETURNING *`;
        const values = [topic_title, focus_area, prompt, keywordsForDb, notes, id];
        const updatedPost = await pool.query(updateQuery, values);
        res.status(200).json(updatedPost.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating post.' });
    }
};

// @desc    Delete a post
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

// @desc    Get logged in user's posts
// @route   GET /api/posts/myposts
// @access  Private
const getMyPosts = async (req, res) => {
    try {
        // req.user.user_id is available thanks to our 'protect' middleware
        const userPostsQuery = 'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC';
        const userPosts = await pool.query(userPostsQuery, [req.user.user_id]);
        res.status(200).json(userPosts.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while getting user posts.' });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    getMyPosts
};