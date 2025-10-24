// controllers/progressoController.js
const progressoService = require('../service/progressoService');

exports.consultar = (req, res) => {
  res.json(progressoService.consultar());
};
