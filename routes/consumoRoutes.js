// routes/consumoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/consumoController');

router.get('/', controller.listar);
router.post('/', controller.registrar);

module.exports = router;
