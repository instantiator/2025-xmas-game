import type { GameChallengeData } from "./GameChallengeData";
import type { GameDisplayData } from "./GameDisplayData";

export type GameId = string;

export interface GameData {
  id: GameId;
  title: string;
  displays: GameDisplayData[];
  challenges: GameChallengeData[];
  css: string;
}
