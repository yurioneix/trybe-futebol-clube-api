import iLeaderboardWithEfficiency from '../Interfaces/ILeaderboardWithGoalsBalanceAndEfficiency';

export default function sortLeaderboard(
  match: iLeaderboardWithEfficiency[],
): iLeaderboardWithEfficiency[] {
  const leaderboard = match;
  leaderboard.sort((a: iLeaderboardWithEfficiency, b: iLeaderboardWithEfficiency) => {
    if (a.totalPoints !== b.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    if (a.totalVictories !== b.totalVictories) {
      return b.totalVictories - a.totalVictories;
    }

    if (a.goalsBalance !== b.goalsBalance) {
      return b.goalsBalance - a.goalsBalance;
    }

    return b.goalsFavor - a.goalsFavor;
  });

  return leaderboard;
}
