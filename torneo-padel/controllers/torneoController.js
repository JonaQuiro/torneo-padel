const { getConnection } = require('../db/config');

async function obtenerTorneos(req, res) {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT t.Id, c.Descripcion AS Categoria, t.Fecha
            FROM TORNEO t
            INNER JOIN CATEGORIA c ON t.IdCategoria = c.Id
            ORDER BY t.Fecha DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener torneos:', err);
        res.status(500).send('Error del servidor');
    }
}

async function crearTorneo(req, res) {
    const { idCategoria, fecha } = req.body;

    if (!idCategoria || !fecha) {
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    try {
        const pool = await getConnection();
        await pool.request()
            .input('IdCategoria', idCategoria)
            .input('Fecha', fecha)
            .query(`
                INSERT INTO TORNEO (IdCategoria, Fecha)
                VALUES (@IdCategoria, @Fecha)
            `);
        res.status(201).json({ mensaje: 'Torneo creado correctamente' });
    } catch (err) {
        console.error('Error al crear torneo:', err);
        res.status(500).send('Error del servidor');
    }
}

module.exports = { obtenerTorneos, crearTorneo };
