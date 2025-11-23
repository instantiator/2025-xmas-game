import type { GameId } from "../entities/GameData";
import { useGameData } from "../providers/GameDataHook";

export interface GameParams {
  id: GameId;
}

export default function Game({id} : GameParams) {
  const gameData = useGameData(id);
  return (<>
    <code>
      {JSON.stringify(gameData, null, 2)}
    </code>
  </>);
}