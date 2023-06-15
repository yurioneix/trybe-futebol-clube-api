import { JwtPayload } from 'jsonwebtoken';
import JWT from '../utils/JWT';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import UserModel from '../database/models/UserModel';
import EncrypterBcryptService from './BcryptService';
import TokenGeneratorJwt from './TokenGeneratorJWT';

export default class UserService {
  private userModel = UserModel;
  private jwt = JWT;
  constructor(
    private encrypter: EncrypterBcryptService,
    private tokenGenerator: TokenGeneratorJwt,
  ) {}

  public async login(
    email: string,
    password: string,
  ): Promise<ServiceResponse<{ token: string }>> {
    const user = await this.userModel.findOne({
      where: { email },
    });

    if (!user) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }

    const isValid = await this.encrypter.compare(password, user.password);

    if (!isValid) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }

    const token = this.tokenGenerator.generate(user);

    return { status: 'SUCCESSFUL', data: { token } };
  }

  public async getRole(token: string): Promise<ServiceResponse<{ role: string }>> {
    const decodedToken = this.jwt.verify(token) as JwtPayload | null;
    console.log(decodedToken);

    if (!decodedToken) {
      return { status: 'NOT_FOUND', data: { message: 'User not found' } };
    }

    return { status: 'SUCCESSFUL', data: { role: decodedToken.role } };
  }
}
