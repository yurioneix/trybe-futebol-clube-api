import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import { teams, cruzeiro } from './mocks/teams.mock.test';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /teams/', () => {
  it('Testa se é retornado todos os times nesta rota', async function () {
    sinon.stub(TeamModel, "findAll").resolves(teams as any);

    const { status, body } = await chai.request(app).get('/teams');

    expect(status).to.equal(200);
    expect(body).to.be.deep.equal(teams);
  });

  afterEach(sinon.restore);
});

describe('GET /teams/:id', () => {

  it('Testa se é retornado um time específico', async function () {
    sinon.stub(TeamModel, "findOne").resolves(cruzeiro as any);

    const { status, body } = await chai.request(app).get('/teams/5');

    expect(status).to.equal(200);
    expect(body).to.be.deep.equal(cruzeiro);
  });

  it('Testa se é retornado um erro ao não encontrar um time', async function () {
    sinon.stub(TeamModel, "findOne").resolves(null);

    const { status, body } = await chai.request(app).get('/teams/50');

    expect(status).to.equal(404);
    expect(body).to.be.deep.equal('Team 50 not found');
  });

  afterEach(sinon.restore);
});
