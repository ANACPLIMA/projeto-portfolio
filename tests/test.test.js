let consumo = [];

app.get('/consumo', (req, res) => res.json(consumo));
app.post('/consumo', (req, res) => {
    const { alimentoId, quantidade, data } = req.body;
    const alimento = alimentos.find(a => a.id === alimentoId);

});
describe('GET /consumo', () => {
    it('deve retornar o histórico de consumo', async () => {
        const res = await request(app).get('/consumo');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('POST /consumo', () => {
    it('deve registrar consumo de alimento existente', async () => {
        // Adiciona alimento para garantir que existe
        const novoAlimento = { nome: 'Açúcar', quantidade: 10, unidade: 'kg' };
        const addRes = await request(app).post('/alimentos').send(novoAlimento);
        const alimentoId = addRes.body.id;
        const consumoData = { alimentoId, quantidade: 10, data: '2025-10-28' };
        const res = await request(app).post('/consumo').send(consumoData);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('alimentoId', alimentoId);
        expect(res.body).toHaveProperty('quantidade', 2);
        expect(res.body).toHaveProperty('data', '2025-10-28');
    });

    it('deve retornar erro 404 ao consumir alimento inexistente', async () => {
        const consumoData = { alimentoId: '999999', quantidade: 1, data: '2025-10-28' };
        const res = await request(app).post('/consumo').send(consumoData);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Alimento não encontrado');
    });

    it('deve retornar erro 400 ao consumir quantidade maior que disponível', async () => {
        // Adiciona alimento para garantir que existe
        const novoAlimento = { nome: 'Café', quantidade: 1, unidade: 'kg' };
        const addRes = await request(app).post('/alimentos').send(novoAlimento);
        const alimentoId = addRes.body.id;
        const consumoData = { alimentoId, quantidade: 10, data: '2025-10-28' };
        const res = await request(app).post('/consumo').send(consumoData);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Quantidade insuficiente');
    });
});
app.post('/auth/logout', (req, res) => res.status(200).json({ message: 'Logout realizado' }));

app.delete('/alimentos/:id', (req, res) => {
    const idx = alimentos.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Alimento não encontrado' });
    alimentos.splice(idx, 1);
    res.status(204).send();
});
describe('POST /auth/logout', () => {
    it('deve realizar logout com sucesso', async () => {
        const res = await request(app).post('/auth/logout');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Logout realizado');
    });
});

describe('DELETE /alimentos/:id', () => {
    it('deve remover um alimento existente', async () => {
        // Adiciona alimento para garantir que existe
        const novoAlimento = { nome: 'Farinha', quantidade: 1, unidade: 'kg' };
        const addRes = await request(app).post('/alimentos').send(novoAlimento);
        const id = addRes.body.id;
        const res = await request(app).delete(`/alimentos/${id}`);

        expect(res.statusCode).toBe(204);
    });

    it('deve retornar 404 ao tentar remover alimento inexistente', async () => {
        const res = await request(app).delete('/alimentos/999999');

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Alimento não encontrado');
    });
});
let progresso = { total: 7, consumido: 0 };

app.get('/progresso', (req, res) => res.json(progresso));

app.post('/alimentos', (req, res) => {
    const novo = { ...req.body, id: String(Date.now()) };
    alimentos.push(novo);
    progresso.total += novo.quantidade;
    res.status(201).json(novo);
});
describe('POST /alimentos', () => {
    it('deve adicionar um novo alimento', async () => {
        const novoAlimento = { nome: 'Macarrão', quantidade: 3, unidade: 'kg' };
        const res = await request(app)
            .post('/alimentos')
            .send(novoAlimento);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('nome', 'Macarrão');
        expect(res.body).toHaveProperty('quantidade', 3);
        expect(res.body).toHaveProperty('unidade', 'kg');
        expect(res.body).toHaveProperty('id');
    });
});

describe('GET /progresso', () => {
    it('deve retornar o progresso atual', async () => {
        const res = await request(app).get('/progresso');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('consumido');
    });
});
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let alimentos = [
    { id: '1', nome: 'Arroz', quantidade: 5, unidade: 'kg' },
    { id: '2', nome: 'Feijão', quantidade: 2, unidade: 'kg' }
];

app.get('/alimentos', (req, res) => res.json(alimentos));

// Endpoint de autenticação
app.post('/auth/login', (req, res) => {
    const { username, password, role } = req.body;
    if ((username === 'dono' && password === 'dono123' && role === 'dono') ||
        (username === 'comprador' && password === 'comprador123' && role === 'comprador')) {
        return res.status(200).json({ message: 'Login realizado com sucesso' });
    }
    res.status(401).json({ message: 'Credenciais inválidas' });
});

describe('GET /alimentos', () => {
    it('deve retornar 200 a lista de alimentos', async () => {
        const res = await request(app).get('/alimentos');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('nome');
    });
});

describe('POST /auth/login', () => {
    it('deve autenticar usuário dono com sucesso', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'dono', password: 'dono123', role: 'dono' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Login realizado com sucesso');
    });

    it('deve autenticar usuário comprador com sucesso', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'comprador', password: 'comprador123', role: 'comprador' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Login realizado com sucesso');
    });

    it('deve falhar autenticação com credenciais inválidas', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'invalido', password: '123', role: 'dono' });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Credenciais inválidas');
    });
});
