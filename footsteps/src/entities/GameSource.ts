import type { GameRepository } from "./GameRepository";

export type GameSourceType =
  | "RemoteRepository"
  | "LocalRepository"
  | "RawRepository";

export type GameSource =
  | RemoteGameSource
  | LocalRepositoryGameSource
  | RawRepositoryGameSource;

export interface GameSourceBase {
  type: GameSourceType;
}

export interface RemoteGameSource extends GameSourceBase {
  type: "RemoteRepository";
  src: URL;
}

export interface LocalRepositoryGameSource extends GameSourceBase {
  type: "LocalRepository";
}

export interface RawRepositoryGameSource extends GameSourceBase {
  type: "RawRepository";
  repository: GameRepository;
}
