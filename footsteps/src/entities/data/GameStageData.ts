import type { GameChallengeData } from "./GameChallengeData";
import type { GameStageDisplay } from "./displays/GameDisplayData";

export type GameStageId = string;

/**
 * Describes a game stage - including its displays, and the challenges it contains.
 * A stage may contain more than one challenge, and may group its challenges together.
 */
export interface GameStageData {
  /** Unique id for this stage */
  id: GameStageId;

  /**
   * Display information for the stage. (Optional.)
   * Defaults to undefined for overview, completed, and activeLayout.
   */
  displays?: {
    /** The overview for the stage (if not provided, the stage will show the first incomplete challenge) */
    overview?: GameStageDisplay;

    /** The completed view for the stage (if not provided, the game will return to the overview if all challenges are complete) */
    completed?: GameStageDisplay;
  };

  /** If set, group challenges together in the active layout, otherwise assumes a chunking of 1 */
  challengeChunking?: number;

  /** All challenges in a stage */
  challenges: GameChallengeData[];
}
