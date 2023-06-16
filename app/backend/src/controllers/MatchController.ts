import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(
    private matchService: MatchService,
  ) {}

  public async getInProgressMatches(req: Request, res: Response) {
    const { inProgress } = req.query;

    if (inProgress === undefined) {
      const serviceResponse = await this.matchService.findAll();

      return res.status(200).json(serviceResponse.data);
    }
    const serviceResponse = await this.matchService
      .getInProgressMatches(inProgress as string);
    console.log(serviceResponse);
    return res.status(200).json(serviceResponse.data);
  }
}
