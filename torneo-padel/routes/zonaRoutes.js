const express = require('express');
const router = express.Router();
const { obtenerZonas } = require('../controllers/zonaController');

router.get('/', obtenerZonas);

module.exports = router;
