const sql = require('mssql');

const dbConfig = {
    user: 'sa',
    password: '7dl$1F1+',
    server: '192.168.1.237',
    database: 'DESARROLLO',
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
