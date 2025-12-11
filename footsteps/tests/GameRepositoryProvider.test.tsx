import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import localRepository from "../src/assets/game-repository.json";
import type { GameSource } from "../src/entities/GameSource";
import { GameRepositoryContext, type GameRepositoryContextType } from "../src/providers/GameRepositoryContext";
import GameRepositoryProvider from "../src/providers/GameRepositoryProvider";

describe("GameRepositoryProvider", () => {
  it("loads the local repository", () => {
    const source: GameSource = { type: "LocalRepository" };
    let contextValue: GameRepositoryContextType | undefined;

    render(
      <GameRepositoryProvider source={source}>
        <GameRepositoryContext.Consumer>
          {(context) => {
            contextValue = context;
            return null;
          }}
        </GameRepositoryContext.Consumer>
      </GameRepositoryProvider>,
    );

    expect(contextValue).toBeDefined();
    expect(contextValue!.source).toEqual(source);
    expect(contextValue!.repository).toEqual({
      ...localRepository,
      ready: true,
      loading: false,
    });
    expect(contextValue!.repository.games["test-game"]).toBeDefined();
  });
});
