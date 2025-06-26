const express = require('express');
const router = express.Router();
const torneoController = require('../controllers/torneoController');

router.get('/', torneoController.obtenerTorneos);
router.post('/', torneoController.crearTorneo);

module.exports = router;
