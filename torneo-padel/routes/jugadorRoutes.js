const express = require('express');
const router = express.Router();
const jugadorController = require('../controllers/jugadorController');

router.get('/', jugadorController.obtenerJugadores);
router.post('/', jugadorController.crearJugador);

module.exports = router;