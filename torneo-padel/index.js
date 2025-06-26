const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

// Permitir solo desde tu frontend para evitar problemas de CORS
const FRONTEND_URL = 'https://torneo-padel-production.up.railway.app';
app.use(cors({
  origin: FRONTEND_URL
}));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/', (req, res) => {
    res.send('API Torneo Pádel funcionando 🎾');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
