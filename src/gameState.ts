import { CONTROL_DIRECTION_MAP, WORLD_LENGTH } from "./constants";
import { makeGameState } from "./utils/makeGameState";
import { Position, State } from "./types";

// Our starting game state
const INITIAL_GAME_STATE = Object.freeze({
  // Freeze it to make it read-only
  isGameOver: false,
  score: 0,
  fruit: null,
  snake: initSnake(10),
  snakeDirection: CONTROL_DIRECTION_MAP.ArrowRight,
});

export const initGameState = (snakeGameState = INITIAL_GAME_STATE) =>
  makeGameState<Readonly<State>>(snakeGameState);

export type SnakeGameState = ReturnType<typeof initGameState>;

export function calculateNextGameState(state: State): Partial<State> {
  const { snakeDirection, snake, fruit, score } = state;

  // If snake is not even moving, the next game state should be exactly the same
  const isSnakeNotMoving = snakeDirection.x === 0 && snakeDirection.y === 0;
  if (isSnakeNotMoving) return state;

  if (snakeEatHimself(snake)) {
    return {
      isGameOver: true,
    };
  }

  const currSnakeHead = snake[0];

  // Position of next snake head = snake head + one step to the current direction of the snake
  let nextSnakeHead = {
    x: currSnakeHead.x + snakeDirection.x,
    y: currSnakeHead.y + snakeDirection.y,
  };

  // Check if the new snake head lies outside of the game world boundary, which means we have to
  // 'teleport' it to the opposite side.
  const isPassLeftBoundary = nextSnakeHead.x < 0;
  const isPassRightBoundary = nextSnakeHead.x >= WORLD_LENGTH;
  const isPassTopBoundary = nextSnakeHead.y >= WORLD_LENGTH;
  const isPassBottomBoundary = nextSnakeHead.y < 0;

  if (isPassLeftBoundary) {
    nextSnakeHead.x = WORLD_LENGTH - 1;
  }
  if (isPassRightBoundary) {
    nextSnakeHead.x = 0;
  }
  if (isPassBottomBoundary) {
    nextSnakeHead.y = WORLD_LENGTH - 1;
  }
  if (isPassTopBoundary) {
    nextSnakeHead.y = 0;
  }

  const nextSnake = [nextSnakeHead, ...state.snake];

  let nextFruit = fruit;
  let nextScore = score;
  const isNextSnakeHeadEatFruit = fruit && isCollide(nextSnakeHead, fruit);

  if (isNextSnakeHeadEatFruit) {
    // snake head touch de fruit
    nextFruit = null;
    nextScore += 1;
  } else {
    nextSnake.pop();
  }

  return {
    snake: nextSnake,
    fruit: nextFruit ?? {
      x: Math.floor(Math.random() * WORLD_LENGTH),
      y: Math.floor(Math.random() * WORLD_LENGTH),
    },
    score: nextScore,
  };
}

function snakeEatHimself(snake: Position[]) {
  const snakeHead = snake[0];
  // check for collision
  for (let i = 1; i < snake.length; i += 1) {
    const snakePart = snake[i];
    if (isCollide(snakeHead, snakePart)) {
      return true;
    }
  }
  return false;
}

/**
 * Given the length of the snake, creates a snake horizontally positioned
 * approximately vertically middle of the game world
 * @param length number of snake parts to create
 * @returns
 */
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

/**
 * Checks if two positions are the same
 * @param objectOne
 * @param objectTwo
 * @returns
 */
function isCollide(objectOne: Position, objectTwo: Position): Boolean {
  return objectOne.x === objectTwo.x && objectOne.y === objectTwo.y;
}
