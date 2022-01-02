import { CONTROL_DIRECTION_MAP, WORLD_LENGTH } from "./constants";
import { makeGameState } from "./makeGameState";
import { Position, State } from "./types";

function initSnake(length = 10): Position[] {
  const snake: Position[] = [];
  for (let i = length - 1; i >= 0; i -= 1) {
    snake.push({
      x: i,
      y: Math.floor(WORLD_LENGTH / 2),
    });
  }

  return snake;
}

const defaultGameState: Readonly<State> = {
  isGameOver: false,
  score: 0,
  fruit: null,
  snake: initSnake(10),
  snakeDirection: CONTROL_DIRECTION_MAP.ArrowRight,
};

export const initGameState = (snakeGameState = defaultGameState) =>
  makeGameState<Readonly<State>>(snakeGameState);

export function startGameLoop(gameState: SnakeGameState, fps: number) {
  let isEndGameLoop = false;
  function loop() {
    setTimeout(() => {
      gameState.update((state) => {
        if (state.snakeDirection.x === 0 && state.snakeDirection.y === 0)
          return state;

        const currSnakeHeadPos = state.snake[0];
        // check for collision
        for (let i = 1; i < state.snake.length; i += 1) {
          if (
            currSnakeHeadPos.x === state.snake[i].x &&
            currSnakeHeadPos.y === state.snake[i].y
          ) {
            isEndGameLoop = true;
            return {
              isGameOver: true,
            };
          }
        }

        let newSnakeHead = {
          x: currSnakeHeadPos.x + state.snakeDirection.x,
          y: currSnakeHeadPos.y + state.snakeDirection.y,
        };

        // check if pass boundary
        if (newSnakeHead.x < 0) {
          newSnakeHead.x = WORLD_LENGTH - 1;
        } else if (newSnakeHead.x >= WORLD_LENGTH) {
          newSnakeHead.x = 0;
        }
        if (newSnakeHead.y < 0) {
          newSnakeHead.y = WORLD_LENGTH - 1;
        } else if (newSnakeHead.y >= WORLD_LENGTH) {
          newSnakeHead.y = 0;
        }

        const newSnakeBoday = [...state.snake];

        let fruit = state.fruit;
        let score = state.score;
        if (
          state.fruit &&
          state.fruit.x === newSnakeHead.x &&
          state.fruit.y === newSnakeHead.y
        ) {
          // snake head touch de fruit
          fruit = null;
          score += 1;
        } else {
          newSnakeBoday.pop();
        }

        return {
          snake: [newSnakeHead, ...newSnakeBoday],
          fruit: fruit ?? {
            x: Math.floor(Math.random() * WORLD_LENGTH),
            y: Math.floor(Math.random() * WORLD_LENGTH),
          },
          score,
        };
      });

      if (!isEndGameLoop) requestAnimationFrame(loop);
    }, 1000 / fps);
  }

  requestAnimationFrame(loop);

  return () => {
    isEndGameLoop = true;
  };
}

export type SnakeGameState = ReturnType<typeof initGameState>;
