import ILeaderboard from '../Interfaces/ILeaderboard';
import { IMatchTeams } from '../Interfaces/IMatch';

function calculateTeamScore(team: IMatchTeams[], match: ILeaderboard): ILeaderboard {
  const leaderboard = match;
  team.forEach((element) => {
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
}

export default calculateTeamScore;
