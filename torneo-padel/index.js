const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión a SQL Server
const dbConfig = {
  user: process.env.DB_USER || 'TU_USUARIO',
  password: process.env.DB_PASS || 'TU_PASSWORD',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'TU_BASE',
  options: {
    encrypt: false, // Cambia a true si usás Azure u otra configuración
    trustServerCertificate: true // Para desarrollo local, en producción evaluar
  }
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para mostrar el formulario de resultados
app.get('/resultados', async (req, res) => {
  try {
    const partidos = await obtenerPartidos();
    res.render('resultados', { partidos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener partidos');
  }
});

// Ruta para guardar resultados
app.post('/guardar-resultados', async (req, res) => {
  try {
    const { partidoId, set1p1, set1p2, set2p1, set2p2, set3p1, set3p2 } = req.body;

    await actualizarResultados(partidoId, {
      set1p1: Number(set1p1),
      set1p2: Number(set1p2),
      set2p1: Number(set2p1),
      set2p2: Number(set2p2),
      set3p1: Number(set3p1),
      set3p2: Number(set3p2)
    });

    res.send('Resultados guardados correctamente. <a href="/resultados">Volver</a>');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al guardar resultados');
  }
});

// Inicio servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// --- FUNCIONES DE BASE DE DATOS ---

async function obtenerPartidos() {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request()
      .query(`SELECT Id, Zona,
                     Pareja1Jugador1, Pareja1Jugador2,
                     Pareja2Jugador1, Pareja2Jugador2
              FROM Partidos`); // Cambiar por tu tabla y columnas reales

    return result.recordset;
  } catch (err) {
    console.error('Error al obtener partidos:', err);
    throw err;
  }
}

async function actualizarResultados(partidoId, resultados) {
  try {
    let pool = await sql.connect(dbConfig);
    await pool.request()
      .input('Id', sql.Int, partidoId)
      .input('Set1P1', sql.Int, resultados.set1p1)
      .input('Set1P2', sql.Int, resultados.set1p2)
      .input('Set2P1', sql.Int, resultados.set2p1)
      .input('Set2P2', sql.Int, resultados.set2p2)
      .input('Set3P1', sql.Int, resultados.set3p1)
      .input('Set3P2', sql.Int, resultados.set3p2)
      .query(`UPDATE Partidos SET
               Set1P1 = @Set1P1,
               Set1P2 = @Set1P2,
               Set2P1 = @Set2P1,
               Set2P2 = @Set2P2,
               Set3P1 = @Set3P1,
               Set3P2 = @Set3P2
              WHERE Id = @Id`);

  } catch (err) {
    console.error('Error al actualizar resultados:', err);
    throw err;
  }
}
