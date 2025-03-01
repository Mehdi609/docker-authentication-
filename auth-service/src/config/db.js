

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

console.log('DB Config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  // Port à l'extérieur du conteneur
});

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mariadb',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'users_db',
    port: 3306, // Port à l'intérieur du conteneur
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

pool.getConnection()
    .then(conn => {
        console.log('✅ Connexion réussie à la base de données!!');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Erreur de connexion à la base de données:', err);
    });

module.exports = pool;