import * as jwt from 'jsonwebtoken';
import IUser from '../Interfaces/IUser';

export default class TokenGeneratorJwt {
  private jwt = jwt;

  public generate(user: IUser): string {
    const token = this.jwt.sign({ id: user.id }, 'SECRET');
    return token;
  }
}
