import { Direction } from "./types";

export const GRID_SIZE = 20;
export const WORLD_LENGTH = 15;
export const FRAMES_PER_SECOND = 10;

export const CONTROL_DIRECTION_MAP: Record<string, Direction> = {
  ArrowDown: {
    x: 0,
    y: -1,
  },
  ArrowUp: {
    x: 0,
    y: 1,
  },
  ArrowLeft: {
    x: -1,
    y: 0,
  },
  ArrowRight: {
    x: 1,
    y: 0,
  },
};
