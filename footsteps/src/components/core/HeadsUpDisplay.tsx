import { useEffect, useState } from "react";
import { useGameState } from "../../providers/GameStateHook";
import { getRenderMode } from "./logic/RenderDataUtils";

export default function HeadsUpDisplay() {
  const { gameState, setGameState } = useGameState();

  const [showCloseChallengeButton, setShowCloseChallengeButton] = useState<boolean>(false);

  useEffect(() => {
    const gameMode = getRenderMode(gameState);
    setShowCloseChallengeButton(gameMode === "stage");
  }, [gameState]);

  const returnToTitle = () => {
    setGameState({
      ...gameState,
      current: {
        ...gameState.current,
        overviewDisplay: "game-overview-title",
        stageId: null,
      },
    });
  };

  const closeChallenge = () => {
    setGameState({
      ...gameState,
      current: {
        ...gameState.current,
        stageId: null,
      },
    });
  };

  return (
    <>
      <div style={{ background: "#ffffff88", backdropFilter: "blur(5px)", padding: "10px" }}>
        <button onClick={returnToTitle}>Title</button>
        {showCloseChallengeButton && <button onClick={closeChallenge}>Close</button>}
      </div>
    </>
  );
}
