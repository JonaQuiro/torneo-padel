const { getConnection } = require('../db/config');

async function obtenerPartidos(req, res) {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT 
                p.Id,
                z.Nombre AS Zona,
                pj1.Nombre AS Pareja1Jugador1,
                pj2.Nombre AS Pareja1Jugador2,
                pj3.Nombre AS Pareja2Jugador1,
                pj4.Nombre AS Pareja2Jugador2,
                p.Fecha,
                p.Horario,
                p.Set1P1, p.Set1P2, p.Set2P1, p.Set2P2, p.Set3P1, p.Set3P2
                FROM PARTIDO p
                JOIN PAREJA pa1 ON p.IdPareja1 = pa1.Id
                JOIN PAREJA pa2 ON p.IdPareja2 = pa2.Id
                JOIN JUGADOR pj1 ON pa1.IdJugador1 = pj1.Id
                JOIN JUGADOR pj2 ON pa1.IdJugador2 = pj2.Id
                JOIN JUGADOR pj3 ON pa2.IdJugador1 = pj3.Id
                JOIN JUGADOR pj4 ON pa2.IdJugador2 = pj4.Id
                LEFT JOIN ZONA z ON p.IdZona = z.Id
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener partidos:', err);
        res.status(500).send('Error del servidor');
    }
}

async function crearPartido(req, res) {
  const { idPareja1, idPareja2, fecha, horario, idZona } = req.body;

  if (!idPareja1 || !idPareja2 || !fecha || !horario || !idZona) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  if (idPareja1 === idPareja2) {
    return res.status(400).json({ mensaje: 'Las parejas deben ser diferentes' });
  }

  try {
    const pool = await getConnection();
    await pool.request()
      .input('IdPareja1', idPareja1)
      .input('IdPareja2', idPareja2)
      .input('Fecha', fecha)
      .input('Horario', horario)
      .input('IdZona', idZona)
      .query(`
        INSERT INTO PARTIDO (IdPareja1, IdPareja2, Fecha, Horario, IdZona)
        VALUES (@IdPareja1, @IdPareja2, @Fecha, @Horario, @IdZona)
      `);
    res.status(201).json({ mensaje: 'Partido creado correctamente' });
  } catch (error) {
    console.error('Error al crear partido:', error);
    res.status(500).send('Error del servidor');
  }
}


module.exports = { obtenerPartidos, crearPartido };
