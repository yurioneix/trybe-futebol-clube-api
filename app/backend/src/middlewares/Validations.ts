import { NextFunction, Request, Response } from 'express';

class Validations {
  static validateLogin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (email === '' || email === undefined) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    if (password === '' || password === undefined) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    next();
  }
}

export default Validations;
