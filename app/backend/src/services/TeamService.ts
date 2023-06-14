import { ServiceResponse } from '../Interfaces/ServiceResponse';
import TeamModel from '../database/models/TeamModel';
import ITeam from '../Interfaces/ITeam';

export default class TeamService {
  constructor(
    private teamModel = TeamModel,
  ) {}

  public async findAll(): Promise<ServiceResponse<ITeam[]>> {
    const allTeams = await this.teamModel.findAll();
    return { status: 'SUCCESSFUL', data: allTeams };
  }

  public async findOne(id: number): Promise<ServiceResponse<ITeam>> {
    const team = await this.teamModel.findByPk(id);

    if (!team) return { status: 'NOT_FOUND', data: { message: `Team ${id} not found` } };
    return { status: 'SUCCESSFUL', data: team };
  }
}
