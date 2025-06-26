const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../db/config');

// Obtener todos los partidos con nombres
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        p.Id,
        z.Nombre AS Zona,
        j1.Nombre AS Pareja1Jugador1,
        j2.Nombre AS Pareja1Jugador2,
        j3.Nombre AS Pareja2Jugador1,
        j4.Nombre AS Pareja2Jugador2
      FROM PARTIDO p
      INNER JOIN PAREJA pa1 ON pa1.Id = p.IdPareja1
      INNER JOIN PAREJA pa2 ON pa2.Id = p.IdPareja2
      INNER JOIN JUGADOR j1 ON j1.Id = pa1.IdJugador1
      INNER JOIN JUGADOR j2 ON j2.Id = pa1.IdJugador2
      INNER JOIN JUGADOR j3 ON j3.Id = pa2.IdJugador1
      INNER JOIN JUGADOR j4 ON j4.Id = pa2.IdJugador2
      LEFT JOIN ZONA z ON z.Id = p.IdZona
    `);

    res.render('resultados', { partidos: result.recordset });
  } catch (error) {
    console.error('❌ Error al obtener partidos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Guardar resultados del partido
router.post('/:id', async (req, res) => {
  const partidoId = req.params.id;
  const {
    set1p1, set1p2,
    set2p1, set2p2,
    set3p1, set3p2
  } = req.body;

  try {
    const pool = await getConnection();
    await pool.request()
      .input('Id', sql.Int, partidoId)
      .input('Set1P1', sql.Int, set1p1)
      .input('Set1P2', sql.Int, set1p2)
      .input('Set2P1', sql.Int, set2p1)
      .input('Set2P2', sql.Int, set2p2)
      .input('Set3P1', sql.Int, set3p1)
      .input('Set3P2', sql.Int, set3p2)
      .query(`
        UPDATE PARTIDO SET 
          Set1P1 = @Set1P1,
          Set1P2 = @Set1P2,
          Set2P1 = @Set2P1,
          Set2P2 = @Set2P2,
          Set3P1 = @Set3P1,
          Set3P2 = @Set3P2
        WHERE Id = @Id
      `);

    res.json({ message: '✅ Resultados guardados correctamente' });
  } catch (error) {
    console.error('❌ Error al guardar resultados:', error);
    res.status(500).json({ message: 'Error al guardar resultados' });
  }
});

module.exports = router;
