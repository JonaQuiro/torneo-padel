const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// 🔁 Puerto dinámico para Railway o 3000 en local
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 🧾 Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
const jugadorRoutes = require('./routes/jugadorRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const parejaRoutes = require('./routes/parejaRoutes');
const partidoRoutes = require('./routes/partidoRoutes');
const torneoRoutes = require('./routes/torneoRoutes');
const zonaRoutes = require('./routes/zonaRoutes');

app.use('/jugadores', jugadorRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/parejas', parejaRoutes);
app.use('/partidos', partidoRoutes);
app.use('/torneos', torneoRoutes);
app.use('/zonas', zonaRoutes);

// Ruta raíz (opcional)
app.get('/', (req, res) => {
    res.send('API Torneo Pádel funcionando 🎾');
});

// Levantar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
