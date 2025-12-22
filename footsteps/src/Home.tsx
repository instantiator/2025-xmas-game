import Attributions from "./components/landing/Attributions";
import Dependencies from "./components/landing/Dependencies";
import LocalListing from "./components/landing/LocalListing";
import GameRepositoryProvider from "./providers/GameRepositoryProvider";

export default function Home() {
  return (
    <>
      <h1>Footsteps</h1>
      <h2>Local repository</h2>
      <GameRepositoryProvider source={{ type: "LocalRepository" }}>
        <LocalListing />
      </GameRepositoryProvider>
      <h2>Attributions</h2>
      <Attributions />
      <h2>Dependencies</h2>
      <Dependencies />
    </>
  );
}
