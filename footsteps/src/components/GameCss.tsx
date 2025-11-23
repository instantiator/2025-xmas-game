import { useGameData } from "../providers/GameDataHook";

export function GameCss() {
  const { game } = useGameData();
  return (<><style>{game?.css}</style></>)
}