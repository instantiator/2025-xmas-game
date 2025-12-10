import { useGameData } from "../providers/GameDataHook";
import { useGameState } from "../providers/GameStateHook";

export default function GameJson() {
  const { game, state: dataState } = useGameData();
  const  { state: gameState } = useGameState();
  
  return (<>
    <div style={{display: "flex", flexDirection: "row", flexWrap: "nowrap", gap: "1rem"}}>
      <div style={{ width: "100%" }}>
        <h1>Game data ({dataState})</h1>
        <pre>
          {JSON.stringify(game, null, 2)}
        </pre>
      </div>
      <div style={{ width: "100%" }}>
        <h1>Game state</h1>
        <pre>
          {JSON.stringify(gameState, null, 2)}
        </pre>
      </div>
    </div>
  </>);
}