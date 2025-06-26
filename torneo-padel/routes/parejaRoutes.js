const express = require('express');
const router = express.Router();
const parejaController = require('../controllers/parejaController');

router.get('/', parejaController.obtenerParejas);
router.post('/', parejaController.crearPareja);

module.exports = router;
