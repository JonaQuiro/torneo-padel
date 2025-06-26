const express = require('express');
const router = express.Router();
const partidoController = require('../controllers/partidoController');

router.get('/', partidoController.obtenerPartidos);
router.post('/', partidoController.crearPartido);

module.exports = router;
