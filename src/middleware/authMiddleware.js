const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
    let token;

    // Check for the token in the authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (it's in the format "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using our secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the database using the id from the token's payload
            // and attach it to the request object (minus the password)
            const userQuery = 'SELECT user_id, username, email, created_at FROM users WHERE user_id = $1';
            const result = await pool.query(userQuery, [decoded.user.id]);
            req.user = result.rows[0];

            // Move on to the next function (the actual route controller)
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };