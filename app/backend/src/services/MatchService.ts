import calculateTeamGoalsBalance from '../utils/calculateTeamsGoalsBalance';
import calculateTeamEfficiency from '../utils/calculateTeamsEfficiency';
import TeamModel from '../database/models/TeamModel';
import { IMatchTeams, IMatch } from '../Interfaces/IMatch';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import MatchModel from '../database/models/MatchModel';
import ILeaderboard from '../Interfaces/ILeaderboard';
import calculateTeamGoals from '../utils/calculateTeamGoals';
import calculateTeamScore from '../utils/calculateTeamScore';
import iLeaderboardWithEfficiency from '../Interfaces/ILeaderboardWithGoalsBalanceAndEfficiency';
import sortLeaderboard from '../utils/sortLeadeboard';

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

  public async getFinishedMatches(): Promise<IMatch[]> {
    const allMatches = await this.matchModel.findAll({
      where: { inProgress: false },
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

    return allMatches;
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

  public async getMatches(): Promise<IMatch[]> {
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

    return allMatches;
  }

  public async getAllMatches(): Promise<IMatchTeams[][]> {
    const teams = await TeamModel.findAll();
    const matches = await this.getFinishedMatches() as unknown as IMatchTeams[];
    const allTeams = teams.map((team) => matches.filter((match) => match.homeTeamId === team.id));

    return allTeams;
  }

  public async getLeaderboardScore(): Promise<ILeaderboard[]> {
    const allTeams = await this.getAllMatches();
    return allTeams.map((team) => {
      const leaderboard = calculateTeamGoals(team);
      const score = calculateTeamScore(team, leaderboard);
      return score;
    });
  }

  public async updateLeaderboard(): Promise<iLeaderboardWithEfficiency[]> {
    const leaderboard = await this.getLeaderboardScore();

    const updatedLeaderBoard = leaderboard.map((team) => {
      const leaderboardWithGoalsBalance = calculateTeamGoalsBalance(team);
      const leaderboardWithEfficiency = calculateTeamEfficiency(leaderboardWithGoalsBalance);
      return leaderboardWithEfficiency;
    });
    const sortedLeaderboard = sortLeaderboard(updatedLeaderBoard);

    return sortedLeaderboard;
  }
}
