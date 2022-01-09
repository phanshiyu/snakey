import { WORLD_LENGTH } from "../constants";
import { makeGameState } from "../utils/makeGameState";
import { Direction, Position, State } from "../types";

export const initGameState = (snakeGameState: State) =>
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

  const nextSnakeHead = calculateNextSnakeHeadPosition(
    currSnakeHead,
    snakeDirection
  );

  const isNextSnakeHeadEatFruit = Boolean(
    fruit && isCollide(nextSnakeHead, fruit)
  );

  // We take the new snake head and combine it with the previous snake body parts
  // This will mean that we optistically saying that snake has grown 1 more part.
  // The next section we will check if the snake has ate a fruit, if it hasnt, we will
  // have to remove this extra part
  const nextSnake = [nextSnakeHead, ...state.snake];
  if (!isNextSnakeHeadEatFruit) nextSnake.pop();
  const nextScore = calculateNextScore(isNextSnakeHeadEatFruit, score);
  const nextFruit = calculateNextFruitPosition(isNextSnakeHeadEatFruit, fruit);

  return {
    snake: nextSnake,
    fruit: nextFruit,
    score: nextScore,
  };
}

function calculateNextSnakeHeadPosition(
  currSnakeHead: Position,
  snakeDirection: Direction,
  worldLength = WORLD_LENGTH
) {
  // Position of next snake head = snake head + one step to the current direction of the snake
  let nextSnakeHead = {
    x: currSnakeHead.x + snakeDirection.x,
    y: currSnakeHead.y + snakeDirection.y,
  };

  // Check if the new snake head lies outside of the game world boundary, which means we have to
  // 'teleport' it to the opposite side.
  const isPassLeftBoundary = nextSnakeHead.x < 0;
  const isPassRightBoundary = nextSnakeHead.x >= worldLength;
  const isPassTopBoundary = nextSnakeHead.y >= worldLength;
  const isPassBottomBoundary = nextSnakeHead.y < 0;

  if (isPassLeftBoundary) {
    nextSnakeHead.x = worldLength - 1;
  }
  if (isPassRightBoundary) {
    nextSnakeHead.x = 0;
  }
  if (isPassBottomBoundary) {
    nextSnakeHead.y = worldLength - 1;
  }
  if (isPassTopBoundary) {
    nextSnakeHead.y = 0;
  }

  return nextSnakeHead;
}

function calculateNextFruitPosition(
  isNextSnakeHeadEatFruit: boolean,
  currFruit: Position | null | undefined
) {
  let nextFruit = currFruit;
  if (isNextSnakeHeadEatFruit) {
    nextFruit = null;
  }

  if (!nextFruit) {
    // Generate a random position for de fruit
    nextFruit = {
      x: Math.floor(Math.random() * WORLD_LENGTH),
      y: Math.floor(Math.random() * WORLD_LENGTH),
    };
  }

  return nextFruit;
}

function calculateNextScore(
  isNextSnakeHeadEatFruit: boolean,
  currScore: number
) {
  return isNextSnakeHeadEatFruit ? currScore + 1 : currScore;
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
 * Checks if two positions are the same
 * @param objectOne
 * @param objectTwo
 * @returns
 */
function isCollide(objectOne: Position, objectTwo: Position): Boolean {
  return objectOne.x === objectTwo.x && objectOne.y === objectTwo.y;
}
