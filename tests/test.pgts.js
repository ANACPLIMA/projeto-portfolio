const request = require('supertest')('http://localhost:3000');
const { expect } = require('chai');

describe('Login', () => {
    describe('POST /auth/login', () => {
        it('Deve retornar 200 com o msg de sucesso', async () => {
            const resposta = await request
                .post('/auth/login')
                .set('content-type', 'application/json')
                .send({
                    "username": "string",
                    "password": "string",
                    "role": "dono"
                });
 
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.property('message');
 
        });
 
        it('Deve retornar 401 com o msg de erro', async () => {
            const resposta = await request
                .post('/auth/login')
                .set('content-type', 'application/json')
                .send({
                    "username": "xxxxx",
                    "password": "xxxxx",
                    "role": "xxxxx"
                });
 
            expect(resposta.status).to.equal(401);
            // expect(resposta.body).to.have.property('message');
        });
 
    });
});