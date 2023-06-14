import * as bcrypt from 'bcryptjs';

export default class EncrypterBcryptService {
  private bcrypt = bcrypt;

  async compare(password: string, hash: string): Promise<boolean> {
    const isValid = await this.bcrypt.compare(password, hash);
    return isValid;
  }
}
