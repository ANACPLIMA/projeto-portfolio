// controllers/alimentoController.js
const alimentoService = require('../service/alimentoService');

exports.listar = (req, res) => {
  res.json(alimentoService.listar());
};

exports.adicionar = (req, res) => {
  const { nome, quantidade, unidade } = req.body;
  if (!nome || !quantidade || !unidade) return res.status(400).json({ message: 'Dados obrigatórios ausentes' });
  const alimento = { id: String(Date.now()), nome, quantidade, unidade };
  alimentoService.adicionar(alimento);
  res.status(201).json(alimento);
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
