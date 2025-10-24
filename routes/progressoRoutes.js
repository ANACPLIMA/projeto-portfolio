// routes/progressoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/progressoController');

router.get('/', controller.consultar);

module.exports = router;
