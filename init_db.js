const pool = require('./src/config/db');

const migrateDatabase = async () => {
    const client = await pool.connect();
    try {
        console.log('Starting database migration...');

        // Drop the old output_text column if it exists
        await client.query('ALTER TABLE posts DROP COLUMN IF EXISTS output_text;');
        console.log('Column "output_text" dropped or did not exist.');

        // Add the new file_url column if it doesn't exist
        await client.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS file_url VARCHAR(2048);');
        console.log('Column "file_url" added or already exists.');

        console.log('Database migration completed successfully.');

                // ++ ADD THIS NEW TABLE QUERY ++
        const likesTableQuery = `
            CREATE TABLE IF NOT EXISTS likes (
                like_id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                post_id INTEGER NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, post_id)
            );
        `;
        await client.query(likesTableQuery);
        console.log('Table "likes" is ready.');

        console.log('Database migration completed successfully.');

    } catch (error) {
        console.error('Error during database migration:', error);
    } finally {
        // Release the client back to the pool
        client.release();
        // End the pool completely
        pool.end();
    }
};

migrateDatabase();