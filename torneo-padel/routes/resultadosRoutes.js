const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../db/config');

// Ruta: GET /resultados
router.get('/', async (req, res) => {
  console.log('📥 GET /resultados recibido');
  try {
    const pool = await getConnection();
    console.log('✅ Conexión a BD OK');

    const result = await pool.request().query(`
      SELECT 
        p.Id,
        z.Nombre AS Zona,
        j1.Nombre AS Pareja1Jugador1,
        j2.Nombre AS Pareja1Jugador2,
        j3.Nombre AS Pareja2Jugador1,
        j4.Nombre AS Pareja2Jugador2,
        p.Fecha,
        p.Horario,
        p.Set1P1, p.Set1P2,
        p.Set2P1, p.Set2P2,
        p.Set3P1, p.Set3P2
      FROM Partido p
      JOIN Zonas z ON p.IdZona = z.Id
      JOIN Parejas pa1 ON p.IdPareja1 = pa1.Id
      JOIN Parejas pa2 ON p.IdPareja2 = pa2.Id
      JOIN Jugadores j1 ON pa1.Jugador1 = j1.Id
      JOIN Jugadores j2 ON pa1.Jugador2 = j2.Id
      JOIN Jugadores j3 ON pa2.Jugador1 = j3.Id
      JOIN Jugadores j4 ON pa2.Jugador2 = j4.Id
    `);

    console.log(`✅ Partidos encontrados: ${result.recordset.length}`);
    res.render('resultados', { partidos: result.recordset });

  } catch (error) {
    console.error('❌ Error al obtener los partidos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
