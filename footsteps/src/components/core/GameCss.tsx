import { useGameData } from "../../providers/GameDataHook";

export function GameCss() {
  const { gameData: game } = useGameData();
  return (
    <>
      <style>{game?.css}</style>
    </>
  );
}
