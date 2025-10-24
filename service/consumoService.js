// service/consumoService.js
const Consumo = require('../model/consumo');
const Alimento = require('../model/alimento');
const Progresso = require('../model/progresso');

module.exports = {
  listar: () => Consumo.getAll(),
  registrar: ({ alimentoId, quantidade, data }) => {
    const alimento = Alimento.getById(alimentoId);
    if (!alimento) throw { status: 404, message: 'Alimento não encontrado' };
    if (alimento.quantidade < quantidade) throw { status: 400, message: 'Quantidade insuficiente' };
    alimento.quantidade -= quantidade;
    Progresso.addConsumido(quantidade);
    const registro = { alimentoId, quantidade, data };
    Consumo.add(registro);
    return registro;
  }
};
