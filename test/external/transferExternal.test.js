// Bibliotecas
const request = require('supertest');
const { expect } = require('chai');

// Testes
describe('Transfer', () => {
    describe('POST /transfers', () => {
        
        beforeEach(async () => {
            const respostaLogin = await request('http://localhost:3000')
              .post('/users/login')
               .send({
                    username: 'julio',
                   password: '123456'
                        });
          token = respostaLogin.body.token;
        })


        it('Quando informo remetente e destinatario inexistentes recebo 400', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/transfers')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "julio",
                    to: "isabelle",
                    value: 100
                });
            
            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Usuário remetente ou destinatário não encontrado')
        });
    });
});