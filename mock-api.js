
// mock-api.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Rota raiz para evitar erro Cannot GET /
app.get('/', (req, res) => {
  res.send('Mock API para Estoque de Alimentos está rodando. Consulte os endpoints documentados no swagger.yaml.');
});

app.use(cors());
app.use(bodyParser.json());

let alimentos = [
  { id: '1', nome: 'Arroz', quantidade: 5, unidade: 'kg' },
  { id: '2', nome: 'Feijão', quantidade: 2, unidade: 'kg' }
];
let consumo = [];
let progresso = { total: 7, consumido: 0 };

// Auth
app.post('/auth/login', (req, res) => {
  const { username, password, role } = req.body;
  if ((username === 'dono' && password === 'dono123' && role === 'dono') ||
      (username === 'comprador' && password === 'comprador123' && role === 'comprador')) {
    return res.status(200).json({ message: 'Login realizado com sucesso' });
  }
  res.status(401).json({ message: 'Credenciais inválidas' });
});
app.post('/auth/logout', (req, res) => res.status(200).json({ message: 'Logout realizado' }));

// Alimentos
app.get('/alimentos', (req, res) => res.json(alimentos));
app.post('/alimentos', (req, res) => {
  const novo = { ...req.body, id: String(Date.now()) };
  alimentos.push(novo);
  progresso.total += novo.quantidade;
  res.status(201).json(novo);
});
app.put('/alimentos/:id', (req, res) => {
  const idx = alimentos.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Alimento não encontrado' });
  alimentos[idx] = { ...alimentos[idx], ...req.body };
  res.json(alimentos[idx]);
});
app.delete('/alimentos/:id', (req, res) => {
  const idx = alimentos.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Alimento não encontrado' });
  progresso.total -= alimentos[idx].quantidade;
  alimentos.splice(idx, 1);
  res.status(204).send();
});

// Consumo
app.get('/consumo', (req, res) => res.json(consumo));
app.post('/consumo', (req, res) => {
  const { alimentoId, quantidade, data } = req.body;
  const alimento = alimentos.find(a => a.id === alimentoId);
  if (!alimento) return res.status(404).json({ message: 'Alimento não encontrado' });
  if (alimento.quantidade < quantidade) return res.status(400).json({ message: 'Quantidade insuficiente' });
  alimento.quantidade -= quantidade;
  progresso.consumido += quantidade;
  consumo.push({ alimentoId, quantidade, data });
  res.status(201).json({ alimentoId, quantidade, data });
});

// Progresso
app.get('/progresso', (req, res) => res.json(progresso));

app.listen(PORT, () => console.log(`Mock API rodando em http://localhost:${PORT}`));
