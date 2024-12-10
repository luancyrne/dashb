const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

async function getConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
}

module.exports = getConnection;