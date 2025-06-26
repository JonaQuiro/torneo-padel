const { getConnection } = require('../db/config');

async function obtenerJugadores(req, res) {
    console.log("GET /jugadores llamado"); // 👈 AÑADILO
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM JUGADOR');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener jugadores:', err);
        res.status(500).send('Error del servidor');
    }
}


async function crearJugador(req, res) {
    const { nombre, idCategoria } = req.body;

    if (!nombre || !idCategoria) {
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    try {
        const pool = await getConnection();
        await pool.request()
            .input('Nombre', nombre)
            .input('IdCategoria', idCategoria)
            .query(`
                INSERT INTO JUGADOR (Nombre, IdCategoria)
                VALUES (@Nombre, @IdCategoria)
            `);

        res.status(201).json({ mensaje: 'Jugador creado correctamente' });
    } catch (err) {
        console.error('Error al crear jugador:', err);
        res.status(500).send('Error del servidor');
    }
}

module.exports = {
    obtenerJugadores,
    crearJugador
};
