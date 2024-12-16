import * as dotenv from 'dotenv';
dotenv.config();

import mysql, { Pool, PoolOptions } from 'mysql2/promise';

// Connection pool configuration
const poolConfig: PoolOptions = {
    // Basic configuration
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    // Pool specific configuration
    connectionLimit: 20,      // Maximum number of connections in the pool
    queueLimit: 100,           // Maximum number of connection requests the pool will queue
    waitForConnections: true, // Wait for available connection when limit is reached

    // Additional options
    enableKeepAlive: true,   // Keep connections alive
    keepAliveInitialDelay: 10000, // How often to send keepalive packets
    // Debug (disable in production)
    debug: false,

    // Additional recommended settings
    connectTimeout: 10000,     // 10 seconds
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
