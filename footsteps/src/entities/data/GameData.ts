import type { CSSProperties } from "react";
import type { GameOverviewDisplay } from "./GameDisplayData";
import type { CameraModuleData } from "./GameModuleData";
import type { GameStageData } from "./GameStageData";

export type GameId = string;

export interface GameData {
  title: string;
  displays: GameOverviewDisplay[];
  modules?: {
    camera?: CameraModuleData;
  };
  stages: GameStageData[];
  gameContainerStyle: CSSProperties;
}
