const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ... (The registerUser function is still here, no changes to it)
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const newUserQuery = `
            INSERT INTO users (username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING user_id, username, email, created_at;
        `;
        const newUser = await pool.query(newUserQuery, [username, email, password_hash]);
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ++ NEW FUNCTION ++
// Controller function for user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide an email and password.' });
    }

    try {
        const userQuery = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(userQuery, [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const payload = {
            user: {
                id: user.user_id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                // Corrected line sends both token and user ID
                res.json({ token, id: user.user_id });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Add this to your userController.js file, then add 'getMe' to module.exports

const getMe = async (req, res) => {
    // The user data is already attached to req by the protect middleware
    res.status(200).json(req.user);
};

// Make sure your module.exports at the bottom of the file looks like this:
module.exports = {
    registerUser,
    loginUser,
    getMe, // Add getMe here
};