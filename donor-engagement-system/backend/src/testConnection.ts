import pool from './config/database';

async function testConnection() {
    console.log('Starting connection test...');
    try {
        console.log('Attempting to get connection...');
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database!');
        
        console.log('Attempting query...');
        const [result] = await connection.query('SELECT 1');
        console.log('Query result:', result);
        
        connection.release();
        console.log('Connection released');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    } finally {
        console.log('Closing pool...');
        await pool.end();
        console.log('Pool closed');
    }
}

console.log('Script started');
testConnection()
    .then(() => console.log('Test completed'))
    .catch((error) => console.error('Test failed:', error)); 