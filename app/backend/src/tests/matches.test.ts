import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchModel from '../database/models/MatchModel';
import { allMatches, inProgressMatches } from './mocks/matches.mock.test';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /matches', function () {
  it('Retorna todos os times corretamente', async function (){
    sinon.stub(MatchModel, 'findAll').resolves(allMatches as any);

    const { status, body } = await chai.request(app).get('/matches');

    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(allMatches);
  });

  it('Ao utilizar a query string matches?inProgress=true, retorna apenas as partidas em progresso', async function () {
    sinon.stub(MatchModel, 'findAll').resolves(inProgressMatches as any);

    const { status, body } = await chai.request(app).get('/matches?inProgress=true');

    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(inProgressMatches);
  });

  afterEach(sinon.restore);
});