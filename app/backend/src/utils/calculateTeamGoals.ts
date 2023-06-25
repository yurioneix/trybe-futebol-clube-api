import { IMatchTeams } from '../Interfaces/IMatch';
import ILeaderboard from '../Interfaces/ILeaderboard';

export default function calculateTeamGoals(team: IMatchTeams[]): ILeaderboard {
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
  });
  return leaderboard;
}
