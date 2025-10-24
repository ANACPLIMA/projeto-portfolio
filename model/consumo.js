// model/consumo.js
let consumo = [];

module.exports = {
  getAll: () => consumo,
  add: (registro) => { consumo.push(registro); },
};
