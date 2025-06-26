const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Puerto dinámico para Railway o 3000 en local
const port = process.env.PORT || 3000;

// Configuración CORS - permitir solo frontend en Railway y localhost
const allowedOrigins = [
  'https://torneo-padel-production.up.railway.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (ej: postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error(`CORS no permitido para el origin: ${origin}`), false);
    }
    return callback(null, true);
  }
}));

// Middleware para parsear JSON
app.use(bodyParser.json());

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

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

// Levantar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
