import ILeaderboard from './ILeaderboard';

export default interface ILeaderboardWithGoalsBalance extends ILeaderboard {
  goalsBalance: number,
}
