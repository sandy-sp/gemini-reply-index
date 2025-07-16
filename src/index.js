const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const cors = require('cors');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// A simple route to test that the server is working
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Gemini Reply Index API!' });
});

// Use the user routes
// All routes in userRoutes will be prefixed with /api/users
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});