import type { GameChallengeData } from "./GameChallengeData";
import type { OverviewGameDisplay } from "./GameDisplayData";

export type GameId = string;

export interface GameData {
  id: GameId;
  title: string;
  displays: {
    overview: OverviewGameDisplay;
  };
  challenges: GameChallengeData[];
  css: string;
}
