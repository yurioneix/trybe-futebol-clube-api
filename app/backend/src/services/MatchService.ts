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
    await this.matchModel.update({
      inProgress: false,
    }, {
      where: { id },
    });
    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }

  public async updateMatch(
    id: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<void> {
    await this.matchModel.update(
      {
        homeTeamGoals,
        awayTeamGoals,
      },
      {
        where: { id },
      },
    );
  }

  public async createMatch(
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<ServiceResponse<IMatch>> {
    const findHomeTeam = await this.matchModel.findByPk(homeTeamId);
    const findAwayTeam = await this.matchModel.findByPk(awayTeamId);

    if (!findHomeTeam || !findAwayTeam) {
      return { status: 'NOT_FOUND', data: { message: 'There is no team with such id!' } };
    }

    const newMatch = await this.matchModel.create({
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    });

    return { status: 'SUCCESSFUL', data: newMatch };
  }
}
