import TeamModel from '../database/models/TeamModel';
import IMatch from '../Interfaces/IMatch';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import MatchModel from '../database/models/MatchModel';

export default class MatchService {
  constructor(
    private matchModel = MatchModel,
  ) {}

  public async findAll(): Promise<ServiceResponse<IMatch[]>> {
    const allMatches = await this.matchModel.findAll({
      include: [{
        model: TeamModel,
        as: 'homeTeam',
        attributes: ['teamName'],
      },
      {
        model: TeamModel,
        as: 'awayTeam',
        attributes: ['teamName'],
      }],
    });
    return { status: 'SUCCESSFUL', data: allMatches };
  }

  public async getInProgressMatches(inProgress: string): Promise<ServiceResponse<IMatch[]>> {
    const isTrue = inProgress === 'true';
    const allMatches = await this.matchModel.findAll({
      where: { inProgress: isTrue },
      include: [{
        model: TeamModel,
        as: 'homeTeam',
        attributes: ['teamName'],
      },
      {
        model: TeamModel,
        as: 'awayTeam',
        attributes: ['teamName'],
      }],
    });

    return { status: 'SUCCESSFUL', data: allMatches };
  }

  public async finishMatch(id: number): Promise<ServiceResponse<{ message: string }>> {
    const response = await this.matchModel.update({
      inProgress: false,
    }, {
      where: { id },
    });
    console.log(response);
    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }
}
