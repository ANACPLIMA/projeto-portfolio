// service/alimentoService.js
const Alimento = require('../model/alimento');
const Progresso = require('../model/progresso');

module.exports = {
  listar: () => Alimento.getAll(),
  adicionar: (alimento) => {
    Alimento.add(alimento);
    Progresso.addTotal(alimento.quantidade);
    return alimento;
  },
  atualizar: (id, data) => Alimento.update(id, data),
  remover: (id) => {
    const alimento = Alimento.getById(id);
    if (alimento) Progresso.removeTotal(alimento.quantidade);
    Alimento.remove(id);
  },
  getById: (id) => Alimento.getById(id)
};
