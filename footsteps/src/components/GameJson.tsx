import type { GameId } from "../entities/GameData";
import { useGameData } from "../providers/GameDataHook";
import { useGameState } from "../providers/GameStateHook";

export interface GameJsonParams {
  id: GameId;
}

export default function GameJson({id} : GameJsonParams) {
  const { gameData } = useGameData(id);
  const  { gameState } = useGameState();
  
  return (<>
    <div style={{display: "flex", flexDirection: "row", flexWrap: "nowrap", gap: "1rem"}}>
      <div style={{ width: "100%" }}>
        <code>
          {JSON.stringify(gameData, null, 2)}
        </code>
      </div>
      <div style={{ width: "100%" }}>
        <code>
          {JSON.stringify(gameState, null, 2)}
        </code>
      </div>
    </div>
  </>);
}