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

  public async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;

    await this.matchService.updateMatch(
      Number(id),
      homeTeamGoals,
      awayTeamGoals,
    );

    return res.status(200).json('Partida atualizada com sucesso');
  }

  public async createMatch(req: Request, res: Response) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;

    if (homeTeamId === awayTeamId) {
      return res.status(422).json({
        message: 'It is not possible to create a match with two equal teams',
      });
    }

    const serviceResponse = await this.matchService
      .createMatch(homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals);

    if (serviceResponse.status === 'NOT_FOUND') {
      return res.status(404).json({ message: 'There is no team with such id!' });
    }

    return res.status(201).json(serviceResponse.data);
  }
}
