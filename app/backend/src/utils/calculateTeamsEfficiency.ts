import iLeaderboardWithEfficiency from '../Interfaces/ILeaderboardWithGoalsBalanceAndEfficiency';
import ILeaderboardWithGoalsBalance from '../Interfaces/ILeaderboardWithGoalsBalance';

function calculateTeamEfficiency(
  match: ILeaderboardWithGoalsBalance,
): iLeaderboardWithEfficiency {
  const leaderboard = match;
  const efficiency = ((leaderboard.totalPoints / (leaderboard.totalGames * 3)) * 100).toFixed(2);

  const result = {
    ...leaderboard,
    efficiency,
  };
  return result;
}

export default calculateTeamEfficiency;
