const { getConnection } = require('../db/config');

async function obtenerCategorias(req, res) {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM CATEGORIA');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener categorías:', err);
        res.status(500).send('Error al obtener categorías');
    }
}

module.exports = { obtenerCategorias };
