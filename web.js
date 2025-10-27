const express = require('express');
const path = require('path');
const session = require('express-session');
const axios = require('axios');
const app = express();
const PORT = 4000;
const API_URL = 'http://localhost:3000';

// Configuração do Axios com timeout e retry
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000, // 5 segundos
  headers: {'Content-Type': 'application/json'}
});

// Interceptor para retry em caso de erro
axiosInstance.interceptors.response.use(null, async (error) => {
  if (error.config && error.config.__retryCount < 3) {
    error.config.__retryCount = error.config.__retryCount || 0;
    error.config.__retryCount += 1;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo
    return axiosInstance(error.config);
  }
  return Promise.reject(error);
});

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
    // Verifica se o usuário está autenticado
    if (!req.session.user) {
      req.session.formError = 'Por favor, faça login para continuar.';
      return res.redirect('/');
    }
    // Verifica se o usuário tem a role necessária
    if (role && req.session.user.role !== role) {
      req.session.formError = 'Você não tem permissão para acessar esta página.';
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
    const alimentosRes = await axios.get(`${API_URL}/alimentos`);
    const formError = req.session.formError || null;
    const formSuccess = req.session.formSuccess || null;
    delete req.session.formError;
    delete req.session.formSuccess;
    res.render('dashboard-dono.html', {
      user: req.session.user,
      alimentos: alimentosRes.data,
      progresso: null,
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

// Rota para remover alimento
app.post('/alimentos/:id/delete', requireAuth('dono'), async (req, res) => {
  try {
    await axios.delete(`${API_URL}/alimentos/${req.params.id}`);
    req.session.formSuccess = 'Alimento removido com sucesso.';
    res.redirect('/dashboard-dono');
  } catch (err) {
    let msg = 'Erro ao remover alimento.';
    if (err.response && err.response.data && err.response.data.message) msg = err.response.data.message;
    req.session.formError = msg;
    res.redirect('/dashboard-dono');
  }
});

// Nota: endpoint de atualização (PUT /alimentos/:id) foi removido na refatoração.

app.get('/dashboard-comprador', requireAuth('comprador'), async (req, res) => {
  try {
    const alimentosRes = await axios.get(`${API_URL}/alimentos`);
    res.render('dashboard-comprador.html', {
      user: req.session.user,
      alimentos: alimentosRes.data,
      progresso: null,
      error: null
    });
  } catch (err) {
    let msg = 'Erro ao buscar dados da API.';
    if (err.response && err.response.data && err.response.data.message) msg = err.response.data.message;
    res.render('dashboard-comprador.html', { user: req.session.user, alimentos: [], progresso: null, error: msg });
  }
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  const errorMessage = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Ocorreu um erro interno. Por favor, tente novamente mais tarde.';
  
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.status(500).json({ message: errorMessage });
  } else {
    req.session.formError = errorMessage;
    res.redirect('back');
  }
});

app.listen(PORT, () => console.log(`Web app rodando em http://localhost:${PORT}`));
