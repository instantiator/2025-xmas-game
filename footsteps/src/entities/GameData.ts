export type GameId = string;
export type GameChallengeId = string;
export type GameChallengeSolution = string;

export interface GameData {
  id: GameId;
  title: string;
  displays: GameDisplay[];
  challenges: GameChallenge[];
  css: string;
}

export interface GameChallenge {
  id: GameChallengeId;
  displays: GameDisplay[];
  solution: GameChallengeSolution;
}

export type GameDisplayType =
  | "GameOverview"
  | "ChallengePreview"
  | "ChallengeIntroduction"
  | "ChallengeSolutionEntry"
  | "ChallengeCompleted";

export interface GameDisplay {
  type: GameDisplayType;
  template: string;
}

export interface OverviewGameDisplay extends GameDisplay {
  type: "GameOverview";
};
