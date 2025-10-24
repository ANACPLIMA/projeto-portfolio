// model/alimento.js
let alimentos = [
  { id: '1', nome: 'Arroz', quantidade: 5, unidade: 'kg' },
  { id: '2', nome: 'Feijão', quantidade: 2, unidade: 'kg' }
];

module.exports = {
  getAll: () => alimentos,
  getById: (id) => alimentos.find(a => a.id === id),
  add: (alimento) => { alimentos.push(alimento); },
  update: (id, data) => {
    const idx = alimentos.findIndex(a => a.id === id);
    if (idx !== -1) alimentos[idx] = { ...alimentos[idx], ...data };
    return alimentos[idx];
  },
  remove: (id) => {
    const idx = alimentos.findIndex(a => a.id === id);
    if (idx !== -1) alimentos.splice(idx, 1);
  }
};
