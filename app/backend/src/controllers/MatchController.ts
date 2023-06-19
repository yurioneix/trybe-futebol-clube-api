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

    return res.status(200).json(serviceResponse.data);
  }

  public async finishMatch(req: Request, res: Response) {
    const { id } = req.params;

    const serviceResponse = await this.matchService.finishMatch(Number(id));

    return res.status(200).json(serviceResponse.data);
  }
}
