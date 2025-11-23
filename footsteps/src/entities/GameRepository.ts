import type { GameData, GameId } from "./GameData";

export interface GameRepository {
  ready: boolean;
  games: { [id: GameId]: GameData };
}
