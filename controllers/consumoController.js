// controllers/consumoController.js
const consumoService = require('../service/consumoService');

exports.listar = (req, res) => {
  res.json(consumoService.listar());
};

exports.registrar = (req, res) => {
  try {
    const registro = consumoService.registrar(req.body);
    res.status(201).json(registro);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Erro ao registrar consumo' });
  }
};
