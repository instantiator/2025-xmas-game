import { useParams } from "react-router-dom";
import Game from "../components/core/Game";
import type { GameId } from "../entities/GameData";
import { GameDataProvider } from "../providers/GameDataProvider";
import GameRepositoryProvider from "../providers/GameRepositoryProvider";
import GameStateProvider from "../providers/GameStateProvider";

export function Component() {
  const { id } = useParams();

  return (
    <>
      <GameRepositoryProvider source={{ type: "LocalRepository" }}>
        <GameDataProvider id={id as GameId}>
          <GameStateProvider>
            <Game />
          </GameStateProvider>
        </GameDataProvider>
      </GameRepositoryProvider>
    </>
  );
}
