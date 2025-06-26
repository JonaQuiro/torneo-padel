const { getConnection } = require('../db/config');

async function obtenerZonas(req, res) {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT Id, Nombre FROM ZONA
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener zonas:', err);
        res.status(500).send('Error del servidor');
    }
}

module.exports = { obtenerZonas };
