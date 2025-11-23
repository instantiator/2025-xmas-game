import { useGameData } from "../providers/GameDataHook";
import { GameCss } from "./GameCss";

export default function Game() {
  const { game } = useGameData();
  return (<>
    <GameCss />
    <h1>{game?.title}</h1>
  </>);
}