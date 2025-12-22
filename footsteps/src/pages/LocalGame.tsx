import { useParams } from "react-router-dom";
import Game from "../components/core/Game";
import type { GameId } from "../entities/data/GameData";
import FeatureFlagsProvider from "../providers/FeatureFlagsProvider";
import { GameDataProvider } from "../providers/GameDataProvider";
import GameRepositoryProvider from "../providers/GameRepositoryProvider";
import GameStateProvider from "../providers/GameStateProvider";

export function Component() {
  const { id } = useParams();

  return (
    <>
      <FeatureFlagsProvider>
        <GameRepositoryProvider source={{ type: "LocalRepository" }}>
          <GameDataProvider id={id as GameId}>
            <GameStateProvider>
              <Game />
            </GameStateProvider>
          </GameDataProvider>
        </GameRepositoryProvider>
      </FeatureFlagsProvider>
    </>
  );
}
