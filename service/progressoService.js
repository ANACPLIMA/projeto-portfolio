// service/progressoService.js
const Progresso = require('../model/progresso');

module.exports = {
  consultar: () => Progresso.get()
};
