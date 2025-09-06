const request = require('supertest');
const { expect } = require('chai');

describe('Testes de Transferência API GraphQL', () => {
    before(async() =>{
        const loginUser = require ('../fixture/requisicoes/login/loginUser.json');
        const loginResponse = await request('http://localhost:4000/graphql')
            .post('')
            .send(loginUser);
            
        token = loginResponse.body.data.loginUser.token;
    });

    it('Validar que é possível transferir grana entre duas contas', async () => {
     
        const response = await request('http://localhost:4000/graphql')
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `
                    mutation CreateTransfer($from: String!, $to: String!, $value: Float!) {
                        createTransfer(from: $from, to: $to, value: $value) {
                            date
                            from
                            to
                            value
                        }
                    }
                `,
                variables: {
                    from: 'julio',
                    to: 'priscila',
                    value: 15
                }
            });

        expect(response.status).to.equal(200);
        expect(response.body.data.createTransfer).to.have.property('from', 'julio');
        expect(response.body.data.createTransfer).to.have.property('to', 'priscila');
        expect(response.body.data.createTransfer).to.have.property('value', 15);
    });

    it('Validar que não é possível transferir de uma conta sem saldo suficiente', async () => {
               
        const response = await request('http://localhost:4000/graphql')
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `
                    mutation CreateTransfer($from: String!, $to: String!, $value: Float!) {
                        createTransfer(from: $from, to: $to, value: $value) {
                            date
                            from
                            to
                            value
                        }
                    }
                `,
                variables: {
                    from: 'julio',
                    to: 'priscila',
                    value: 10000.01
                }
            });

        expect(response.body.errors[0].message).to.equal('Saldo insuficiente');
    });
});