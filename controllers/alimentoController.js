// controllers/alimentoController.js
const alimentoService = require('../service/alimentoService');

exports.listar = (req, res) => {
  try {
    const alimentos = alimentoService.listar();
    res.json(alimentos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar alimentos' });
  }
};

exports.adicionar = (req, res) => {
  try {
    const { nome, quantidade, unidade } = req.body;
    const alimento = { 
      id: String(Date.now()), 
      nome, 
      quantidade, 
      unidade 
    };
    const novoAlimento = alimentoService.adicionar(alimento);
    res.status(201).json(novoAlimento);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Erro ao adicionar alimento' });
  }
};

exports.atualizar = (req, res) => {
  const { id } = req.params;
  const alimento = alimentoService.atualizar(id, req.body);
  if (!alimento) return res.status(404).json({ message: 'Alimento não encontrado' });
  res.json(alimento);
};

exports.remover = (req, res) => {
  const { id } = req.params;
  const alimento = alimentoService.getById(id);
  if (!alimento) return res.status(404).json({ message: 'Alimento não encontrado' });
  alimentoService.remover(id);
  res.status(204).send();
};
