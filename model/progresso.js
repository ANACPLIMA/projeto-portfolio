// model/progresso.js
let progresso = { total: 7, consumido: 0 };

module.exports = {
  get: () => progresso,
  addTotal: (qtd) => { progresso.total += qtd; },
  addConsumido: (qtd) => { progresso.consumido += qtd; },
  removeTotal: (qtd) => { progresso.total -= qtd; },
};
