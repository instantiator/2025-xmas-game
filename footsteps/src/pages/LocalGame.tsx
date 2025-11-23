import { useParams } from "react-router";
import Game from "../components/Game";
import type { GameId } from "../entities/GameData";
import GameRepositoryProvider from "../providers/GameRepositoryProvider";
import GameStateProvider from "../providers/GameStateProvider";

export default function LocalGame() {
  const { id } = useParams();

  return (<>
    <GameRepositoryProvider source={{ type: "LocalRepository" }}>
      <GameStateProvider gameId={id as GameId}>
        <Game id={id as GameId} />
      </GameStateProvider>
    </GameRepositoryProvider>
    </>);
}