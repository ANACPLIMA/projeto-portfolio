const express = require('express');
const path = require('path');
const session = require('express-session');
const axios = require('axios');
const app = express();
const PORT = 4000;
const API_URL = 'http://localhost:3000';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(session({
  secret: 'dispensa_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Simple user store (mock)
const users = [
  { username: 'dono', password: 'dono123', role: 'dono' },
  { username: 'comprador', password: 'comprador123', role: 'comprador' }
];

function requireAuth(role) {
  return (req, res, next) => {
    if (!req.session.user || (role && req.session.user.role !== role)) {
      return res.redirect('/');
    }
    next();
  };
}

app.get('/', (req, res) => {
  res.render('index.html', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  const user = users.find(u => u.username === username && u.password === password && u.role === role);
  if (user) {
    req.session.user = { username: user.username, role: user.role };
    if (user.role === 'dono') return res.redirect('/dashboard-dono');
    if (user.role === 'comprador') return res.redirect('/dashboard-comprador');
  } else {
    res.render('index.html', { error: 'Usuário, senha ou tipo inválido.' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

app.get('/dashboard-dono', requireAuth('dono'), async (req, res) => {
  try {
    const [alimentosRes, progressoRes] = await Promise.all([
      axios.get(`${API_URL}/alimentos`),
      axios.get(`${API_URL}/progresso`)
    ]);
    const formError = req.session.formError || null;
    const formSuccess = req.session.formSuccess || null;
    delete req.session.formError;
    delete req.session.formSuccess;
    res.render('dashboard-dono.html', {
      user: req.session.user,
      alimentos: alimentosRes.data,
      progresso: progressoRes.data,
      error: formError,
      success: formSuccess
    });
  } catch (err) {
    let msg = 'Erro ao buscar dados da API.';
    if (err.response && err.response.data && err.response.data.message) msg = err.response.data.message;
    res.render('dashboard-dono.html', { user: req.session.user, alimentos: [], progresso: null, error: msg, success: null });
  }
});

// Rota para adicionar alimento (envia para a API)
app.post('/alimentos', requireAuth('dono'), async (req, res) => {
  try {
    await axios.post(`${API_URL}/alimentos`, req.body);
    req.session.formSuccess = 'Alimento adicionado com sucesso.';
    res.redirect('/dashboard-dono');
  } catch (err) {
    let msg = 'Erro ao adicionar alimento.';
    if (err.response && err.response.data && err.response.data.message) msg = err.response.data.message;
    req.session.formError = msg;
    res.redirect('/dashboard-dono');
  }
});

app.get('/dashboard-comprador', requireAuth('comprador'), async (req, res) => {
  try {
    const [alimentosRes, progressoRes] = await Promise.all([
      axios.get(`${API_URL}/alimentos`),
      axios.get(`${API_URL}/progresso`)
    ]);
    res.render('dashboard-comprador.html', {
      user: req.session.user,
      alimentos: alimentosRes.data,
      progresso: progressoRes.data,
      error: null
    });
  } catch (err) {
    let msg = 'Erro ao buscar dados da API.';
    if (err.response && err.response.data && err.response.data.message) msg = err.response.data.message;
    res.render('dashboard-comprador.html', { user: req.session.user, alimentos: [], progresso: null, error: msg });
  }
});

app.listen(PORT, () => console.log(`Web app rodando em http://localhost:${PORT}`));
