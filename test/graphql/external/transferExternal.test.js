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
        const respostaEsperada = require('../fixture/respostas/transferencia/validarQueEPossivelTransferirGranaEntreDuasContas.json');

        const respostaTransferencia = await request(baseUrlGraphql)
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send(createTransfer);

        expect(respostaTransferencia.status).to.equal(200);
        expect(respostaTransferencia.body.data.createTransfer)
            .excluding('date')
            .to.deep.equal(respostaEsperada.data.createTransfer);

    });

    const testesDeErrosDeNegocio = require('../fixture/requisicoes/transferencia/createTransferWithError.json'); 
    testesDeErrosDeNegocio.forEach(teste => {
        it(`Validar que não é possível transferir com ${teste.nomeDoTeste}`, async () => {
            const respostaTransferencia = await request(baseUrlGraphql)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(teste.createTransfer);

            expect(respostaTransferencia.status).to.equal(200);
            expect(respostaTransferencia.body.errors[0].message).to.equal(teste.mensagemEsperada);
        });
    });
});