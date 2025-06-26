const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// CORS
const allowedOrigins = [
  'https://torneo-padel-production.up.railway.app',
  'http://localhost:3000'
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS bloqueado para: ${origin}`));
    }
  }
}));

// Motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// JSON body
app.use(bodyParser.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
const jugadorRoutes = require('./routes/jugadorRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const parejaRoutes = require('./routes/parejaRoutes');
const partidoRoutes = require('./routes/partidoRoutes');
const torneoRoutes = require('./routes/torneoRoutes');
const zonaRoutes = require('./routes/zonaRoutes');
const resultadosRoutes = require('./routes/resultadosRoutes');

// Usar rutas
app.use('/jugadores', jugadorRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/parejas', parejaRoutes);
app.use('/partidos', partidoRoutes);
app.use('/torneos', torneoRoutes);
app.use('/zonas', zonaRoutes);
app.use('/resultados', resultadosRoutes);

app.get('/', (req, res) => {
  res.send('API Torneo Pádel funcionando 🎾');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
