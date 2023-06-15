import * as jwt from 'jsonwebtoken';
import IUser from '../Interfaces/IUser';

const secret = process.env.JWT_SECRET as jwt.Secret;

export default class TokenGeneratorJwt {
  private jwt = jwt;

  public generate(user: IUser): string {
    const token = this.jwt.sign({ id: user.id, role: user.role }, secret);
    return token;
  }

  // public decode(token: string): jwt.JwtPayload | string | null {
  //   const tokenDecoded = this.jwt.decode(token);
  //   return tokenDecoded;
  // }
}
