import { useParams } from "react-router-dom";
import GameJson from "../components/GameJson";
import type { GameId } from "../entities/GameData";
import { GameDataProvider } from "../providers/GameDataProvider";
import GameRepositoryProvider from "../providers/GameRepositoryProvider";
import GameStateProvider from "../providers/GameStateProvider";

export function Component() {
  const { id } = useParams();

  return (<>
    <GameRepositoryProvider source={{ type: "LocalRepository" }}>
      <GameDataProvider id={id as GameId}>
        <GameStateProvider gameId={id as GameId}>
          <GameJson />
        </GameStateProvider>
      </GameDataProvider>
    </GameRepositoryProvider>
  </>);
}