const { getConnection } = require('../db/config');

async function crearPareja(req, res) {
    const { idJugador1, idJugador2 } = req.body;

    if (!idJugador1 || !idJugador2) {
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }
    if (idJugador1 === idJugador2) {
        return res.status(400).json({ mensaje: 'Los jugadores deben ser diferentes' });
    }

    try {
        const pool = await getConnection();
        await pool.request()
            .input('IdJugador1', idJugador1)
            .input('IdJugador2', idJugador2)
            .query(`
                INSERT INTO PAREJA (IdJugador1, IdJugador2, IdTorneo)
                VALUES (@IdJugador1, @IdJugador2, 1)
            `);

        res.status(201).json({ mensaje: 'Pareja creada correctamente' });
    } catch (err) {
        console.error('Error al crear pareja:', err);
        res.status(500).send('Error del servidor');
    }
}

async function obtenerParejas(req, res) {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT p.Id, j1.Nombre AS Jugador1, j2.Nombre AS Jugador2
            FROM PAREJA p
            INNER JOIN JUGADOR j1 ON p.IdJugador1 = j1.Id
            INNER JOIN JUGADOR j2 ON p.IdJugador2 = j2.Id
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener parejas:', err);
        res.status(500).send('Error del servidor');
    }
}

module.exports = { crearPareja, obtenerParejas };
