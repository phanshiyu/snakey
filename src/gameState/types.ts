export interface Position {
  x: number;
  y: number;
}

export interface Fruit {
  position: Position;
  color: string;
}
export interface State {
  isGameOver: boolean;
  score: number;
  fruit?: Fruit | null;
  snake: Position[];
  snakeColor: string;
  snakeDirection: Direction;
}

export interface Direction {
  x: -1 | 0 | 1;
  y: -1 | 0 | 1;
}
