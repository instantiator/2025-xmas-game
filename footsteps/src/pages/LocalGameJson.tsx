import { useParams } from "react-router";
import GameJson from "../components/GameJson";
import type { GameId } from "../entities/GameData";
import GameRepositoryProvider from "../providers/GameRepositoryProvider";
import GameStateProvider from "../providers/GameStateProvider";

export default function LocalGameJson() {
  const { id } = useParams();

  return (<>
    <GameRepositoryProvider source={{ type: "LocalRepository" }}>
      <GameStateProvider gameId={id as GameId}>
        <GameJson id={id as GameId} />
      </GameStateProvider>
    </GameRepositoryProvider>
    </>);
}