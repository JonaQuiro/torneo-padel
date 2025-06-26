const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getConnection, sql } = require('./db/config');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configurar motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Importar rutas
const jugadorRoutes = require('./routes/jugadorRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const parejaRoutes = require('./routes/parejaRoutes');
const partidoRoutes = require('./routes/partidoRoutes');
const torneoRoutes = require('./routes/torneoRoutes');
const zonaRoutes = require('./routes/zonaRoutes');

// Usar rutas
app.use('/jugadores', jugadorRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/parejas', parejaRoutes);
app.use('/partidos', partidoRoutes);
app.use('/torneos', torneoRoutes);
app.use('/zonas', zonaRoutes);

// Ruta raíz opcional
app.get('/', (req, res) => {
  res.send('API Torneo Pádel funcionando 🎾');
});

// Ruta para renderizar la vista resultados.ejs con partidos
app.get('/resultados', async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .query(`
        SELECT Zona, 
               Pareja1Jugador1, Pareja1Jugador2, 
               Pareja2Jugador1, Pareja2Jugador2, 
               Fecha, Horario
        FROM partidos
        ORDER BY Zona, Fecha, Horario
      `);

    const partidos = result.recordset;

    res.render('resultados', { partidos });
  } catch (error) {
    console.error('Error consultando partidos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
