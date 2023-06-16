import { Request, Response } from 'express';
import UserService from '../services/UserService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class UserController {
  constructor(
    private userService: UserService,
  ) {}

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const serviceResponse = await this.userService.login(email, password);
    if (serviceResponse.status !== 'SUCCESSFUL') {
      const code = mapStatusHTTP(serviceResponse.status);
      return res.status(code).json(serviceResponse.data);
    }
    return res.status(200).json(serviceResponse.data);
  }

  public async getRole(req: Request, res: Response) {
    const token = req.headers.authorization;

    if (!token) { return res.status(401).json({ message: 'Token not found' }); }

    const serviceResponse = await this.userService.getRole(token);

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }

    const { data: { role } } = serviceResponse;

    return res.status(200).json({ role });
  }
}
