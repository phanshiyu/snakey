import { Direction } from "./constants";

function makeGameState<T extends Record<string, unknown>>(initGameState: T) {
  const subscribers = new Set<(state: T) => any>();
  let gameState = { ...initGameState };

  function get() {
    return gameState;
  }

  function update(
    newGameStateOrFn: ((oldState: T) => Partial<T>) | Partial<T>
  ) {
    let newGameState = {};
    if (typeof newGameStateOrFn === "function") {
      newGameState = newGameStateOrFn(gameState);
    } else {
      newGameState = newGameStateOrFn;
    }

    gameState = { ...gameState, ...newGameState };

    subscribers.forEach((fn) => {
      fn(gameState);
    });
  }

  function subscribe(callback: (oldState: T) => any) {
    subscribers.add(callback);
  }

  function unsubscribe(fn: (state: T) => any) {
    subscribers.delete(fn);
  }

  return {
    subscribe,
    unsubscribe,
    get,
    update,
    reset: () => {
      update(initGameState);
    },
  };
}

interface Coordinate {
  x: number;
  y: number;
}

function initSnake(length: 10): Coordinate[] {
  const snake: Coordinate[] = [];
  for (let i = length - 1; i >= 0; i -= 1) {
    snake.push({
      x: i,
      y: 0,
    });
  }

  return snake;
}

export const gameState = makeGameState<{
  isGameOver: boolean;
  score: number;
  fruit?: Coordinate | null;
  snake: Coordinate[];
  snakeDirection: Direction;
}>({
  isGameOver: false,
  score: 0,
  fruit: null,
  snake: initSnake(10),
  snakeDirection: {
    x: 0,
    y: 0,
  },
});
