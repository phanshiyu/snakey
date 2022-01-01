export interface Direction {
  x: -1 | 0 | 1;
  y: -1 | 0 | 1;
}

export const GRID_SIZE = 20;
export const WORLD_LENGTH = 15;

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
