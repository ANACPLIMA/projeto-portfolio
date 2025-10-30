const request = require('supertest')('http://localhost:3000');
const { expect } = require('chai');

describe('Login', () => {
    describe('POST /auth/login', () => {
        it('Deve retornar 200 com a mensagem de sucesso', async () => {
            const resposta = await request
                .post('/auth/login')
                .set('content-type', 'application/json')
                .send({
                    username: 'dono',
                    password: 'dono123',
                    role: 'dono'
                });

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.property('message');
        });

        it('Deve retornar 401 com credenciais inválidas', async () => {
            const resposta = await request
                .post('/auth/login')
                .set('content-type', 'application/json')
                .send({
                    username: 'maria',
                    password: 'maria',
                    role: 'maria'
                });

            expect(resposta.status).to.equal(401);

        });
    });


    describe('POST /auth/logout', () => {
        it('Deve retornar 200 ao realizar logout com sucesso', async () => {
            const resposta = await request
                .post('/auth/logout');

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.property('message', 'Logout realizado');
        });

});
});
