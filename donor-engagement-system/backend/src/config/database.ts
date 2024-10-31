import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();
// Connection pool configuration
const poolConfig: PoolOptions = {
    // Basic configuration
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'donor_engagement',

    // Pool specific configuration
    connectionLimit: 10,      // Maximum number of connections in the pool
    queueLimit: 0,           // Maximum number of connection requests the pool will queue
    waitForConnections: true, // Wait for available connection when limit is reached

    // Additional options
    enableKeepAlive: true,   // Keep connections alive
    keepAliveInitialDelay: 10000, // How often to send keepalive packets
    timezone: '-07:00',      // GMT-7 timezone

    // Debug (disable in production)
    debug: process.env.NODE_ENV !== 'production',
}

// Create the pool
const pool: Pool = mysql.createPool(poolConfig);

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(error => {
        console.error('Database connection failed:', error);
    });
// Helper function to get a connection with error handling
export async function getConnection() {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error('Error getting connection from pool:', error);
        throw error;
    }
}

export default pool;
