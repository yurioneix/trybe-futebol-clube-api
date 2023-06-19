import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchModel from '../database/models/MatchModel';
import { allMatches, equalTeamsMatch, inProgressMatches, newMatch } from './mocks/matches.mock.test';

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

describe('PATCH /matches/:id/finish', function () {
  it('Verifica se é possível atualizar uma partida', async function () {
    sinon.stub(MatchModel, 'update').resolves([0]);
    sinon.stub(jwt, 'verify').returns({id: 1, role: 'admin'} as any);

    const { status, body } = await chai.request(app).patch('/matches/46/finish').set('Authorization', 'token');

    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal({
      message: "Finished"
    })
  });

  afterEach(sinon.restore);
});

describe('PATCH /matches/:id', function () {
  it('Verifica se é possível atualizar o placar de uma partida', async function () {
    sinon.stub(MatchModel, 'update').resolves([1]);
    sinon.stub(jwt, 'verify').returns({id: 1, role: 'admin'} as any);

    const { status, body } = await chai.request(app).patch('/matches/2').send({
      "homeTeamGoals": 3,
      "awayTeamGoals": 1
    }).set('Authorization', 'token');

    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(
      "Partida atualizada com sucesso"
    )
  })

  afterEach(sinon.restore);
});

describe('POST /matches', function () {
  it('Verifica se possível cadastrar uma nova partida com sucesso', async function () {
    sinon.stub(MatchModel, 'create').resolves(newMatch as any);
    sinon.stub(jwt, 'verify').returns({id: 1, role: 'admin'} as any);

    const { status, body } = await chai.request(app).post('/matches').send({
      homeTeamId: 16,
      awayTeamId: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    }).set('Authorization', 'token');

    expect(status).to.be.equal(201);
    expect(body).to.be.deep.equal(newMatch);
  });

  it('Verifica ao tentar cadastrar uma partida com dois times iguais, retorna uma mensagem de erro ', async function () {
    // sinon.stub(MatchModel, 'findByPk').resolves(equalTeamsMatch as any);
    sinon.stub(jwt, 'verify').returns({id: 1, role: 'admin'} as any);

    const { status, body } = await chai.request(app).post('/matches').send({
      homeTeamId: 16,
      awayTeamId: 16,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    }).set('Authorization', 'token');

    expect(status).to.be.equal(422);
    expect(body).to.be.deep.equal({
      message: "It is not possible to create a match with two equal teams"
    });
  });

  it('Verifica ao tentar cadastrar uma partida com algum time que não existe no banco, retorna uma mensagem de erro ', async function () {
    sinon.stub(MatchModel, 'findByPk').resolves(null);
    sinon.stub(jwt, 'verify').returns({id: 1, role: 'admin'} as any);

    const { status, body } = await chai.request(app).post('/matches').send({
      homeTeamId: 50,
      awayTeamId: 16,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    }).set('Authorization', 'token');

    expect(status).to.be.equal(404);
    expect(body).to.be.deep.equal({
      message: "There is no team with such id!"
    });
  });

  afterEach(sinon.restore);
});