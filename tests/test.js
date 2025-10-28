
// Teste automatizado para o endpoint GET /alimentos
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let alimentos = [
  { id: '1', nome: 'Arroz', quantidade: 10, unidade: 'kg' },
  { id: '2', nome: 'Feijão', quantidade: 10, unidade: 'kg' },
  { id: '3', nome: 'Macarrão', quantidade: 10, unidade: 'kg' },
  { id: '4', nome: 'Farinha', quantidade: 10, unidade: 'kg' },
  { id: '5', nome: 'Flocão', quantidade: 10, unidade: 'kg' },
  { id: '6', nome: 'Bolacha', quantidade: 10, unidade: 'Unidade' },
  { id: '7', nome: 'Trigo', quantidade: 10, unidade: 'kg' },
  { id: '8', nome: 'Margarina', quantidade: 10, unidade: 'kg' },
  { id: '9', nome: 'Ovos', quantidade: 10, unidade: 'Unidade' },
  { id: '10', nome: 'Café', quantidade: 10, unidade: 'kg' },

];

app.get('/alimentos', (req, res) => res.json(alimentos));

describe('GET /alimentos', () => {
  it('deve retornar a lista de alimentos', async () => {
    const res = await request(app).get('/alimentos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('nome');
  });
});
