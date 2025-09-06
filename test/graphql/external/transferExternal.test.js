const request = require('supertest');
const { expect, use} = require('chai');
require('dotenv').config();

const chaiExclude = require('chai-exclude');
use(chaiExclude);

describe('Testes de Transferência API GraphQL', () => {
    const baseUrlGraphql = process.env.BASE_URL_GRAPHQL;

    before(async() =>{
        const loginUser = require ('../fixture/requisicoes/login/loginUser.json');
        const loginResponse = await request(baseUrlGraphql)
            .post('')
            .send(loginUser);
            
        token = loginResponse.body.data.loginUser.token;
    });

    beforeEach(async () => {
        createTransfer = require('../fixture/requisicoes/transferencia/createTransfer.json');
    });

    it('Validar que é possível transferir grana entre duas contas', async () => {

        const respostaEsperada = require ('../fixture/respostas/transferencia/validarQueÉPossivelTransferirGranaEntreSuasContas.json')
;
        const response = await request(baseUrlGraphql)
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send(createTransfer);

        expect(response.status).to.equal(200);
        expect(response.body.data.createTransfer).excluding('date').to.deep.equal(respostaEsperada.data.createTransfer);
    });

    it('Validar que não é possível transferir de uma conta sem saldo suficiente', async () => {
        createTransfer.variables.value = 10000.01;
               
        const response = await request(baseUrlGraphql)
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send (createTransfer);

        expect(response.body.errors[0].message).to.equal('Saldo insuficiente');
    });
});