import { NextFunction, Request, Response } from 'express';
import JWT from '../utils/JWT';

class Validations {
  static validateBody(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (email === '' || email === undefined) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    if (password === '' || password === undefined) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    next();
  }

  static validateEmailAndPassword(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email) || password.length < 6) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    next();
  }

  static async validateToken(req: Request, res: Response, next: NextFunction):
  Promise<Response | void> {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }
    const validToken = await JWT.verify(token);
    if (validToken === 'Token must be a valid token') {
      return res.status(401).json({ message: validToken });
    }
    next();
  }
}

export default Validations;
