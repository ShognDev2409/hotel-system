const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../config/database');

async function runMigrations() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Create migrations table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        run_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get list of already run migrations
    const [migrations] = await connection.query('SELECT name FROM migrations');
    const completedMigrations = new Set(migrations.map(m => m.name));
    
    // Read migration files
    const migrationDir = path.join(__dirname, '../../migrations');
    const files = (await fs.readdir(migrationDir))
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Run new migrations
    for (const file of files) {
      if (!completedMigrations.has(file)) {
        console.log(`Running migration: ${file}`);
        const sql = await fs.readFile(path.join(migrationDir, file), 'utf8');
        await connection.query(sql);
        await connection.query('INSERT INTO migrations (name) VALUES (?)', [file]);
        console.log(`Completed migration: ${file}`);
      }
    }
    
    await connection.commit();
    console.log('All migrations completed successfully');
  } catch (error) {
    await connection.rollback();
    console.error('Migration failed:', error);
    throw error;
  } finally {
    connection.release();
    // Close the pool after migrations are done
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = runMigrations;
