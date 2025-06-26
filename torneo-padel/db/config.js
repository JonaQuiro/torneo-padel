const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASS || '7dl$1F1+',
    server: process.env.DB_HOST || 'unionsun.no-ip.biz',
    database: process.env.DB_NAME || 'DESARROLLO',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function getConnection() {
    try {
        const pool = await sql.connect(dbConfig);
        return pool;
    } catch (err) {
        console.error('Error al conectar a la BD:', err);
        throw err;
    }
}

module.exports = { getConnection, sql };
