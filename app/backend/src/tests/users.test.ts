import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/UserModel';
import { userRegistered, userWithoutPassword, userWithoutEmail, validLoginBody } from './mocks/users.mock.test';


chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', function () {
  it('Ao realizar login com username e password válidos e cadastrados no banco, retorna um token', async function () {
    const userMock = UserModel.build(userRegistered);
    sinon.stub(UserModel, 'findOne').resolves(userMock);

    const response = await chai.request(app).post('/login').send(validLoginBody);

    expect(response.status).to.be.equal(200);
    expect(response.body.token).not.to.be.undefined;
  });

  it('Ao realizar login com apenas o username informados, retorna uma mensagem de erro', async function () {
    const userMock = UserModel.build(userRegistered);
    sinon.stub(UserModel, 'findOne').resolves(userMock);

    const response = await chai.request(app).post('/login').send(userWithoutPassword);

    expect(response.status).to.be.equal(400);
    expect(response.body).to.be.deep.equal({ message: "All fields must be filled" })
  });

  it('Ao realizar login com apenas o password informados, retorna uma mensagem de erro', async function () {
    sinon.stub(UserModel, 'findOne').resolves(null);

    const response = await chai.request(app).post('/login').send(userWithoutPassword);

    expect(response.status).to.be.equal(400);
    expect(response.body).to.be.deep.equal({ message: "All fields must be filled" })
  });

  afterEach(sinon.restore);
});