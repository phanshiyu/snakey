export interface Position {
  x: number;
  y: number;
}

export interface State {
  isGameOver: boolean;
  score: number;
  fruit?: Position | null;
  snake: Position[];
  snakeDirection: Direction;
}

export interface Direction {
  x: -1 | 0 | 1;
  y: -1 | 0 | 1;
}
