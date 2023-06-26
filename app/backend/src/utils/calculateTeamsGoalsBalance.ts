import ILeaderboard from '../Interfaces/ILeaderboard';
import ILeaderboardWithGoalsBalance from '../Interfaces/ILeaderboardWithGoalsBalance';

function calculateTeamGoalsBalance(
  leaderboard: ILeaderboard,
): ILeaderboardWithGoalsBalance {
  const team = leaderboard;
  const goalsBalance = team.goalsFavor - team.goalsOwn;

  const teamGoalsBalance = {
    ...team,
    goalsBalance,
  };
  return teamGoalsBalance;
}

export default calculateTeamGoalsBalance;
