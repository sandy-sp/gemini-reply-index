const pool = require('./src/config/db');

const createTables = async () => {
    const usersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const postsTableQuery = `
        CREATE TABLE IF NOT EXISTS posts (
            post_id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            topic_title VARCHAR(255) NOT NULL,
            focus_area VARCHAR(255),
            prompt TEXT NOT NULL,
            output_text TEXT,
            keywords TEXT[],
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(usersTableQuery);
        console.log('"users" table ready.');
        await pool.query(postsTableQuery);
        console.log('"posts" table ready.');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        pool.end();
    }
};

createTables();