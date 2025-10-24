// controllers/authController.js
exports.login = (req, res) => {
  const { username, password, role } = req.body;
  if ((username === 'dono' && password === 'dono123' && role === 'dono') ||
      (username === 'comprador' && password === 'comprador123' && role === 'comprador')) {
    return res.status(200).json({ message: 'Login realizado com sucesso' });
  }
  res.status(401).json({ message: 'Credenciais inválidas' });
};

exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logout realizado' });
};
