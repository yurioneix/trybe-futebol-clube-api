import * as jwt from 'jsonwebtoken';
import IUser from '../Interfaces/IUser';

const secret = process.env.JWT_SECRET;

export default class TokenGeneratorJwt {
  private jwt = jwt;

  public generate(user: IUser): string {
    const token = this.jwt.sign({ id: user.id }, secret as jwt.Secret);
    return token;
  }
}
