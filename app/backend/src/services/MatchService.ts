/* eslint-disable max-lines-per-function */
import TeamModel from '../database/models/TeamModel';
import { IMatchTeams, IMatch } from '../Interfaces/IMatch';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import MatchModel from '../database/models/MatchModel';
import ILeaderboard from '../Interfaces/ILeaderboard';

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

  // public async getTotalPoints(teams: IMatchTeams[]): Promise<number> {
  //   // const teams = await TeamModel.findAll();
  //   // const matches = await this.getMatches() as unknown as IMatchTeams[];
  //   const allTeams = teams.map((team) => matches.filter((match) => match.homeTeamId === team.id));

  //   // let totalPoints = 0;
  //   // matches.filter((match) => match.homeTeam.teamName === teamName).forEach((team) => {
  //   //   if (team.homeTeamGoals > team.awayTeamGoals) {
  //   //     team.totalPoints += 3;
  //   //     team.totalVictories += 1;
  //   //     team.totalGames += 1;
  //   //     // return totalPoints;
  //   //   }
  //   //   if (team.homeTeamGoals === team.awayTeamGoals) {
  //   //     // let totalPoints = 0;
  //   //     team.totalPoints += 1;
  //   //     team.totalDraws += 1;
  //   //   }
  //   //   if (homeTeamGoals < awayTeamGoals) {
  //   //     team.totalLosses += 1;
  //   //   }
  //   // });
  //   // return totalPoints;
  //   // return matches.map((match) => {
  //   //   if (match.homeTeamGoals > match.awayTeamGoals) {
  //   //     totalPoints += 3;
  //   //     // return null;
  //   //   } if (match.homeTeamGoals === match.awayTeamGoals) {
  //   //     totalPoints += 1;
  //   //     // return points;
  //   //   }
  //   //   // } if (match.homeTeamGoals < match.awayTeamGoals) {
  //   //   //   totalPoints += 0;
  //   //   //   // return points;
  //   //   // }
  //   //   return totalPoints;
  //   // });
  // }

  public async teamsLeaderBoard(): Promise<ILeaderboard[]> {
    const teams = await TeamModel.findAll();
    const matches = await this.getMatches() as unknown as IMatchTeams[];
    const allTeams = teams.map((team) => matches.filter((match) => match.homeTeamId === team.id));

    const teamsLeaderBoard = allTeams.map((team) => {
      const leaderboard = {
        name: '',
        totalPoints: 0,
        totalGames: team.length,
        totalVictories: 0,
        totalDraws: 0,
        totalLosses: 0,
        goalsFavor: 0,
        goalsOwn: 0,
      };
      team.forEach((element) => {
        leaderboard.goalsFavor += element.homeTeamGoals;
        leaderboard.goalsOwn += element.awayTeamGoals;
        leaderboard.name = element.homeTeam.teamName;

        if (element.homeTeamGoals > element.awayTeamGoals) {
          leaderboard.totalPoints += 3;
          leaderboard.totalVictories += 1;
          return leaderboard;
        }
        if (element.homeTeamGoals < element.awayTeamGoals) {
          leaderboard.totalLosses += 1;
          return leaderboard;
        }
        if (element.homeTeamGoals === element.awayTeamGoals) {
          leaderboard.totalDraws += 1;
          leaderboard.totalPoints += 1;
          return leaderboard;
        }
      });
      return leaderboard;
    });

    return teamsLeaderBoard as any;
  }

  // public async getLeaderBoard(): Promise<ILeaderboard[]> {
  //   const leaderboards = await this.teamsLeaderBoard();

  //   return leaderboards.map((leaderboard) => {
  //     leaderboard.
  //     if (leaderboard. > leaderboard.awayTeamGoals) {
  //       leaderboard.totalPoints += 3;
  //       leaderboard.goalsFavor += leaderboard.goalsFavor;
  //       leaderboard.totalVictories += 1;
  //       leaderboard.totalGames += 1;
  //       leaderboard.goalsOwn += leaderboard.goalsOwn;
  //       return leaderboard;
  //     }
  //     if (leaderboard.homeTeamGoals < leaderboard.awayTeamGoals) {
  //       leaderboard.totalLosses += 1;
  //       leaderboard.goalsFavor += leaderboard.goalsFavor;
  //       leaderboard.goalsOwn += leaderboard.goalsOwn;
  //       leaderboard.totalGames += 1;
  //       return leaderboard;
  //     }
  //     if (leaderboard.homeTeamGoals === leaderboard.awayTeamGoals) {
  //       leaderboard.goalsFavor += leaderboard.goalsFavor;
  //       leaderboard.goalsOwn += leaderboard.goalsOwn;
  //       leaderboard.totalDraws += 1;
  //       leaderboard.totalGames += 1;
  //       return leaderboard;
  //     }
  //     // return leaderboard;
  //   });
  // }
}
