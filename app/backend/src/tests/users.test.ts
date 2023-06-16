import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import { app } from '../app';
import UserModel from '../database/models/UserModel';
import { userRegistered, userWithoutPassword, userWithoutEmail, validAndRegisteredUser, unauthorizedEmail, unauthorizedPassword, invalidEmailUser } from './mocks/users.mock.test';


chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', function () {
  it('Ao realizar login com email e password válidos e cadastrados no banco, retorna um token', async function () {
    const userMock = UserModel.build(userRegistered);
    sinon.stub(UserModel, 'findOne').resolves(userMock);
    sinon.stub(bcrypt, 'compare').resolves(true);
    sinon.stub(jwt, 'sign').returns('token' as any);

    const response = await chai.request(app).post('/login').send(validAndRegisteredUser);

    expect(response.status).to.be.equal(200);
    expect(response.body.token).not.to.be.undefined;
  });

  it('Ao realizar login com apenas o email informados, retorna uma mensagem de erro', async function () {

    const response = await chai.request(app).post('/login').send(userWithoutEmail);

    expect(response.status).to.be.equal(400);
    expect(response.body).to.be.deep.equal({ message: "All fields must be filled" });
  });

  it('Ao realizar login com apenas o password informados, retorna uma mensagem de erro', async function () {

    const response = await chai.request(app).post('/login').send(userWithoutPassword);

    expect(response.status).to.be.equal(400);
    expect(response.body).to.be.deep.equal({ message: "All fields must be filled" })
  });

  it('Ao realizar login com email inválido, retorna uma mensagem de erro', async function () {

    const response = await chai.request(app).post('/login').send(invalidEmailUser);

    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ message: 'Invalid email or password' })
  });

  it('Ao realizar login com email não cadastrado no banco, retorna um erro', async function () {
    sinon.stub(UserModel, 'findOne').resolves(null);
    sinon.stub(bcrypt, 'compare').resolves(false);

    const response = await chai.request(app).post('/login').send(unauthorizedEmail);

    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal(  { message: "Invalid email or password" });
  });

  it('Ao realizar login com password não cadastrado no banco, retorna um erro', async function () {
    sinon.stub(UserModel, 'findOne').resolves(null);
    sinon.stub(bcrypt, 'compare').resolves(false);

    const response = await chai.request(app).post('/login').send(unauthorizedPassword);

    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal(  { message: "Invalid email or password" });
  });

  afterEach(sinon.restore);
});

describe('GET /login/role', function () {
  it('Ao bater na rota com um token válido, retorna a role do user', async function () {
    sinon.stub(jwt, 'verify').returns({ role: 'user'} as any);

    const response = await chai.request(app).get('/login/role').set('Authorization', 'token');

    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.deep.equal({
      "role": "user"
    });
  });

  it('Ao bater na rota com um token inválido, retorna uma mensagem de erro', async function () {
    sinon.stub(jwt, 'verify').returns('Token must be a valid token' as any);

    const response = await chai.request(app).get('/login/role').set('Authorization', 'token');

    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({
      message: "Token must be a valid token"
    });
  });


  it('Ao bater na rota sem passar um token, retorna uma mensagem de erro', async function () {
    const response = await chai.request(app).get('/login/role')

    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ message: 'Token not found' });
  });

  afterEach(sinon.restore);
});