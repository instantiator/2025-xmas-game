import type { GameChallengeId } from "./GameChallengeData";
import type { GameChallengeState } from "./GameChallengeState";
import type { GameData, GameId } from "./GameData";

export interface GameState {
  gameId: GameId;
  challenges: { [index: GameChallengeId]: GameChallengeState };
  currentChallenge: GameChallengeId | null;
}

export function blankGameState(game: GameData): GameState {
  const challenges: { [index: GameChallengeId]: GameChallengeState } = game.challenges.reduce((obj, challenge) => {
    obj[challenge.id] = {
      challenge: challenge,
      attempts: [],
      succeeded: false,
    };
    return obj;
  }, {} as { [index: GameChallengeId]: GameChallengeState });

  return {
      gameId: game.id,
      challenges: challenges,
      currentChallenge: null,
  };
}