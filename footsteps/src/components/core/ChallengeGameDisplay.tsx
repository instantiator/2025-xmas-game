import { type PropsWithChildren } from "react";
import { NO_CHALLENGE_DISPLAY } from "../../constants/DefaultGameDisplays";
import type { GameChallengeId } from "../../entities/GameChallengeData";
import type { GameChallengeState } from "../../entities/GameChallengeState";
import type { GameData } from "../../entities/GameData";
import type { ChallengeGameDisplayType } from "../../entities/GameDisplayData";
import type { GameState } from "../../entities/GameState";
import GameDisplay from "./GameDisplay";

interface ChallengeGameDisplayProps {
  gameData: GameData;
  gameState: GameState;
  challengeId: GameChallengeId;
}

export default function ChallengeGameDisplay({
  gameData,
  gameState,
  challengeId,
}: PropsWithChildren<ChallengeGameDisplayProps>) {
  // TODO - select the challenge display type based on the current state of the challenge
  const type: ChallengeGameDisplayType = "challenge-introduction";
  const challengeState: GameChallengeState = gameState.challenges[challengeId];
  const display = challengeState.challenge.displays.find((d) => d.type === type) ?? NO_CHALLENGE_DISPLAY(type);
  const gameContextData = { gameData, gameState, challengeState };
  return <GameDisplay display={display} gameContextData={gameContextData} />;
}
