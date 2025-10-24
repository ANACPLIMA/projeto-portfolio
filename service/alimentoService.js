// service/alimentoService.js
const Alimento = require('../model/alimento');
const Progresso = require('../model/progresso');

module.exports = {
  listar: () => Alimento.getAll(),
  adicionar: (alimento) => {
    // Validação dos dados
    if (!alimento.nome || typeof alimento.nome !== 'string' || alimento.nome.trim().length === 0) {
      throw { status: 400, message: 'Nome do alimento é obrigatório' };
    }
    if (!alimento.quantidade || isNaN(alimento.quantidade) || alimento.quantidade <= 0) {
      throw { status: 400, message: 'Quantidade deve ser um número positivo' };
    }
    if (!alimento.unidade || typeof alimento.unidade !== 'string' || alimento.unidade.trim().length === 0) {
      throw { status: 400, message: 'Unidade é obrigatória' };
    }

    // Normalização dos dados
    alimento.nome = alimento.nome.trim();
    alimento.unidade = alimento.unidade.trim().toLowerCase();
    alimento.quantidade = Number(alimento.quantidade);

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
