import { useGameData } from "../providers/GameDataHook";
import { GameCss } from "./GameCss";

export default function Game() {
  const { game, state } = useGameData();
  return (<>
    {state === "ready" && <>
      <GameCss />
      <h1>{game?.title}</h1>
    </>}
  </>);
}