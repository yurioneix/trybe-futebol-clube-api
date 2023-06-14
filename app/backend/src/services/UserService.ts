import { ServiceResponse } from '../Interfaces/ServiceResponse';
import UserModel from '../database/models/UserModel';
import EncrypterBcryptService from './BcryptService';
import TokenGeneratorJwt from './TokenGeneratorJWT';

export default class UserService {
  private userModel = UserModel;
  constructor(
    private encrypter: EncrypterBcryptService,
    private tokenGenerator: TokenGeneratorJwt,
  ) {}

  public async login(email: string, password: string): Promise<ServiceResponse<{ token: string }>> {
    if (!email || !password) {
      return { status: 'INVALID_DATA', data: { message: 'All fields must be filled' } };
    }

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
}
