const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../db/config');

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

        p.Set1P1, p.Set1P2,
        p.Set2P1, p.Set2P2,
        p.Set3P1, p.Set3P2,
        p.Fecha, p.Horario

      FROM PARTIDO p
      JOIN PAREJA pa1 ON p.IdPareja1 = pa1.Id
      JOIN JUGADOR j1 ON pa1.IdJugador1 = j1.Id
      JOIN JUGADOR j2 ON pa1.IdJugador2 = j2.Id

      JOIN PAREJA pa2 ON p.IdPareja2 = pa2.Id
      JOIN JUGADOR j3 ON pa2.IdJugador1 = j3.Id
      JOIN JUGADOR j4 ON pa2.IdJugador2 = j4.Id

      LEFT JOIN ZONA z ON p.IdZona = z.Id
    `);

    const partidos = result.recordset;

    res.render('resultados', { partidos });

  } catch (error) {
    console.error('❌ Error al obtener los partidos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

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
        UPDATE PARTIDO
        SET 
          Set1P1 = @Set1P1,
          Set1P2 = @Set1P2,
          Set2P1 = @Set2P1,
          Set2P2 = @Set2P2,
          Set3P1 = @Set3P1,
          Set3P2 = @Set3P2
        WHERE Id = @Id
      `);

    res.status(200).json({ message: '✅ Resultados guardados' });

  } catch (error) {
    console.error('❌ Error al guardar resultados:', error);
    res.status(500).json({ message: 'Error al guardar resultados' });
  }
});

module.exports = router;
