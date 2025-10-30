const request = require('supertest')('http://localhost:3000');
const { expect } = require('chai');


describe('GET /alimentos', () => {
        it('Deve retornar 200 ao listar os alimentos', async () => {
            const resposta = await request
                .get('/alimentos');

            expect(resposta.status).to.equal(200);
            expect(resposta.body[0]).to.have.property('nome');
        });
    });

    describe('POST /alimentos', () => {
        it('Deve retornar 201 ao adicionar um novo alimento', async () => {
            const novoAlimento = { nome: 'Macarrão', quantidade: 3, unidade: 'kg' };
            const resposta = await request
                .post('/alimentos')
                .send(novoAlimento);

            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.have.property('nome', 'Macarrão');
            expect(resposta.body).to.have.property('quantidade', 3);
            expect(resposta.body).to.have.property('unidade', 'kg');

        });
    });

    it('Deve retornar erro 400 ao tentar consumir alimento inexistente', async () => {
        const consumoData = {
            "nome": "Goma",
            "quantidade": 10

        };
        const resposta = await request
            .post('/alimentos')
            .send(consumoData);

        expect(resposta.status).to.equal(400);
        expect(resposta.body).to.have.property('message');
    });

    describe('DELETE /alimentos/:id', () => {
        it('Deve retornar 204 ao remover um alimento existente', async () => {
            const novoAlimento = { nome: 'Farinha', quantidade: 1, unidade: 'kg' };
            const addRes = await request
                .post('/alimentos')
                .send(novoAlimento);

            const id = addRes.body.id;
            const resposta = await request.delete(`/alimentos/${id}`);
            expect(resposta.status).to.equal(204);
        });

        it('Deve retornar 404 ao tentar remover alimento inexistente', async () => {

            const resposta = await request
                .delete('/alimentos/999999');

            expect(resposta.status).to.equal(404);
            expect(resposta.body).to.have.property('message', 'Alimento não encontrado');
        });
    });


