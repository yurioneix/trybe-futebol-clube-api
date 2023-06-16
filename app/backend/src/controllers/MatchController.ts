import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(
    private matchService: MatchService,
  ) {}

  public async getMatches(req: Request, res: Response) {
    const serviceResponse = await this.matchService.findAll();

    return res.status(200).json(serviceResponse.data);
  }
}
