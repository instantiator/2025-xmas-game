import { useGameData } from "../providers/GameDataHook";
import { useGameState } from "../providers/GameStateHook";

export default function GameJson() {
  const { game } = useGameData();
  const  { state } = useGameState();
  
  return (<>
    <div style={{display: "flex", flexDirection: "row", flexWrap: "nowrap", gap: "1rem"}}>
      <div style={{ width: "100%" }}>
        <pre>
          {JSON.stringify(game, null, 2)}
        </pre>
      </div>
      <div style={{ width: "100%" }}>
        <pre>
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    </div>
  </>);
}